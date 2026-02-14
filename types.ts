
export enum FiveElement {
  WOOD = "木",
  FIRE = "火",
  EARTH = "土",
  METAL = "金",
  WATER = "水"
}

export interface Observation {
  feature: string;
  evidence: string; // 视觉证据：如“眼角微垂，有明显细密纹路”
  significance: string;
  confidence: number; // 置信度 0-1
}

export interface PalaceData {
  name: string;
  status: string;
  analysis: string;
}

export interface AnalysisResult {
  score: number;
  fiveElement: FiveElement;
  elementAnalysis: string;
  masterInsight: {
    poem: string;
    summary: string;
  };
  observations: Observation[];
  palaces: PalaceData[];
  personalityProfile: string;
  socialGuide: string;
  hobbies: string[];
  auraStatus: string;
  auraMessage: string;
  workplace: {
    role: string;
    strengths: string[];
    advice: string;
  };
  // 新增：深度隐藏层数据，增强用户感知深度
  advancedLog: {
    boneStructure: string; // 骨相深度解析
    spiritAnalysis: string; // 精气神分析
    potentialRisks: string; // 潜在需注意点
  };
}

export type AppView = 'home' | 'scanner' | 'report' | 'library' | 'about';
