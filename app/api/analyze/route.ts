
import { NextResponse } from 'next/server';

// --- 配置文件与硬约束 ---
const POSITIVE_TERMS = ["天庭", "地阁", "山根", "颧骨", "印堂", "三停", "五岳", "准头", "辅角", "伏吟"];
const FORBIDDEN_TERMS = ["你很有潜力", "顺其自然", "心诚则灵", "一切随缘", "可能", "大概"];

const FEW_SHOT_EXAMPLES = `
示例 1：
事实：{"feature": "山根", "evidence": "山根低陷且有细微横纹", "confidence": 0.9}
宗师批命：[断言] 山根陷而横纹断，根基受损，早年奔波。
示例 2：
事实：{"feature": "眼神", "evidence": "目含流光但视线稍有漂移", "confidence": 0.5}
宗师批命：[建议] 神虽聚而光微散，才华横溢然心性未定，宜修剪杂念。
`;

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

    // --- STAGE 1: 冷静观察阶段 (Objective Observation) ---
    const stage1Prompt = `你是一位冷静的法相观察员。
任务：从照片中提取纯粹的解剖学/视觉特征。
要求：
1. 必须包含至少 3 个观察点。
2. 每个点结构：[特征部位] + [可见证据描述] + [相理基础含义]。
3. 严禁任何文学润色，严禁空泛套话。
4. 必须输出 JSON。

输出格式：
{
  "rawObservations": [
    {"feature": "部位", "evidence": "如：额头正中有一颗暗红色痣", "significance": "含义", "confidence": 0.95}
  ],
  "boneStructure": "骨相描述",
  "spirit": "眼神状态描述"
}`;

    let stage1Response = await fetch(ARK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: [{ role: "user", content: [{ type: "text", text: stage1Prompt }, { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } }] }],
        response_format: { type: "json_object" },
        temperature: 0.2 // 极致客观
      })
    });

    let stage1Data = await stage1Response.json();
    let observationFacts = JSON.parse(stage1Data.choices[0].message.content);

    // --- QUALITY LOOP (质量校验与自动修复) ---
    if (observationFacts.rawObservations.length < 3) {
      // 触发一次修复补救：要求模型重新深入观察
      const repairResponse = await fetch(ARK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: ENDPOINT_ID,
          messages: [
            { role: "user", content: "观察不足。请重新审视照片，至少提供 4 个微观特征，包含皮肤纹理或骨骼走势。" },
            { role: "assistant", content: JSON.stringify(observationFacts) }
          ],
          response_format: { type: "json_object" },
          temperature: 0.3
        })
      });
      const repairData = await repairResponse.json();
      observationFacts = JSON.parse(repairData.choices[0].message.content);
    }

    // --- STAGE 2: 宗师批命阶段 (The Master Interpretation) ---
    const stage2Prompt = `你是一位顶级相学宗师。
基于以下【实测事实报告】，请撰写灵鉴报告。

【实测事实报告】：
${JSON.stringify(observationFacts)}

【参考范式与Few-shot】：
${FEW_SHOT_EXAMPLES}

【硬约束 Rubric】：
1. 判词诗句：七言四句，必须融入事实报告中的一个“视觉证据”关键词（如：痣、纹、满）。
2. 置信度逻辑：
   - Confidence > 0.8: 使用“铁定”、“必见”、“定是”等断言；
   - Confidence 0.5-0.8: 使用“倾向”、“若此则”、“或有”；
   - Confidence < 0.5: 给出“疑虑，建议补充侧面照”或“模糊”建议。
3. 术语库：必须至少使用 2 个术语：${POSITIVE_TERMS.join('、')}。
4. 禁用词：严禁出现 ${FORBIDDEN_TERMS.join('、')}。
5. 字数区间：elementAnalysis 必须在 [80, 120] 字之间。

返回完整 JSON：
{
  "score": 0-100,
  "fiveElement": "木/火/土/金/水",
  "elementAnalysis": "解析内容...",
  "masterInsight": {"poem": "七言绝句", "summary": "金句"},
  "observations": [], // 包含 evidence 且融入置信度语气的润色版
  "palaces": [],
  "personalityProfile": "推演...",
  "socialGuide": "指南...",
  "hobbies": [],
  "auraStatus": "状态",
  "auraMessage": "箴言",
  "workplace": {"role": "角色", "strengths": [], "advice": "建议"},
  "advancedLog": {
    "boneStructure": "深度解析",
    "spiritAnalysis": "精气神",
    "potentialRisks": "预警"
  }
}`;

    const stage2Response = await fetch(ARK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: [{ role: "user", content: stage2Prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7 // 文学发挥
      })
    });

    const finalResult = await stage2Response.json();
    let finalContent = JSON.parse(finalResult.choices[0].message.content);

    // --- 最终套话扫描与二次清洗 (Final Polish) ---
    const contentStr = JSON.stringify(finalContent);
    if (FORBIDDEN_TERMS.some(term => contentStr.includes(term))) {
      // 如果发现禁用词，进行一次轻量级替换引导
      const polishResponse = await fetch(ARK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: ENDPOINT_ID,
          messages: [
             { role: "user", content: `报告中包含套话，请将以下 JSON 中的泛化表述替换为更具体的相学推演：${JSON.stringify(finalContent)}` }
          ],
          response_format: { type: "json_object" },
          temperature: 0.1
        })
      });
      const polishData = await polishResponse.json();
      finalContent = JSON.parse(polishData.choices[0].message.content);
    }

    return NextResponse.json(finalContent);

  } catch (error: any) {
    console.error("Pipeline Failure:", error);
    return NextResponse.json({ error: '玄机难测，请确保法相清晰，稍后再试' }, { status: 500 });
  }
}
