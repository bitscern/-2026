
import { NextResponse } from 'next/server';

const POSITIVE_TERMS = ["天庭饱满", "地阁方圆", "山根隆起", "双目有神", "印堂发亮", "三停均称", "五岳朝拱", "准头圆润", "辅角宽厚", "神采奕奕", "华盖云集", "气若长虹"];

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: '法相缺失' }, { status: 400 });

    const ARK_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
    const { ARK_API_KEY: API_KEY, ARK_ENDPOINT_ID: ENDPOINT_ID } = process.env;

    if (!API_KEY || !ENDPOINT_ID) {
      return NextResponse.json({ error: '宗师未就位（配置缺失）' }, { status: 500 });
    }

    // --- 第一阶段：视觉解析 (Ark Vision 适配) ---
    // 采用极致紧凑的指令，降低输入 Token
    const stage1Response = await fetch(ARK_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${API_KEY}` 
      },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: [{
          role: "user",
          content: [
            { type: "text", text: "作为专业视觉观测员，提取图中8个面部核心特征(形态/气色/眼神)及显著手势。以JSON数组形式按区域(FOREHEAD, EYES, NOSE, MOUTH, CHIN, CHEEK_L, CHEEK_R, FULL)输出关键描述。" },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } }
          ]
        }],
        response_format: { type: "json_object" }
      })
    });

    const stage1Data = await stage1Response.json();
    const observationFacts = stage1Data.choices[0]?.message?.content || "{}";

    // --- 第二阶段：宗师灵鉴 (降本增效版) ---
    // 移除 observations 字段输出，大幅节省输出 Token
    const stage2Prompt = `【视觉事实】：${observationFacts}
作为相学宗师，请据此输出《相心灵鉴》报告。
【铁律】：
1. masterInsight.poem 与 summary 严禁出现字母(如V, OK)、数字或现代标点。现代手势(如V字)需转为古风意向(如：双指呈瑞、灵犀开峰)。
2. 必用术语：${POSITIVE_TERMS.join('、')}。
3. personalityProfile 需有深度演化心理学洞察，不得少于200字。

JSON格式：
{
  "score": 评分(60-99),
  "fiveElement": "金/木/水/火/土",
  "elementAnalysis": "格局推演",
  "masterInsight": { "poem": "七言判词", "summary": "核心批语" },
  "palaces": [{"name": "宫位名", "status": "优/平/变", "analysis": "解析"}],
  "personalityProfile": "心性根基深度剖析",
  "socialGuide": "人际避坑与进阶建议",
  "hobbies": ["修心方案1", "2", "3"],
  "auraStatus": "气韵态势",
  "auraMessage": "今日箴言",
  "workplace": { "role": "定位", "strengths": ["优势1", "2", "3"], "advice": "进阶策论" },
  "advancedLog": { "boneStructure": "骨相解构", "spiritAnalysis": "精气神监控", "potentialRisks": "性格红线" }
}`;

    const stage2Response = await fetch(ARK_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${API_KEY}` 
      },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: [{ role: "user", content: stage2Prompt }],
        response_format: { type: "json_object" }
      })
    });

    const finalResult = await stage2Response.json();
    const parsed = JSON.parse(finalResult.choices[0].message.content);
    
    // 安全兜底：二次物理清除判词中的现代字符
    if (parsed.masterInsight) {
      parsed.masterInsight.poem = parsed.masterInsight.poem.replace(/[a-zA-Z0-9]/g, '');
    }

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("Ark API Error:", error);
    return NextResponse.json({ error: '灵鉴中断，请确保面相清晰且网络通畅' }, { status: 500 });
  }
}
