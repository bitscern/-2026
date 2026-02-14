
export enum FiveElement {
  WOOD = "木",
  FIRE = "火",
  EARTH = "土",
  METAL = "金",
  WATER = "水"
}

export type FaceRegion = 'FOREHEAD' | 'EYES' | 'NOSE' | 'MOUTH' | 'CHIN' | 'CHEEK_L' | 'CHEEK_R' | 'FULL';

export interface Observation {
  feature: string;
  evidence: string;
  significance: string;
  confidence: number;
  region: FaceRegion; // 新增：对应的面部区域，用于前端高亮
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
  advancedLog: {
    boneStructure: string;
    spiritAnalysis: string;
    potentialRisks: string;
  };
}

export type AppView = 'home' | 'scanner' | 'report' | 'library' | 'about';
