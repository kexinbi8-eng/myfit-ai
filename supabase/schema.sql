-- MyFit AI: single-user-ready schema. Enable RLS before connecting a real auth user.
create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null default '我的账户',
  timezone text not null default 'Asia/Shanghai',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  target_weight numeric(6,2), target_waist numeric(6,2), target_body_fat numeric(5,2),
  daily_calorie_target integer not null default 1900,
  daily_protein_target numeric(6,2) not null default 130,
  daily_step_target integer not null default 8000,
  weekly_workout_target integer not null default 4,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(), name text not null, category text not null default '其他',
  calories_per_100g numeric(8,2) not null default 0, protein_per_100g numeric(8,2) not null default 0,
  carbs_per_100g numeric(8,2) not null default 0, fat_per_100g numeric(8,2) not null default 0,
  default_unit text not null default 'g', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists inventory (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references profiles(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id), quantity numeric(10,2) not null check (quantity >= 0),
  unit text not null default 'g', purchase_price numeric(10,2), purchase_date date, expiry_date date,
  storage_method text, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists recipes (
  id uuid primary key default gen_random_uuid(), profile_id uuid references profiles(id) on delete cascade,
  name text not null, description text, calories numeric(8,2) not null default 0, protein numeric(8,2) not null default 0,
  carbs numeric(8,2) not null default 0, fat numeric(8,2) not null default 0, estimated_cost numeric(10,2) not null default 0,
  steps jsonb not null default '[]', cook_time_minutes integer, difficulty text, tags text[] not null default '{}',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists recipe_ingredients (
  recipe_id uuid not null references recipes(id) on delete cascade, ingredient_id uuid not null references ingredients(id),
  quantity numeric(10,2) not null check (quantity > 0), unit text not null default 'g',
  primary key (recipe_id, ingredient_id)
);

create table if not exists daily_logs (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references profiles(id) on delete cascade,
  log_date date not null, steps integer not null default 0, exercise_minutes integer not null default 0,
  calories integer not null default 0, protein numeric(8,2) not null default 0, notes text,
  unique(profile_id, log_date)
);

create table if not exists meal_records (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references profiles(id) on delete cascade,
  log_date date not null, meal_type text not null check (meal_type in ('breakfast','lunch','dinner','snack')),
  created_at timestamptz not null default now()
);

create table if not exists meal_items (
  id uuid primary key default gen_random_uuid(), meal_record_id uuid not null references meal_records(id) on delete cascade,
  ingredient_id uuid references ingredients(id), food_name text not null, quantity numeric(10,2) not null,
  unit text not null default 'g', calories numeric(8,2) not null default 0, protein numeric(8,2) not null default 0,
  carbs numeric(8,2) not null default 0, fat numeric(8,2) not null default 0
);

create table if not exists workout_plans (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references profiles(id) on delete cascade,
  name text not null, weekday smallint, notes text, created_at timestamptz not null default now()
);

create table if not exists workout_exercises (
  id uuid primary key default gen_random_uuid(), workout_plan_id uuid not null references workout_plans(id) on delete cascade,
  name text not null, sets integer not null default 3, rep_min integer, rep_max integer, rest_seconds integer
);

create table if not exists workout_records (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references profiles(id) on delete cascade,
  workout_plan_id uuid references workout_plans(id), started_at timestamptz not null default now(), completed_at timestamptz, notes text
);

create table if not exists workout_sets (
  id uuid primary key default gen_random_uuid(), workout_record_id uuid not null references workout_records(id) on delete cascade,
  exercise_name text not null, set_number integer not null, weight numeric(8,2), reps integer, rpe numeric(3,1), notes text, completed_at timestamptz
);

create table if not exists body_metrics (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references profiles(id) on delete cascade,
  measured_at timestamptz not null default now(), weight numeric(6,2), waist numeric(6,2), body_fat numeric(5,2), source text default 'manual'
);

create table if not exists sleep_records (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references profiles(id) on delete cascade,
  sleep_date date not null, duration_minutes integer, quality smallint check (quality between 1 and 5), notes text,
  unique(profile_id, sleep_date)
);

create table if not exists ai_conversations (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references profiles(id) on delete cascade,
  title text not null default 'AI 健身教练', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists ai_messages (
  id uuid primary key default gen_random_uuid(), conversation_id uuid not null references ai_conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','tool')), content text not null, tool_name text, created_at timestamptz not null default now()
);

-- Prevent inventory from going negative when a recipe consumes stock.
create or replace function consume_inventory(p_inventory_id uuid, p_quantity numeric)
returns inventory language plpgsql security definer as $$
declare v_inventory inventory;
begin
  if p_quantity <= 0 then raise exception 'quantity must be positive'; end if;
  update inventory set quantity = quantity - p_quantity, updated_at = now()
  where id = p_inventory_id and quantity >= p_quantity
  returning * into v_inventory;
  if not found then raise exception '当前库存不足'; end if;
  return v_inventory;
end; $$;

-- Consume every ingredient in a recipe atomically. If any item is short,
-- the whole transaction fails and no inventory row is changed.
create or replace function consume_recipe_inventory(p_profile_id uuid, p_recipe_id uuid)
returns void language plpgsql security definer as $$
declare v_item record; v_inventory_id uuid;
begin
  for v_item in
    select ri.ingredient_id, ri.quantity
    from recipe_ingredients ri
    where ri.recipe_id = p_recipe_id
  loop
    select i.id into v_inventory_id
    from inventory i
    where i.profile_id = p_profile_id and i.ingredient_id = v_item.ingredient_id
    order by i.expiry_date nulls last, i.created_at
    limit 1
    for update;
    if v_inventory_id is null then raise exception '当前库存不足'; end if;
    perform consume_inventory(v_inventory_id, v_item.quantity);
  end loop;
end; $$;

create index if not exists inventory_expiry_idx on inventory(profile_id, expiry_date);
create index if not exists body_metrics_time_idx on body_metrics(profile_id, measured_at desc);
