
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

/**
 * 核心逻辑：相心灵鉴 (PhysioLogic Ark Core)
 * 采用最高规格推理模型，模拟《麻衣神相》宗师进行全维度批注。
 */

export const analyzeFace = async (base64Image: string): Promise<AnalysisResult> => {
  // 必须使用 process.env.API_KEY 初始化
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    你是一位隐居山林的相学宗师，精通《麻衣神相》、《神相全编》及《柳庄相法》。
    现有一缘主求鉴，请观其面相，断其心性。
    
    灵鉴要旨：
    1. 【骨相基准】：观其天庭、地阁、颧骨，定其金木水火土五行格局。
    2. 【十二宫位】：重点批注命宫、财帛宫、疾厄宫之神采。
    3. 【痣相吉凶】：精准搜寻面部痣点。若发现，须依古法断其福祸；若面净，则论其“神清气足”。
    4. 【心性推演】：将缘主的执行力、定力、机敏度等现代心理特质，转化为古朴典雅的判词。
    5. 【三世因果】：推演缘主性格之宿因、今日之显化、未来之愿景。
    
    禁忌：
    - 严禁提及“智能”、“AI”、“模型”、“算法”、“数据”等俗世词汇。
    - 文风须雅致、深邃，多用四字判词或半文言。
    - 回复须为纯净之 JSON 格式。
  `;

  try {
    const response = await ai.models.generateContent({
      // 使用最强推理模型以应对复杂的相学逻辑
      model: "gemini-3-pro-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "命格定分 (0-100)" },
            fiveElement: { type: Type.STRING, description: "五行格局" },
            elementAnalysis: { type: Type.STRING, description: "五行格局批注" },
            palaces: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  status: { type: Type.STRING },
                  analysis: { type: Type.STRING }
                },
                required: ["name", "status", "analysis"]
              }
            },
            moles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  position: { type: Type.STRING },
                  nature: { type: Type.STRING },
                  meaning: { type: Type.STRING }
                },
                required: ["position", "nature", "meaning"]
              }
            },
            riskMetrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "心性指标" },
                  value: { type: Type.STRING },
                  traditionalTerm: { type: Type.STRING, description: "古学术语" },
                  description: { type: Type.STRING }
                },
                required: ["label", "value", "traditionalTerm", "description"]
              }
            },
            karma: {
              type: Type.OBJECT,
              properties: {
                past: { type: Type.STRING },
                present: { type: Type.STRING },
                future: { type: Type.STRING }
              },
              required: ["past", "present", "future"]
            },
            workplace: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING, description: "事业定位" },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                advice: { type: Type.STRING, description: "进阶箴言" },
                compatibility: { type: Type.STRING }
              },
              required: ["role", "strengths", "advice", "compatibility"]
            },
            personalityProfile: { type: Type.STRING, description: "总纲批语" },
            auraStatus: { type: Type.STRING, description: "今日神采" },
            auraMessage: { type: Type.STRING, description: "今日灵感签" }
          },
          required: [
            "score", "fiveElement", "elementAnalysis", "palaces", "moles", "riskMetrics", 
            "karma", "workplace", "personalityProfile", "auraStatus", "auraMessage"
          ]
        },
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("宗师入定，未传真机");
    return JSON.parse(resultText) as AnalysisResult;

  } catch (error: any) {
    console.error("灵鉴异常:", error);
    throw new Error(`玄机难测：${error.message || '师门传讯中断'}`);
  }
};
