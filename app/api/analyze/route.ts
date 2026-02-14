
import { NextResponse } from 'next/server';

/**
 * 火山方舟 (Volcengine Ark) 灵鉴后端服务
 * 采用双阶段分析：1. 视觉特征提取 -> 2. 相学模型推演
 */

const POSITIVE_TERMS = ["天庭饱满", "地阁方圆", "山根隆起", "双目有神", "印堂发亮", "三停均称", "五岳朝拱", "准头圆润", "辅角宽厚", "神采奕奕"];
const FORBIDDEN_TERMS = ["你很有潜力", "顺其自然", "心诚则灵", "一切随缘", "可能", "大概", "或许", "Maybe", "Potential"];

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: '法相缺失，无法参详' }, { status: 400 });

    const ARK_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
    const API_KEY = process.env.ARK_API_KEY;
    const ENDPOINT_ID = process.env.ARK_ENDPOINT_ID;

    if (!API_KEY || !ENDPOINT_ID) {
      return NextResponse.json({ error: '宗师未就位（系统配置异常）' }, { status: 500 });
    }

    // --- 第一阶段：视觉解构 (Vision Decomposition) ---
    // 重点在于客观描述面部纹路、骨骼走向
    const stage1Prompt = `你是一位冷峻的视觉观察员。
你的任务是：
1. 观察照片中的面部细节。
2. 提取 5-8 个核心视觉特征。
3. 每个特征必须归类到以下区域之一：FOREHEAD, EYES, NOSE, MOUTH, CHIN, CHEEK_L, CHEEK_R, FULL。
4. 输出必须是纯 JSON。

JSON 结构示例：
{
  "rawObservations": [
    {"feature": "特征名称", "evidence": "客观描述（如：弧度向上、纹路深厚）", "significance": "面相学预兆", "region": "FOREHEAD"}
  ],
  "boneStructure": "骨相描述",
  "spirit": "眼神与神态描述"
}`;

    const stage1Response = await fetch(ARK_URL, {
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
              { type: "text", text: stage1Prompt },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } }
            ]
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1 // 降低随机性，确保客观
      })
    });

    if (!stage1Response.ok) throw new Error('火山方舟视觉解析异常');
    const stage1Data = await stage1Response.json();
    const observationFacts = JSON.parse(stage1Data.choices[0].message.content);

    // --- 第二阶段：宗师推演 (Master Interpretation) ---
    // 重点在于文化深度、五行建模与语言美感
    const stage2Prompt = `你是一位精通传统相学与演化心理学的宗师级人物。
基于以下观察事实，撰写一份极致专业的“相心灵鉴报告”。

观察事实：
${JSON.stringify(observationFacts)}

规则要求：
1. 语言风格：典雅、神秘、具有深度，类似《麻衣神相》与现代心理学的结合。
2. 绝对禁止使用英文，所有术语必须汉化。
3. 使用以下正向术语增强权威感：${POSITIVE_TERMS.join('、')}。
4. 严禁使用废话，如：${FORBIDDEN_TERMS.join('、')}。
5. 必须输出完整的 JSON。

JSON 结构要求：
{
  "score": 评分(60-99),
  "fiveElement": "金/木/水/火/土",
  "elementAnalysis": "详细的五行性格演化分析",
  "masterInsight": {
    "poem": "七言或五言判词一首，描述此人格局",
    "summary": "一句话核心批注"
  },
  "observations": [保留阶段一的 region 字段，合并 evidence 和意义],
  "auraStatus": "描述当前气色（如：紫气东来、华盖云集）",
  "auraMessage": "给用户的一句生活箴言",
  "advancedLog": {
    "boneStructure": "深度骨相解析",
    "spiritAnalysis": "精气神监控报告",
    "potentialRisks": "性格中的潜在风险提示"
  }
}`;

    const stage2Response = await fetch(ARK_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${API_KEY}` 
      },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: [
          { role: "system", content: "你是一位精通相学的宗师，只输出 JSON。" },
          { role: "user", content: stage2Prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8 // 增加灵感与修辞多样性
      })
    });

    if (!stage2Response.ok) throw new Error('火山方舟推演异常');
    const finalResult = await stage2Response.json();
    const finalContent = JSON.parse(finalResult.choices[0].message.content);

    return NextResponse.json(finalContent);

  } catch (error: any) {
    console.error("火山方舟调用失败:", error);
    return NextResponse.json({ error: '灵鉴受阻：' + (error.message || '系统解析异常') }, { status: 500 });
  }
}
