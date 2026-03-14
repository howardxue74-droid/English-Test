export enum Difficulty {
  Beginner = "初级",
  Intermediate = "中级",
  Advanced = "高级",
}

export enum GrammarPoint {
  NonFiniteVerbs = "非谓语动词",
  AttributiveClause = "定语从句",
  AdverbialClause = "状语从句",
  NounClause = "名词性从句",
  Conjunctions = "连词",
  Prepositions = "介词",
  TenseAndVoice = "时态与语态",
}

export interface Option {
  id: string;
  text: string;
}

export interface Explanation {
  correctAnswer: string;
  rule: string;
  example: string;
  commonMistake: string;
}

export interface Question {
  id: string;
  sentenceParts: string[]; // e.g., ["", " tired, she still finished the report."]
  options: Option[];
  correctOptionId: string;
  difficulty: Difficulty;
  category: GrammarPoint;
  explanation: Explanation;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean | null;
}
