-- Optional starter data for a personal development profile.
insert into profiles (id, display_name, timezone)
values ('00000000-0000-0000-0000-000000000001', '我的账户', 'Asia/Shanghai')
on conflict (id) do nothing;

insert into goals (profile_id, daily_calorie_target, daily_protein_target, daily_step_target, weekly_workout_target)
values ('00000000-0000-0000-0000-000000000001', 1900, 130, 8000, 4)
on conflict do nothing;

insert into ingredients (id, name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, default_unit)
values
  ('00000000-0000-0000-0000-000000000101', '鸡胸肉', '禽类', 133, 24, 0, 3, 'g'),
  ('00000000-0000-0000-0000-000000000102', '西兰花', '蔬菜', 34, 2.8, 7, 0.4, 'g'),
  ('00000000-0000-0000-0000-000000000103', '胡萝卜', '蔬菜', 41, 0.9, 10, 0.2, 'g'),
  ('00000000-0000-0000-0000-000000000104', '鸡蛋', '蛋类', 143, 12.6, 0.7, 9.5, '个'),
  ('00000000-0000-0000-0000-000000000105', '贝贝南瓜', '蔬菜', 45, 1.1, 10, 0.1, 'g')
on conflict (id) do nothing;

insert into inventory (profile_id, ingredient_id, quantity, unit, purchase_price, expiry_date)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 400, 'g', 9, current_date + 2),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 300, 'g', 4, current_date + 1),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103', 200, 'g', 2, current_date + 4),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000104', 6, '个', 6, current_date + 8),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000105', 500, 'g', 5, current_date + 6);
