
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    
    if (!image) {
      return NextResponse.json({ error: '法相缺失' }, { status: 400 });
    }

    // 火山方舟 API 配置
    const ARK_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
    const API_KEY = process.env.ARK_API_KEY;
    const ENDPOINT_ID = process.env.ARK_ENDPOINT_ID; 

    if (!API_KEY || !ENDPOINT_ID) {
      console.error("Missing Ark API Key or Endpoint ID");
      return NextResponse.json({ error: '系统灵气不足，配置未就绪' }, { status: 500 });
    }

    // 深度提示词：将 AI 塑造为相学大师
    const systemPrompt = `你是一位融合了中国传统《公笃相法》、《神相全编》与现代演化心理学的顶级相学宗师。
你的任务是根据用户的“法相”（照片），进行极深度的心性推演。

请严格遵循以下专业观察逻辑：
1. **察其骨法**：重点观察天庭（额头）、山根（鼻根）、颧骨的饱满度。
2. **辨其精神**：通过眼神的聚散、藏露判断其意志力。
3. **明其三停**：上停主早年与智慧，中停主中年与执行力，下停主晚年与财富格局。

输出要求：文字必须古雅且精准，带有一代宗师的威严感。
请严格按照以下 JSON 格式返回，严禁任何额外解释：

{
  "score": 数字(0-100),
  "fiveElement": "木/火/土/金/水",
  "elementAnalysis": "结合五行格局与骨法特征的深度解析，字数100字左右",
  "masterInsight": {
    "poem": "七言绝句判词，展现宗师气象",
    "summary": "一句话点破天机"
  },
  "observations": [
    {
      "feature": "如：山根平满",
      "description": "对此特征具体的视觉化描述，让用户觉得你真的在看他",
      "significance": "该特征在相学中的具体含义"
    }
  ],
  "palaces": [
    {"name": "命宫", "status": "优/良/中", "analysis": "详细解析"},
    {"name": "财帛宫", "status": "优/良/中", "analysis": "详细解析"},
    {"name": "官禄宫", "status": "优/良/中", "analysis": "详细解析"}
  ],
  "riskMetrics": [
    {"label": "心性定力", "value": "85%", "traditionalTerm": "神藏", "description": "具体解析"}
  ],
  "karma": {"past": "宿命渊源", "present": "现世定位", "future": "因果愿景"},
  "workplace": {
    "role": "职场定位",
    "strengths": ["优势1", "优势2"],
    "advice": "具体的进阶规劝",
    "compatibility": "契合的人格描述"
  },
  "personalityProfile": "极其精准的性格总结",
  "socialGuide": "与此人交往的锦囊妙计",
  "hobbies": ["陶冶情操的具体建议"],
  "auraStatus": "气色断语",
  "auraMessage": "今日灵感箴言",
  "moles": [{"position": "位置", "nature": "吉/凶/平", "meaning": "含义"}]
}`;

    const arkResponse = await fetch(ARK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: systemPrompt },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } }
            ]
          }
        ],
        // 要求模型返回 JSON 对象
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    if (!arkResponse.ok) {
      const errorText = await arkResponse.text();
      console.error("Ark API Error:", errorText);
      return NextResponse.json({ error: '宗师正在闭关，请稍后再试' }, { status: 502 });
    }

    const data = await arkResponse.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("模型未吐露天机");
    }

    return NextResponse.json(JSON.parse(content));

  } catch (error: any) {
    console.error("API Route Exception:", error);
    return NextResponse.json({ error: '玄机难测，系统处理失败' }, { status: 500 });
  }
}
