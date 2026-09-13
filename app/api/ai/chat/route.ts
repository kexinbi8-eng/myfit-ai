import { NextResponse } from "next/server";
import { buildHealthContext, HEALTH_TOOLS, runHealthTool } from "@/lib/ai/tools";
import { healthSystemPrompt } from "@/lib/ai/provider";

export async function POST(request: Request) {
  const body = (await request.json()) as { message?: string; history?: Array<{ role: "user" | "assistant"; content: string }> };
  if (!body.message?.trim()) return NextResponse.json({ error: "请输入问题" }, { status: 400 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ reply: "AI 服务尚未配置。你可以先在 .env.local 中设置 OPENAI_API_KEY；当前首页数据和库存演示已可继续使用。", configured: false });

  const healthContext = await buildHealthContext();
  const input = [
    ...(body.history ?? []).slice(-8),
    { role: "user" as const, content: `${body.message}\n\n这是当前账户的实时健康上下文，请以此为准：\n${healthContext}` },
  ];
  let currentInput: unknown[] = input;
  for (let round = 0; round < 2; round += 1) {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5", instructions: healthSystemPrompt(), input: currentInput, tools: HEALTH_TOOLS, tool_choice: "auto", store: false }),
    });
    if (!response.ok) return NextResponse.json({ error: "AI 服务暂时不可用" }, { status: 502 });
    const result = (await response.json()) as { output_text?: string; output?: Array<{ type?: string; name?: string; call_id?: string; arguments?: string }> };
    const calls = (result.output ?? []).filter((item) => item.type === "function_call" && item.name && item.call_id);
    if (calls.length === 0) return NextResponse.json({ reply: result.output_text || "我暂时没有生成有效建议，请再试一次。", configured: true });
    const toolOutputs = await Promise.all(calls.map(async (call) => ({ type: "function_call_output", call_id: call.call_id as string, output: JSON.stringify(await runHealthTool(call.name as string, call.arguments)) })));
    currentInput = [...currentInput, ...(result.output ?? []), ...toolOutputs];
  }
  return NextResponse.json({ reply: "我读取了你的健康数据，但这次分析超时了，请再试一次。", configured: true });
}
