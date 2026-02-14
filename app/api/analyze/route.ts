
import { NextResponse } from 'next/server';

const POSITIVE_TERMS = ["天庭饱满", "地阁方圆", "山根隆起", "双目有神", "印堂发亮", "三停均称", "五岳朝拱", "准头圆润", "辅角宽厚", "神采奕奕", "华盖云集", "气若长虹"];

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: '法相缺失' }, { status: 400 });

    const ARK_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
    const { ARK_API_KEY: API_KEY, ARK_ENDPOINT_ID: ENDPOINT_ID } = process.env;

    if (!API_KEY || !ENDPOINT_ID) return NextResponse.json({ error: '配置缺失' }, { status: 500 });

    // --- Stage 1: 视觉特征提取 (极简) ---
    const stage1Response = await fetch(ARK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: [{
          role: "user",
          content: [
            { type: "text", text: "提取图中8个核心面部特征(形态/气色/眼神/手势)，归类至：FOREHEAD, EYES, NOSE, MOUTH, CHIN, CHEEK_L, CHEEK_R, FULL。只输出JSON数组对象。" },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } }
          ]
        }],
        response_format: { type: "json_object" }
      })
    });

    const stage1Data = await stage1Response.json();
    const observationFacts = stage1Data.choices[0].message.content;

    // --- Stage 2: 深度灵鉴 (极简+严约束) ---
    // 移除了 observations 输出，大幅节省输出 Token
    const stage2Prompt = `事实：${observationFacts}。
你是相学宗师。请输出深度灵鉴报告。
约束：
1. masterInsight.poem/summary严禁英文、数字、V字等现代字符，需将现代手势化为古风意向。
2. 必用术语：${POSITIVE_TERMS.join('、')}。
3. 纯JSON输出，无须包含原始观测。

JSON格式：
{
  "score": 评分,
  "fiveElement": "五行",
  "elementAnalysis": "性格推演",
  "masterInsight": { "poem": "七言判词", "summary": "核心批语" },
  "palaces": [{"name": "命宫/官禄宫/迁移宫/财帛宫/福德宫/兄弟宫", "status": "优/平/变", "analysis": "解析"}],
  "personalityProfile": "心性深度描述(200字以上)",
  "socialGuide": "人际建议",
  "hobbies": ["方案1", "2", "3"],
  "auraStatus": "气韵描述",
  "auraMessage": "今日箴言",
  "workplace": { "role": "定位", "strengths": ["优势1", "2", "3"], "advice": "进阶建议" },
  "advancedLog": { "boneStructure": "骨相", "spiritAnalysis": "精气神", "potentialRisks": "警示" }
}`;

    const stage2Response = await fetch(ARK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: [{ role: "user", content: stage2Prompt }],
        response_format: { type: "json_object" }
      })
    });

    const finalResult = await stage2Response.json();
    return NextResponse.json(JSON.parse(finalResult.choices[0].message.content));

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
