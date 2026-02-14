
import { NextResponse } from 'next/server';

const POSITIVE_TERMS = ["天庭", "地阁", "山根", "颧骨", "印堂", "三停", "五岳", "准头", "辅角", "伏吟"];
const FORBIDDEN_TERMS = ["你很有潜力", "顺其自然", "心诚则灵", "一切随缘", "可能", "大概"];

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: '法相缺失' }, { status: 400 });

    const ARK_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
    const API_KEY = process.env.ARK_API_KEY;
    const ENDPOINT_ID = process.env.ARK_ENDPOINT_ID;

    if (!API_KEY || !ENDPOINT_ID) {
      return NextResponse.json({ error: '系统配置未就绪' }, { status: 500 });
    }

    // --- STAGE 1: 增加区域标记要求 ---
    const stage1Prompt = `你是一位冷静的法相观察员。
任务：从照片中提取纯粹的视觉特征，并标记所属区域。
区域编码 (region) 必须且只能是：FOREHEAD, EYES, NOSE, MOUTH, CHIN, CHEEK_L, CHEEK_R, FULL。

输出格式：
{
  "rawObservations": [
    {"feature": "部位", "evidence": "描述", "significance": "含义", "confidence": 0.9, "region": "编码"}
  ],
  "boneStructure": "描述",
  "spirit": "描述"
}`;

    let stage1Response = await fetch(ARK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: [{ role: "user", content: [{ type: "text", text: stage1Prompt }, { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } }] }],
        response_format: { type: "json_object" },
        temperature: 0.2
      })
    });

    let stage1Data = await stage1Response.json();
    let observationFacts = JSON.parse(stage1Data.choices[0].message.content);

    // --- STAGE 2: 保持区域标记 ---
    const stage2Prompt = `你是一位顶级相学宗师。基于以下观察事实撰写报告。
务必保留每个观察项对应的 "region" 字段。
事实：${JSON.stringify(observationFacts)}

... (其他约束保持不变) ...
返回 JSON 结构需包含原有的 observations 数组（带 region）。`;

    const stage2Response = await fetch(ARK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: [{ role: "user", content: stage2Prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    const finalResult = await stage2Response.json();
    let finalContent = JSON.parse(finalResult.choices[0].message.content);

    return NextResponse.json(finalContent);

  } catch (error: any) {
    return NextResponse.json({ error: '系统解析异常' }, { status: 500 });
  }
}
