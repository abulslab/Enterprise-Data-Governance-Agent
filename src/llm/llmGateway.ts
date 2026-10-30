import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { OODAStep, GovernanceDecisionOutcome } from '../types.js';

export type LLMProviderMode = 'mock' | 'ollama' | 'gemini';

export interface LLMGatewayOptions {
  mode?: LLMProviderMode;
  ollamaUrl?: string;
  ollamaModel?: string;
  geminiKey?: string;
  geminiModel?: string;
}

/**
 * Tri-Mode Cognitive Reasoning Gateway
 * Supports Offline Mock (0 cost, 1ms), Local Ollama (air-gapped), and Google Gemini (cloud).
 */
export class LLMGateway {
  private mode: LLMProviderMode;
  private ollamaUrl: string;
  private ollamaModel: string;
  private geminiKey?: string;
  private geminiModel: string;

  constructor(options?: LLMGatewayOptions) {
    this.mode = options?.mode || (process.env.LLM_PROVIDER as LLMProviderMode) || 'mock';
    this.ollamaUrl = options?.ollamaUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.ollamaModel = options?.ollamaModel || process.env.OLLAMA_MODEL || 'llama3:latest';
    this.geminiKey = options?.geminiKey || process.env.GEMINI_API_KEY;
    this.geminiModel = options?.geminiModel || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  public async generateTrajectory(
    datasetUrn: string,
    decisionOutcome: GovernanceDecisionOutcome,
    piiViolationsCount: number,
    breakingDiffsCount: number
  ): Promise<{ trajectory: OODAStep[]; tokensConsumed: number }> {
    // 1. Google Gemini Gateway
    if (this.mode === 'gemini' && this.geminiKey) {
      try {
        return await this.callGemini(datasetUrn, decisionOutcome, piiViolationsCount, breakingDiffsCount);
      } catch (err) {
        console.warn(`[LLM Gateway] Gemini call failed: ${(err as Error).message}. Falling back to authentic Cassette Mock.`);
      }
    }

    // 2. Local Ollama Gateway
    if (this.mode === 'ollama') {
      try {
        return await this.callOllama(datasetUrn, decisionOutcome, piiViolationsCount, breakingDiffsCount);
      } catch (err) {
        console.warn(`[LLM Gateway] Ollama daemon unreachable at ${this.ollamaUrl}: ${(err as Error).message}. Falling back to Cassette Mock.`);
      }
    }

    // 3. Offline Cassette Mock (Default, 0 tokens, sub-millisecond)
    return {
      trajectory: this.loadCassette(decisionOutcome),
      tokensConsumed: 0
    };
  }

  private loadCassette(outcome: GovernanceDecisionOutcome): OODAStep[] {
    try {
      const currentFile = fileURLToPath(import.meta.url);
      const cassettePath = join(dirname(currentFile), 'cassettes', 'governance-cassettes.json');
      const raw = JSON.parse(readFileSync(cassettePath, 'utf-8'));

      if (outcome === 'QUARANTINE') return raw.quarantineCassette;
      if (outcome === 'BLOCK_DEPLOYMENT') return raw.blockCassette;
      return raw.approveCassette;
    } catch {
      // Fallback in-memory cassette
      return [
        {
          step: 1,
          phase: 'OBSERVE',
          observation: 'Ingested candidate dataset schema. Scanned partition samples.',
          reasoning: 'Applied Tier 4 deterministic 0-token invariant rules.',
          decision: 'Proceed to policy evaluation.',
          engineProvider: 'Offline Mock',
          latencyMs: 1,
          tokensConsumed: 0
        },
        {
          step: 2,
          phase: 'REASON',
          observation: `Audit completed with decision: ${outcome}.`,
          reasoning: 'Evaluated regulatory boundaries and contracts.',
          decision: 'Synthesize compliance dossier.',
          engineProvider: 'Offline Mock',
          latencyMs: 1,
          tokensConsumed: 0
        },
        {
          step: 3,
          phase: 'DECIDE',
          observation: `Enforcing ${outcome}.`,
          reasoning: 'Governance policy invariants enforced.',
          decision: `Finalize ${outcome}.`,
          engineProvider: 'Offline Mock',
          latencyMs: 1,
          tokensConsumed: 0
        },
        {
          step: 4,
          phase: 'EXECUTE',
          observation: 'Dossier generated with cryptographic trace.',
          reasoning: 'Action executed.',
          decision: 'Emit CI/CD status code.',
          engineProvider: 'Offline Mock',
          latencyMs: 1,
          tokensConsumed: 0
        }
      ];
    }
  }

  private async callGemini(
    datasetUrn: string,
    outcome: GovernanceDecisionOutcome,
    piiCount: number,
    breakingCount: number
  ): Promise<{ trajectory: OODAStep[]; tokensConsumed: number }> {
    const start = performance.now();
    const prompt = `You are the Enterprise Data Governance Agent.
Analyze dataset '${datasetUrn}'.
Findings from Tier 4 deterministic scanner:
- Unmasked Direct PII: ${piiCount}
- Breaking Contract Mutations: ${breakingCount}
Calculated Governance Outcome: ${outcome}

Return ONLY valid JSON array with 4 OODA loop steps:
[
  { "step": 1, "phase": "OBSERVE", "observation": "...", "reasoning": "...", "decision": "..." },
  { "step": 2, "phase": "REASON", "observation": "...", "reasoning": "...", "decision": "..." },
  { "step": 3, "phase": "DECIDE", "observation": "...", "reasoning": "...", "decision": "..." },
  { "step": 4, "phase": "EXECUTE", "observation": "...", "reasoning": "...", "decision": "..." }
]`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${this.geminiKey}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      })
    });

    if (!res.ok) throw new Error(`Gemini HTTP Error ${res.status}`);
    const data: any = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const tokens = data.usageMetadata?.totalTokenCount || 220;
    const latencyMs = Math.round(performance.now() - start);

    const steps = JSON.parse(rawText);
    const parsed: any[] = Array.isArray(steps) ? steps : (steps.steps || []);

    return {
      trajectory: parsed.map(s => ({
        ...s,
        engineProvider: 'Google Gemini' as const,
        latencyMs,
        tokensConsumed: Math.round(tokens / 4)
      })),
      tokensConsumed: tokens
    };
  }

  private async callOllama(
    datasetUrn: string,
    outcome: GovernanceDecisionOutcome,
    piiCount: number,
    breakingCount: number
  ): Promise<{ trajectory: OODAStep[]; tokensConsumed: number }> {
    const start = performance.now();
    const prompt = `You are the Enterprise Data Governance Agent.
Analyze dataset '${datasetUrn}'.
Findings: ${piiCount} unmasked PII, ${breakingCount} breaking mutations.
Outcome: ${outcome}.
Return JSON array with 4 OODA loop steps:
[
  { "step": 1, "phase": "OBSERVE", "observation": "...", "reasoning": "...", "decision": "..." },
  { "step": 2, "phase": "REASON", "observation": "...", "reasoning": "...", "decision": "..." },
  { "step": 3, "phase": "DECIDE", "observation": "...", "reasoning": "...", "decision": "..." },
  { "step": 4, "phase": "EXECUTE", "observation": "...", "reasoning": "...", "decision": "..." }
]`;

    const res = await fetch(`${this.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.ollamaModel,
        prompt,
        stream: false,
        format: 'json'
      })
    });

    if (!res.ok) throw new Error(`Ollama HTTP Error ${res.status}`);
    const data: any = await res.json();
    const latencyMs = Math.round(performance.now() - start);
    const steps = JSON.parse(data.response);
    const parsed: any[] = Array.isArray(steps) ? steps : (steps.steps || []);
    const tokens = (data.prompt_eval_count || 0) + (data.eval_count || 0);

    return {
      trajectory: parsed.map(s => ({
        ...s,
        engineProvider: 'Ollama' as const,
        latencyMs,
        tokensConsumed: Math.round(tokens / 4)
      })),
      tokensConsumed: tokens
    };
  }
}
