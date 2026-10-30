/**
 * Enterprise Data Governance Agent — Type Definitions
 * 
 * Strict Domain Models for 4-Tier Cognitive Architecture,
 * Data Contracts, PII Scanners, Regulatory Mappings, and Compliance Dossiers.
 */

export type ClassificationTier = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';

export type SensitivityCategory = 
  | 'DIRECT_PII' 
  | 'INDIRECT_PII' 
  | 'FINANCIAL' 
  | 'REGULATED_HEALTH' 
  | 'OPERATIONAL';

export type SensitivePatternType = 
  | 'SSN' 
  | 'CREDIT_CARD_PAN' 
  | 'BANK_ROUTING_ABA' 
  | 'BANK_ACCOUNT_NUMBER' 
  | 'EMAIL_ADDRESS' 
  | 'PHONE_NUMBER' 
  | 'IBAN'
  | 'PASSPORT'
  | 'DRIVER_LICENSE'
  | 'HEALTHCARE_IDENTIFIER'
  | 'NATIONAL_ID' 
  | 'IP_ADDRESS';

export interface SensitiveDataFinding {
  fieldName: string;
  patternType: SensitivePatternType;
  category: SensitivityCategory;
  sampleValueMasked: string;
  sampleValueRawPreview: string; // Sanitized preview with middle masked
  recordIndex: number;
  confidence: number;
  statutoryRegulation: ('GDPR' | 'HIPAA' | 'GLBA' | 'PCI-DSS')[];
}

export interface SchemaColumn {
  name: string;
  type: 'string' | 'integer' | 'decimal' | 'boolean' | 'timestamp' | 'date' | 'uuid' | 'json' | 'array';
  nullable: boolean;
  classificationOverride?: ClassificationTier;
  description?: string;
}

export interface DownstreamConsumer {
  id: string;
  serviceName: string;
  consumerType: 'STREAMING_PIPELINE' | 'ML_MODEL' | 'BI_DASHBOARD' | 'FINANCIAL_REPORTING' | 'CUSTOMER_API';
  ownerTeam: string;
  dependentFields: string[];
  slaTier: 'TIER_1_CRITICAL' | 'TIER_2_OPERATIONAL' | 'TIER_3_REPORTING';
}

export interface DatasetSchema {
  datasetUrn: string;
  datasetName: string;
  classificationTier: ClassificationTier;
  schemaVersion: string;
  storageTarget: 'LAKEHOUSE' | 'DATA_WAREHOUSE' | 'KAFKA_TOPIC' | 'OBJECT_STORE';
  columns: SchemaColumn[];
  sampleRecords?: Record<string, any>[];
  downstreamConsumers?: DownstreamConsumer[];
  metadata?: {
    owner: string;
    environment: 'production' | 'staging' | 'development';
    dataRetentionDays?: number;
    vaultEnforced?: boolean;
  };
}

export interface BaselineDataContract {
  datasetUrn: string;
  contractVersion: string;
  minimumClassificationTier: ClassificationTier;
  allowedMutations: ('ADD_NULLABLE_COLUMN' | 'WIDEN_NUMERIC_TYPE')[];
  prohibitedMutations: ('DROP_COLUMN' | 'RENAME_COLUMN' | 'NARROW_TYPE' | 'DISALLOW_NULLS')[];
  columns: SchemaColumn[];
  registeredConsumers: DownstreamConsumer[];
}

export type SchemaMutationType = 
  | 'FIELD_REMOVED' 
  | 'FIELD_TYPE_CHANGED' 
  | 'NULLABILITY_VIOLATED' 
  | 'FIELD_ADDED_REQUIRED' 
  | 'FIELD_ADDED_OPTIONAL' 
  | 'UNKNOWN_MUTATION';

export interface SchemaDiffFinding {
  fieldName: string;
  mutationType: SchemaMutationType;
  isBreaking: boolean;
  oldDefinition?: SchemaColumn;
  newDefinition?: SchemaColumn;
  impactDescription: string;
  affectedConsumers: string[];
}

export interface ConsumerImpactAnalysis {
  blastRadiusRisk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  totalDownstreamAffected: number;
  affectedConsumerServices: {
    serviceName: string;
    consumerType: string;
    slaTier: string;
    brokenFields: string[];
  }[];
  summary: string;
}

