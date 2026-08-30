
export interface RecommendationOption {
  type: "recommendation";
  id: string;
  title: string;
  summary: string;
  steps: string[];
  frequency: string | null;
  duration: string | null;
  materials: string[];
  caution: string | null;
  expected_result: string;
  recommendation_score: number;
}

export interface AIRecommendationResponse {
  type: "recommendation_options";
  options: RecommendationOption[];
}