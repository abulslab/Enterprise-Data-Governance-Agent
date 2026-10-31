# Enterprise Data Governance Agent 🛡️

> **Autonomous governance, compliance enforcement, contract protection, governance memory, and executive risk visibility.**

[![TypeScript 5.6](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Five-Tier Architecture](https://img.shields.io/badge/Architecture-5--Tier%20Governance-8A2BE2.svg)](docs/ARCHITECTURE.md)
[![Zero-Token Offload](https://img.shields.io/badge/Zero--Token%20Offload-100%25%20Deterministic-success.svg)](docs/ARCHITECTURE.md)
[![Regulatory Frameworks](https://img.shields.io/badge/Compliance-GDPR%20%7C%20HIPAA%20%7C%20GLBA%20%7C%20PCI--DSS-blue.svg)](docs/POLICIES.md)
[![CI/CD Ready](https://img.shields.io/badge/CI%2FCD-Exit%20Code%20Gate%20(0%2F1)-green.svg)](docs/REUSE_GUIDE.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🛑 Problem Statement

Modern data platforms require governance controls that are deterministic, auditable, and capable of enforcing regulatory requirements before non-compliant datasets reach production.

Traditional data governance relies on passive catalogs that document metadata after ingestion has already occurred, or generic LLM chatbots lacking deterministic guarantees. When cleartext credentials or breaking schema mutations breach production lakehouses, organizations face severe statutory fines (GDPR Art. 32, PCI-DSS v4.0), data pipeline halts, and downstream service failures.

The **Enterprise Data Governance Agent** provides an active, deterministic pre-production governance gate and continuous compliance system of record.

---

## 💎 What Makes This Different

- **Deterministic Enforcement Layer**: Sub-millisecond, zero-token mathematical scanners (compiled Regex, Luhn Mod 10, ABA mod-10, AST schema diff) run before LLMs are invoked.
- **Governance Memory**: Append-only audit history, repeat offender escalation (`STANDARD` ➔ `WARNING` ➔ `ESCALATED` ➔ `CRITICAL_BLOCK`), and cumulative compliance telemetry.
- **Evidence Vault**: Cryptographic, tamper-evident system of record chaining every evaluation, violation, and decision into an immutable audit trail.
- **Policy Compiler**: Translates natural language policies into deterministic Tier 1 AST rules with SHA-256 rule hashes in real time.
- **Executive Dashboard**: Boardroom-ready compliance telemetry, risk-weighted posture tracking, and financial liability avoided analytics.
- **Blast Radius Analysis**: Dependency graph lineage mapping evaluating downstream impacts across billing, fraud ML, analytics, and consumer APIs.
- **Human-In-The-Loop (HITL) Controls**: Automated enterprise incident dispatching for Jira, ServiceNow, Slack Block Kit, and Microsoft Teams.

---

## 🌟 Mission & Positioning

The **Enterprise Data Governance Agent** is a production-style governance reference platform inspired by modern enterprise data governance architectures. Its core objective is to **prevent non-compliant, unsafe, or contract-breaking data from entering production lakehouses, warehouses, streaming pipelines, and AI analytical platforms**.

### 🏛️ Platform Core Capabilities
- **Governance Automation**: Automated pre-merge and streaming boundary validation.
- **Compliance Enforcement**: Real-time statutory mapping for GDPR, HIPAA, GLBA, and PCI-DSS.
- **Policy Compilation**: Zero-shot compilation of natural language policies into AST invariants.
- **Governance Memory**: Append-only audit history, repeat offender escalation, and risk tracking.
- **Human-in-the-Loop (HITL)**: Automated incident generation for Jira, ServiceNow, Slack, and Teams.
- **Executive Risk Visibility**: Boardroom-level KPIs, compliance health telemetry, and financial risk avoided tracking.
- **Deterministic + Reasoning Architecture**: Sub-millisecond zero-token scanning combined with autonomous governance reasoning.

### ⛔ Strict Scope Boundary: Data Governance ONLY
This platform focuses **exclusively on Data Governance**. It explicitly excludes traditional Data Quality operations:
- ❌ **No freshness monitoring**
- ❌ **No null analysis or completeness checks**
- ❌ **No duplicate detection**
- ❌ **No metric drift or statistical variance**
- ❌ **No data quality scoring**
- ❌ **No numeric anomaly detection**

*(These capabilities belong to a separate, dedicated Data Quality Agent).*  
This platform specializes in **data privacy boundaries, sensitive data discovery, classification, data contracts, downstream consumer blast radius analysis, regulatory citations, and human-in-the-loop governance**.

---

## 🏗️ The Five-Tier Governance Architecture

```
Candidate Dataset Schema + Sample Partition
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│ Tier 4: Deterministic Enforcement Engine               │  ◄── 0 Tokens Consumed
│ (Compiled Regex, Luhn Mod 10, ABA Checksum, AST Diff)  │      Sub-millisecond execution (< 2ms)
└───────────────────────────┬────────────────────────────┘
                            │ Exact Findings & Offsets
                            ▼
┌────────────────────────────────────────────────────────┐
│ Tier 3: Governance Reasoning Engine                    │  ◄── OBSERVE ➔ REASON ➔ DECIDE ➔ EXECUTE
│ (Tri-Mode Gateway: Gemini, Ollama, Mock)               │      Consumer Blast Radius Assessment & Policy Arbitration
└───────────────────────────┬────────────────────────────┘
                            │
                            ├──► Offline Realistic Mock   (0 Cost, 1ms, 0 Tokens)
                            ├──► Local Ollama Daemon       (Private Air-Gapped, Llama 3)
                            └──► Google Gemini Cloud       (Frontier Governance Reasoning)
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Tier 1 & 2: System Invariants & Governance Policies    │  ◄── AGENTS.md Invariants G-1 to G-5
│ (Supervisory Gate & Statutory Regulatory Mappings)     │      GDPR, HIPAA, GLBA, PCI-DSS
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Tier 0: Evidence Vault                                 │  ◄── Append-only SHA-256 Merkle chain,
│ (Historical Timelines, Repeat Offenders, System Audit) │      Tamper-evident verification, Executive KPIs
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Verifiable Governance Deliverables                     │  ◄── • Cryptographic Compliance Dossier
│                                                        │      • Executive Boardroom Brief (PDF)
│                                                        │      • CI/CD Exit Code Gate (0 = PASS, 1 = BLOCK)
└────────────────────────────────────────────────────────┘
```

---

## 🖥️ Enterprise Workspaces & Visual Presentation

The platform features a zero-dependency, dual-theme (Light/Dark) Web Visual Studio structured into five dedicated enterprise workspaces:

1. **🛡️ Governance Studio** (`index.html`): Real-time schema candidate audition, 0-token AST inspection, interactive SVG Blast Radius Lineage DAG, Autonomous Governance Decision Workflow, and automated dbt remediation code generator.
2. **📊 Executive Dashboard** (`executive-dashboard.html`): Boardroom compliance telemetry, risk-weighted posture scoring, regulatory violation breakdowns (GDPR, HIPAA, GLBA, PCI-DSS), and financial liability avoided metrics.
3. **🗄️ Evidence Vault** (`evidence-vault.html`): Immutable system of record with cryptographic SHA-256 Merkle chain verification, timeline audit logs, and downloadable compliance certificates.
4. **🏛️ Architecture Workspace** (`architecture.html`): Interactive visual specification of the 5-tier architecture, deterministic zero-token offload boundaries, and cognitive runtime topologies.
5. **🎬 Demo Center** (`demo-scenarios.html`): 1-click execution scenarios demonstrating PII quarantine, breaking drift prevention, repeat offender escalation, and natural language policy compilation.

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

### 7. Governance Memory & Repeat Offender Tracking (Capability 7)
Autonomous stateful tracking of historical dataset audits across enterprise runs:
- Tracks cumulative audit history, violation tallies, and last-incident timestamps.
- **Repeat Offender Escalation Engine**: Datasets breaching Invariant G-1/G-2 multiple times are automatically escalated (`STANDARD` ➔ `WARNING` ➔ `ESCALATED` ➔ `CRITICAL_BLOCK`).
- Enforces Invariant G-4 by locking pipelines and requiring executive sign-off for habitual offenders.

### 8. Autonomous Auto-Fix Remediation Synthesizer
When violations are flagged, the agent does not merely report defects—it automatically synthesizes drop-in, production-ready remediation code:
- **SQL / Trino / BigQuery**: Format-preserving cryptographic SHA-256 HMAC pseudonymization views.
- **PySpark**: DataFrame transformations leveraging vault secret salts.
- **dbt Models & Macros**: `{{ crypto_hash_pii(...) }}` incremental models.
- **Delta Live Tables (DLT)**: `@dlt.expect_or_drop` expectation constraints.

### 9. Natural Language Policy-to-Invariant Compiler
Enables legal counsel, compliance officers, and data stewards to write plain English policies (e.g. *"Marketing datasets containing customer phone numbers must be masked before entering analytics"*):
- Compiles natural language zero-shot into deterministic Tier 1 AST rules.
- Generates immutable SHA-256 Rule Hashes and automated scanner expressions.

### 10. Human-in-the-Loop (HITL) Supervisory Gating
Critical violations activate supervisory gating (Invariant G-4), generating structured dispatch payloads for enterprise incident platforms:
- **Jira**: Issue creation payloads (`POST /rest/api/3/issue`) with priority mapping.
- **ServiceNow**: Information Security change request records.
- **Slack**: Interactive Block Kit cards with one-click supervisory override and quarantine confirmation buttons.
- **Microsoft Teams**: Adaptive Card notifications.

### 11. Cryptographic Compliance Certificate
Every audit emits a downloadable digital compliance certificate signed with SHA-256 digital signature, timestamp, dataset URN, and decision outcome for SOX/SOC-2/ISO-27001 audit verification.

### 12. Tri-Mode Governance Reasoning Runtime
| Gateway | Configuration | When to Use |
| :--- | :--- | :--- |
| **Offline Mock** *(Default)* | Pre-recorded realistic cassettes (`--llm mock`) | Local development, unit testing, air-gapped CI/CD runners (0 cost). |
| **Local Ollama** | Private daemon URL + model (`--llm ollama`) | Private, zero-data-egress enterprise networks. |
| **Google Gemini** | Google AI Studio API key (`--llm gemini`) | Frontier governance reasoning and dynamic remediation synthesis. |
| **OpenAI / Custom** | Custom Base URL + Bearer Token (`--llm custom`) | Groq, vLLM, DeepSeek, Together, or OpenAI enterprise endpoints. |

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
