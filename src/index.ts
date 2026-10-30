/**
 * Enterprise Data Governance Agent — Public TypeScript SDK
 * 
 * Exported classes, types, and utilities for standalone pipeline embedding.
 */

export { EnterpriseDataGovernanceAgent, GovernanceAgent } from './agent.js';
export type { EnterpriseGovernanceAgentOptions } from './agent.js';

export { DeterministicScanner } from './tier4-deterministic/deterministicScanner.js';
export { SchemaDiffer } from './tier4-deterministic/schemaDiffer.js';
export { DataClassifier } from './classifier/dataClassifier.js';
export { RegulatoryMapper } from './tier2-policies/regulatoryMapper.js';
export { ImpactAnalyzer } from './tier3-ooda/impactAnalyzer.js';
export { DecisionEngine } from './decision/decisionEngine.js';
export { DossierGenerator } from './dossier/dossierGenerator.js';
export { LLMGateway } from './llm/llmGateway.js';

export { GovernanceMemory } from './memory/governanceMemory.js';
export { RemediationSynthesizer } from './autofix/remediationSynthesizer.js';
export { PolicyCompiler } from './compiler/policyCompiler.js';
export { EscalationManager } from './hitl/escalationManager.js';
export { createServer } from './server.js';

export type * from './types.js';
