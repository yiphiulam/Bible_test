import {
  ParsedEngineResponse,
  ReasoningBreadcrumb,
  Claim,
  KnowledgeBoundary,
  SourceType,
  ConfidenceLevel,
  KnowledgeBoundaryStatus,
  SourceChunk
} from '../types/theology';

export function parseEngineResponse(xmlText: string): ParsedEngineResponse {
  // Strip Markdown code block wrapper if present
  let cleanXml = xmlText.trim();
  if (cleanXml.startsWith('```xml')) {
    cleanXml = cleanXml.replace(/^```xml\s*/i, '').replace(/```\s*$/, '').trim();
  } else if (cleanXml.startsWith('```')) {
    cleanXml = cleanXml.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
  }

  // 1. Extract reasoning_breadcrumbs
  const breadcrumbs: ReasoningBreadcrumb[] = [];
  const breadcrumbsMatch = cleanXml.match(/<reasoning_breadcrumbs>([\s\S]*?)<\/reasoning_breadcrumbs>/i);
  if (breadcrumbsMatch) {
    const stepsContent = breadcrumbsMatch[1];
    const stepRegex = /<step\s+([^>]*?)\/?>(?:<\/step>)?/gi;
    let stepMatch;
    while ((stepMatch = stepRegex.exec(stepsContent)) !== null) {
      const attrsStr = stepMatch[1];
      const orderMatch = attrsStr.match(/order=["']?(\d+)["']?/i);
      const sourceIdMatch = attrsStr.match(/source_id=["']?([^"'\s]+)["']?/i);
      const labelMatch = attrsStr.match(/label=["']?([^"']+)["']?/i);

      if (orderMatch && labelMatch) {
        breadcrumbs.push({
          order: parseInt(orderMatch[1], 10),
          source_id: sourceIdMatch ? sourceIdMatch[1] : '',
          label: labelMatch[1].trim()
        });
      }
    }
  }

  // 2. Extract content & claims
  const contentMatch = cleanXml.match(/<content>([\s\S]*?)<\/content>/i);
  const rawContentXml = contentMatch ? contentMatch[1].trim() : '';

  const claims: Claim[] = [];
  const claimRegex = /<claim\s+([^>]*?)>([\s\S]*?)<\/claim>/gi;
  let claimMatch;
  while ((claimMatch = claimRegex.exec(rawContentXml)) !== null) {
    const attrsStr = claimMatch[1];
    const claimText = claimMatch[2].trim();

    const idMatch = attrsStr.match(/id=["']?([^"'\s]+)["']?/i);
    const sourceIdMatch = attrsStr.match(/source_id=["']?([^"'\s]+)["']?/i);
    const typeMatch = attrsStr.match(/type=["']?([^"'\s]+)["']?/i);
    const confidenceMatch = attrsStr.match(/confidence=["']?([^"'\s]+)["']?/i);

    const validTypes: SourceType[] = ['verse', 'footnote', 'outline', 'lifestudy'];
    const validConfidences: ConfidenceLevel[] = ['high', 'synthesis'];

    const typeStr = (typeMatch ? typeMatch[1].toLowerCase() : 'footnote') as SourceType;
    const type: SourceType = validTypes.includes(typeStr) ? typeStr : 'footnote';

    const confStr = (confidenceMatch ? confidenceMatch[1].toLowerCase() : 'high') as ConfidenceLevel;
    const confidence: ConfidenceLevel = validConfidences.includes(confStr) ? confStr : 'high';

    claims.push({
      id: idMatch ? idMatch[1] : `c${claims.length + 1}`,
      source_id: sourceIdMatch ? sourceIdMatch[1] : 'UNKNOWN',
      type,
      confidence,
      text: claimText
    });
  }

  // 3. Extract knowledge boundary
  let status: KnowledgeBoundaryStatus = 'sufficient';
  let uncoveredAspects = '無';

  const boundaryMatch = cleanXml.match(/<knowledge_boundary>([\s\S]*?)<\/knowledge_boundary>/i);
  if (boundaryMatch) {
    const boundaryContent = boundaryMatch[1];
    const statusMatch = boundaryContent.match(/<status>\s*([a-zA-Z]+)\s*<\/status>/i);
    if (statusMatch) {
      const s = statusMatch[1].toLowerCase();
      if (s === 'sufficient' || s === 'partial' || s === 'insufficient') {
        status = s as KnowledgeBoundaryStatus;
      }
    }

    const uncoveredMatch = boundaryContent.match(/<uncovered_aspects>([\s\S]*?)<\/uncovered_aspects>/i);
    if (uncoveredMatch) {
      uncoveredAspects = uncoveredMatch[1].trim();
    }
  }

  return {
    rawXml: cleanXml,
    breadcrumbs: breadcrumbs.sort((a, b) => a.order - b.order),
    rawContentXml,
    claims,
    knowledgeBoundary: {
      status,
      uncovered_aspects: uncoveredAspects
    },
    generatedAt: new Date().toISOString()
  };
}

export interface GroundingAuditResult {
  totalClaims: number;
  highConfidenceCount: number;
  synthesisConfidenceCount: number;
  verifiedSourceIds: string[];
  unmatchedSourceIds: string[];
  boundaryCompliance: boolean;
}

export function auditGrounding(parsed: ParsedEngineResponse, sources: SourceChunk[]): GroundingAuditResult {
  const sourceIdSet = new Set(sources.map((s) => s.id));
  const verified: string[] = [];
  const unmatched: string[] = [];

  for (const claim of parsed.claims) {
    if (sourceIdSet.has(claim.source_id)) {
      if (!verified.includes(claim.source_id)) {
        verified.push(claim.source_id);
      }
    } else {
      if (!unmatched.includes(claim.source_id)) {
        unmatched.push(claim.source_id);
      }
    }
  }

  const highCount = parsed.claims.filter((c) => c.confidence === 'high').length;
  const synthesisCount = parsed.claims.filter((c) => c.confidence === 'synthesis').length;

  return {
    totalClaims: parsed.claims.length,
    highConfidenceCount: highCount,
    synthesisConfidenceCount: synthesisCount,
    verifiedSourceIds: verified,
    unmatchedSourceIds: unmatched,
    boundaryCompliance: unmatched.length === 0
  };
}
