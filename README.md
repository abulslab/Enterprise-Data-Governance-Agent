# Enterprise Data Governance Agent 🛡️

> **Autonomous AI Governance Agent for Lakehouse Schema Contract Verification, Regulatory Boundary Enforcement, and Consumer Blast Radius Intelligence.**

[![TypeScript 5.6](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Cognitive Architecture](https://img.shields.io/badge/Cognitive%20Architecture-4--Tier%20OODA-8A2BE2.svg)](docs/ARCHITECTURE.md)
[![Zero-Token Offload](https://img.shields.io/badge/Zero--Token%20Offload-100%25%20Deterministic-success.svg)](docs/ARCHITECTURE.md)
[![Regulatory Frameworks](https://img.shields.io/badge/Compliance-GDPR%20%7C%20HIPAA%20%7C%20GLBA%20%7C%20PCI--DSS-blue.svg)](docs/POLICIES.md)
[![CI/CD Ready](https://img.shields.io/badge/CI%2FCD-Exit%20Code%20Gate%20(0%2F1)-green.svg)](docs/REUSE_GUIDE.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Mission & Scope Boundary

The **Enterprise Data Governance Agent** is an autonomous AI Quality Engineering agent whose singular mandate is to **prevent non-compliant data from entering enterprise data lakehouses, warehouses, streaming topics (Kafka), and analytical ecosystems**.

### ⛔ Strict Scope Boundary: Data Governance ONLY
This agent focuses **exclusively on Data Governance**. It explicitly excludes traditional Data Quality operations:
- ❌ **No freshness monitoring**
- ❌ **No null analysis or completeness checks**
- ❌ **No duplicate detection**
- ❌ **No metric drift or statistical variance**
- ❌ **No data quality scoring**
- ❌ **No numeric anomaly detection**

*(These capabilities belong to a separate, dedicated Data Quality Agent).*  
This agent specializes in **data privacy boundaries, sensitive data discovery, classification, data contracts, downstream consumer blast radius analysis, regulatory citations, and human-in-the-loop governance**.

---

## 🏗️ 4-Tier Cognitive Architecture

```
Candidate Dataset Schema + Sample Partition
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│ Tier 4: Zero-Token Deterministic Scanner               │  ◄── 0 Tokens Consumed
│ (Compiled Regex, Luhn Mod 10, ABA Checksum, AST Diff)  │      Sub-millisecond execution
└───────────────────────────┬────────────────────────────┘
                            │ Exact Findings & Offsets
                            ▼
┌────────────────────────────────────────────────────────┐
│ Tier 3: Autonomous OODA Cognitive Reasoner             │  ◄── Observe ➔ Reason ➔ Decide ➔ Execute
│ (Observe ➔ Reason ➔ Decide ➔ Execute)                  │      Consumer Blast Radius Assessment
└───────────────────────────┬────────────────────────────┘
                            │
                            ├──► Offline Realistic Mock   (0 Cost, 1ms, 0 Tokens)
                            ├──► Local Ollama Daemon       (Private Air-Gapped, Llama 3)
                            └──► Google Gemini Cloud       (Frontier Cognitive Reasoning)
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Tier 1 & 2: Invariants & Governance Policies           │  ◄── AGENTS.md Invariants G-1, G-2, G-3
│ (Supervisory Gate & Statutory Mappings)                │      GDPR, HIPAA, GLBA, PCI-DSS
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Verifiable Governance Deliverables                     │  ◄── • Cryptographic Compliance Dossier
│                                                        │      • Issue Defect Candidate (SEC-GOV-902)
│                                                        │      • CI/CD Exit Code (0 = PASS, 1 = BLOCK)
└────────────────────────────────────────────────────────┘
```

---

## ⚡ 30-Second Quickstart

The agent is **100% self-contained** and runs out-of-the-box with authentic pre-recorded cassettes—requiring **zero API keys, zero cloud setup, and zero local daemons**.

### 1. Installation
```bash
git clone https://github.com/abulslab/Enterprise-Data-Governance-Agent.git
cd Enterprise-Data-Governance-Agent
npm install
```

### 2. Run Autonomous Audit via CLI
```bash
# Test candidate dataset with critical PII breach (SSN in Confidential tier)
npm run start:mock

# Test clean compliant dataset with non-breaking evolution
npm run start:clean
```

### 3. Launch the Visual Studio Dashboard (UI)
```bash
npm run ui
```
Open **[http://localhost:5175](http://localhost:5175)** to interact with the Visual Studio dashboard.

---

## 🎯 Core Agent Capabilities

### 1. Sensitive Data Discovery (Tier 4)
- **Direct PII**: Identifies Social Security Numbers (SSN), government identity markers, email addresses, and phone numbers.
- **Financial Credentials**: Detects Primary Account Numbers (Credit Card PANs) with mathematical **Luhn Mod 10** verification and **ABA Federal Reserve Routing** transit numbers with mathematical mod-10 weighted checksums.
- **Zero-Token Masking Awareness**: Recognizes valid format-preserving encryption and tokenization (`***-**-6789`, `TOK_xxxx`, `VAULT_xxxx`), eliminating false alarms.

### 2. Data Classification Engine
Categorizes every dataset into four standard enterprise classifications:
- **`PUBLIC`**: Information intended for unrestricted public distribution.
- **`INTERNAL`**: Proprietary operational records for internal employee use.
- **`CONFIDENTIAL`**: Business sensitive data (pseudonymized or masked customer records) with RBAC.
- **`RESTRICTED`**: Raw direct PII and financial credentials requiring dedicated cryptographic vaults.
- *Flags classification drift and under-protected datasets automatically.*

### 3. Data Contract Governance
- **AST Schema Differ**: Pinpoints breaking vs. non-breaking changes with 0 tokens.
- **Breaking Mutations**: Detects dropped columns, incompatible type narrowing (`string` to `integer`), and nullability violations.
- **Non-Breaking Evolution**: Recognizes optional column additions and type widenings.

### 4. Consumer Impact & Blast Radius Analysis
Cross-references schema mutations against registered downstream consumer systems:
- Evaluates impacted **Streaming Pipelines**, **ML Models**, **Financial Reporting**, and **Customer APIs**.
- Assigns definitive **Blast Radius Risk Levels**: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `NONE`.

### 5. Statutory Regulatory Mapping (Tier 2)
Directly maps discovered vulnerabilities to statutory legal frameworks with financial risk citations and concrete remediation actions:
- **GDPR**: Article 32 (Security of Processing) & Article 5(1)(f) (Integrity and Confidentiality).
- **HIPAA**: 45 CFR § 164.514(b)(2) (Safe Harbor 18 Protected Health Identifiers).
- **GLBA**: 15 U.S.C. § 6801(b) / 16 CFR Part 314 (Safeguards Rule for Financial Information).
- **PCI-DSS**: Requirement 3.4 (Render Primary Account Numbers unreadable anywhere stored).

### 6. Governance Decision Engine
Produces four unambiguous, auditable decision outcomes:
- **`APPROVE`**: 100% contract compliant, 0 unmasked PII. Ingestion certified.
- **`APPROVE_WITH_WARNING`**: Backward-compatible optional evolutions. Ingestion approved with catalog telemetry.
- **`QUARANTINE`**: Unmasked direct PII found in non-restricted tiers (Invariant G-1 breach). Partition isolated.
- **`BLOCK_DEPLOYMENT`**: Breaking schema contract change impacting downstream consumers (Invariant G-2 breach). Deployment blocked.

### 7. Human-in-the-Loop (HITL) Supervisory Gate
Critical violations automatically lock the deployment pipeline, filing an issue defect candidate (e.g. `SEC-GOV-902`) and requiring explicit supervisory sign-off from Data Stewards.

### 8. Cryptographic Compliance Dossier
Every audit emits a formal compliance dossier containing:
- Unique cryptographic Trace ID (`GOV-AUDIT-uuid`)
- Executive Summary & Audit Timestamp
- Zero-Token Deterministic Metrics
- Sensitive Data Findings with masked previews
- Downstream Consumer Blast Radius breakdown
- Statutory Regulatory Citations
- Prescriptive Recommended Actions
- 4-Step OODA Cognitive Trajectory

### 9. CI/CD Governance Gate
Engineered for pipeline integration. The CLI returns strict POSIX exit codes:
- **`Exit Code 0`**: PASS (Approved or Approved with Warning).
- **`Exit Code 1`**: BLOCK (Quarantine or Deployment Blocked).

### 10. Tri-Mode Reasoning Gateway
| Gateway | Configuration | When to Use |
| :--- | :--- | :--- |
| **Offline Mock** *(Default)* | Pre-recorded realistic cassettes (`--llm mock`) | Local development, unit testing, air-gapped CI/CD runners (0 cost). |
| **Local Ollama** | Private daemon URL + model (`--llm ollama`) | Private, zero-data-egress enterprise networks. |
| **Google Gemini** | Google AI Studio API key (`--llm gemini`) | Frontier cognitive reasoning and dynamic remediation synthesis. |

---

## 💻 CLI Usage

```text
Usage:
  governance-agent [options]
  npx tsx src/cli.ts [options]

Options:
  --candidate <path.json>  Path to candidate dataset schema JSON (Required)
  --baseline <path.json>   Path to baseline data contract JSON (Optional)
  --llm <mock|ollama|gemini> Set cognitive reasoning provider (default: mock)
  --gemini-key <key>       Google AI Studio API key (or GEMINI_API_KEY env)
  --gemini-model <model>   Gemini model (default: gemini-2.5-flash)
  --ollama-url <url>       Local Ollama URL (default: http://localhost:11434)
  --ollama-model <model>   Local Ollama model (default: llama3:latest)
  --json                   Output machine-readable JSON (ideal for CI/CD)
  --help, -h               Show this help message
```

---

## 📦 Programmatic TypeScript SDK

Import the agent directly into your Node.js, Express, Fastify, Dagster, or Airflow pipelines:

```typescript
import { EnterpriseDataGovernanceAgent, DatasetSchema } from 'enterprise-data-governance-agent';

const candidate: DatasetSchema = {
  datasetUrn: 'urn:datacatalog:production:warehouse:customer_orders_v2',
  datasetName: 'Customer Orders',
  classificationTier: 'CONFIDENTIAL',
  schemaVersion: '2.0.0',
  storageTarget: 'LAKEHOUSE',
  columns: [
    { name: 'order_id', type: 'uuid', nullable: false },
    { name: 'customer_ssn', type: 'string', nullable: false } // Violation
  ],
  sampleRecords: [
    { order_id: 'ord-101', customer_ssn: '123-45-6789' }
  ]
};

const agent = new EnterpriseDataGovernanceAgent({ mode: 'mock' });
const result = await agent.auditDataset(candidate);

if (!result.success) {
  console.error(`Governance Halt (${result.decision}):`, result.dossier.executiveSummary);
  process.exit(result.exitCode); // Exits 1
} else {
  console.log('Dataset certified for ingestion.');
}
```

---

## 🧪 Verification & Test Suite

The repository includes both granular unit tests and end-to-end integration tests:

```bash
# Run complete test suite (Unit + Integration)
npm test

# Run unit tests only (Checksums, Luhn, AST Differ, Classifier, Mapper, Blast Radius)
npm run test:unit

# Run end-to-end integration tests
npm run test:integration

# Typecheck and production build
npm run build
```

---

## 📄 License
MIT © [abulslab](https://github.com/abulslab)
