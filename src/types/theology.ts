export type SourceType = 'verse' | 'footnote' | 'outline' | 'lifestudy';
export type ConfidenceLevel = 'high' | 'synthesis';
export type KnowledgeBoundaryStatus = 'sufficient' | 'partial' | 'insufficient';

export interface Claim {
  id: string;
  source_id: string;
  type: SourceType;
  confidence: ConfidenceLevel;
  text: string;
}

export interface ReasoningBreadcrumb {
  order: number;
  source_id: string;
  label: string;
}

export interface KnowledgeBoundary {
  status: KnowledgeBoundaryStatus;
  uncovered_aspects: string;
}

export interface SourceChunk {
  id: string;
  title: string;
  parentContext: string;
  type: SourceType;
  reference: string;
  content: string;
  author?: string;
  book?: string;
  tags?: string[];
}

export interface ContextPackage {
  id: string;
  title: string;
  category: string;
  description: string;
  sources: SourceChunk[];
  sampleQuestions: string[];
  crossReferences?: string[];
}

export interface ParsedEngineResponse {
  rawXml: string;
  breadcrumbs: ReasoningBreadcrumb[];
  rawContentXml: string;
  claims: Claim[];
  knowledgeBoundary: KnowledgeBoundary;
  generatedAt: string;
}

export interface BatchQueryItem {
  id: string;
  query: string;
  status: 'idle' | 'running' | 'success' | 'error';
  error?: string;
  response?: ParsedEngineResponse;
}
