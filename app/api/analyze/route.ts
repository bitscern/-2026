
import { NextResponse } from 'next/server';

const POSITIVE_TERMS = ["天庭饱满", "地阁方圆", "山根隆起", "双目有神", "印堂发亮", "三停均称", "五岳朝拱", "准头圆润", "辅角宽厚", "神采奕奕", "华盖云集", "气若长虹"];
const FORBIDDEN_TERMS = ["可能", "大概", "或许", "Maybe", "Potential", "如果你愿意", "视情况而定"];

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: '法相缺失，无法参详' }, { status: 400 });

    const ARK_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
    const API_KEY = process.env.ARK_API_KEY;
    const ENDPOINT_ID = process.env.ARK_ENDPOINT_ID;

    if (!API_KEY || !ENDPOINT_ID) {
      return NextResponse.json({ error: '灵鉴配置未就绪' }, { status: 500 });
    }

    // --- 第一阶段：视觉解构 ---
    const stage1Prompt = `你是一位极致精准的视觉观察员。观察照片，提取 8-10 个核心视觉特征，包括面部纹路、眼神动态、手势摆放、饰品环境。
重点：详细描述特征的几何形状、颜色深度。归类到：FOREHEAD, EYES, NOSE, MOUTH, CHIN, CHEEK_L, CHEEK_R, FULL。只输出 JSON。`;

    const stage1Response = await fetch(ARK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: [{
          role: "user",
          content: [
            { type: "text", text: stage1Prompt },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } }
          ]
        }],
        response_format: { type: "json_object" }
      })
    });

    if (!stage1Response.ok) throw new Error('视觉解析受阻');
    const stage1Data = await stage1Response.json();
    const observationFacts = JSON.parse(stage1Data.choices[0].message.content);

    // --- 第二阶段：宗师深度推演 ---
    const stage2Prompt = `基于视觉事实：${JSON.stringify(observationFacts)}。
你现在是相学与演化心理学宗师。请输出一份信息量极大且具备中式美学的灵鉴报告。

【关键禁令】：
1. 绝对禁止在 masterInsight.poem（判词）和 summary 中使用任何英文、拉丁字母（如 V, OK 等）、阿拉伯数字或现代符号。
2. 若观察到现代手势（如剪刀手V字），请将其转化为中式相学意向（如：指尖呈双峰、手起灵动之势、瑞指含春等）。
3. 严禁废话，使用术语：${POSITIVE_TERMS.join('、')}。

输出 JSON 结构：
{
  "score": 评分(60-99),
  "fiveElement": "金/木/水/火/土",
  "elementAnalysis": "五行性格深度推演，结合骨相与气色",
  "masterInsight": { "poem": "七言判词，严禁出现字母数字", "summary": "核心批语，简练有力" },
  "observations": [包含 region 的特征列表],
  "palaces": [
    {"name": "命宫", "status": "优/平/变", "analysis": "详细解析"},
    {"name": "官禄宫", "status": "...", "analysis": "..."},
    {"name": "迁移宫", "status": "...", "analysis": "..."},
    {"name": "财帛宫", "status": "...", "analysis": "..."},
    {"name": "福德宫", "status": "...", "analysis": "..."},
    {"name": "兄弟宫", "status": "...", "analysis": "..."}
  ],
  "personalityProfile": "心性根基深度描述（至少150字，涵盖潜在性格与外显气质）",
  "socialGuide": "人际交往的具体避坑指南与进阶建议",
  "hobbies": ["推荐的修心方式1", "2", "3"],
  "auraStatus": "当前气韵（如：青龙得位、朱雀衔财等）",
  "auraMessage": "今日灵鉴箴言",
  "workplace": {
    "role": "最契合的职业角色定位",
    "strengths": ["核心优势1", "优势2", "优势3"],
    "advice": "职场进阶的具体行动建议"
  },
  "advancedLog": { 
    "boneStructure": "骨相解构细节", 
    "spiritAnalysis": "精气神活跃度分析", 
    "potentialRisks": "性格弱点警示" 
  }
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