export interface RegulatoryCitation {
  framework: 'GDPR' | 'HIPAA' | 'GLBA' | 'PCI-DSS';
  articleOrSection: string;
  title: string;
  violationContext: string;
  statutoryPenaltyRisk: string;
  mandatoryRemediation: string;
}

export type GovernanceDecisionOutcome = 
  | 'APPROVE' 
  | 'APPROVE_WITH_WARNING' 
  | 'QUARANTINE' 
  | 'BLOCK_DEPLOYMENT';

export interface GovernanceDecision {
  outcome: GovernanceDecisionOutcome;
  timestamp: string;
  rationale: string;
  requiresHumanSupervisoryApproval: boolean;
  humanApprovalStatus: 'NOT_REQUIRED' | 'PENDING_REVIEW' | 'GRANTED' | 'REJECTED';
  suggestedIssueTicketKey?: string;
  suggestedRemediationAction: string;
}

export interface OODAStep {
  step: number;
  phase: 'OBSERVE' | 'REASON' | 'DECIDE' | 'EXECUTE';
  observation: string;
  reasoning: string;
  decision: string;
  engineProvider: 'Deterministic Tier 4' | 'Offline Mock' | 'Ollama' | 'Google Gemini';
  latencyMs: number;
  tokensConsumed: number;
}

export interface ComplianceDossier {
  traceId: string;
  auditTimestamp: string;
  datasetUrn: string;
  declaredClassification: ClassificationTier;
  recommendedClassification: ClassificationTier;
  decision: GovernanceDecision;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  executiveSummary: string;
  sensitiveDataFindings: SensitiveDataFinding[];
  schemaDiffFindings: SchemaDiffFinding[];
  regulatoryCitations: RegulatoryCitation[];
  consumerImpact: ConsumerImpactAnalysis;
  recommendedActions: string[];
  auditLog: {
    scannedRecordsCount: number;
    deterministicScanDurationMs: number;
    tokensConsumedTotal: number;
    deterministicEngineZeroTokensOffloaded: boolean;
  };
  reasoningTrajectory: OODAStep[];
}

export interface GovernanceAuditResult {
  success: boolean;
  exitCode: 0 | 1; // 0 for PASS / APPROVE / WARNING, 1 for QUARANTINE / BLOCK_DEPLOYMENT
  decision: GovernanceDecisionOutcome;
  dossier: ComplianceDossier;
}

export interface DatasetIncidentHistory {
  datasetUrn: string;
  totalAudits: number;
  violationCount: number;
  lastViolationTimestamp?: string;
  incidentHistory: {
    timestamp: string;
    outcome: GovernanceDecisionOutcome;
    reasons: string[];
  }[];
  isRepeatOffender: boolean;
  escalationLevel: 'STANDARD' | 'WARNING' | 'ESCALATED' | 'CRITICAL_BLOCK';
}

export interface RemediationPackage {
  datasetUrn: string;
  suggestedSql: string;
  suggestedPySpark: string;
  suggestedDbt: string;
  suggestedDeltaLiveTables: string;
  remediationSummary: string;
}

export interface CompiledPolicyRule {
  id: string;
  naturalLanguagePrompt: string;
  targetDomain: string;
  targetColumnsRegex: string;
  invariantTarget: 'G-1' | 'G-2' | 'G-3' | 'G-4' | 'G-5';
  constraintAction: 'ENFORCE_CRYPTO_HASH' | 'ENFORCE_MASKING' | 'DISALLOW_CLEAR_TEXT' | 'ENFORCE_SUPERVISORY_QUARANTINE';
  ruleHash: string;
  compiledAt: string;
}

export interface HitlEscalationPackage {
  ticketId: string;
  datasetUrn: string;
  severity: 'SEV-1-CRITICAL' | 'SEV-2-HIGH' | 'SEV-3-MEDIUM';
  approvalRequiredBy: string[];
  summary: string;
  jiraPayload: Record<string, any>;
  serviceNowPayload: Record<string, any>;
  slackCardPayload: Record<string, any>;
  teamsCardPayload: Record<string, any>;
}
