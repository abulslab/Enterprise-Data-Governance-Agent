# 4-Tier Cognitive Architecture Specification

The **Enterprise Data Governance Agent** is structured around a strict **4-tier cognitive taxonomy**, balancing deterministic mathematical precision with adaptive LLM policy reasoning.

```mermaid
flowchart TD
    subgraph Ingestion ["1. Data Contracts & Candidate Schemas"]
        Schema["Candidate Dataset Schema (JSON)"]
        Baseline["Registered Baseline Contract (JSON)"]
        Sample["Sample Data Partition Records"]
    end

    subgraph Tier4 ["Tier 4: Zero-Token Deterministic Scanner"]
        Regex["Compiled Regex PII Engine (SSN, PAN, Email, Phone)"]
        Luhn["Luhn Mod 10 PAN Validator"]
        Aba["ABA Routing Checksum Validator"]
        AST["AST Schema Contract Differ (Drop, Narrow, Nulls)"]
    end

    subgraph Tier3 ["Tier 3: Autonomous OODA Reasoner"]
        Observe["Observe: Ingest surface & deterministic metrics"]
        Reason["Reason: Synthesize statutory boundaries & blast radius"]
        Decide["Decide: Governance outcome & supervisory gating"]
        Execute["Execute: Quarantine, CI gate & dossier compilation"]
    end

    subgraph Tier2 ["Tier 2: Governance Policy Registry"]
        GDPR["GDPR Art. 32 & 5(1)(f)"]
        HIPAA["HIPAA 45 CFR § 164.514 Safe Harbor"]
        GLBA["GLBA 15 U.S.C. § 6801 Safeguards"]
        PCI["PCI-DSS v4.0 Req 3.4"]
    end

    subgraph Gateway ["Cognitive Reasoning Gateway"]
        direction LR
        Mock["Offline Cassette (0 Tokens, 1ms)"]
        Ollama["Local Ollama (Private Air-Gapped)"]
        Gemini["Google Gemini 2.5 (Frontier Cloud)"]
    end

    subgraph Deliverables ["Verifiable Governance Deliverables"]
        Dossier["Cryptographic Compliance Dossier"]
        Ticket["Issue Defect Candidate (SEC-GOV-902)"]
        CIGate["CI/CD Exit Code (0 = PASS, 1 = BLOCK)"]
    end

    Schema --> AST
    Baseline --> AST
    Sample --> Regex
    Regex --> Luhn
    Regex --> Aba

    Luhn -->|Zero-Token Findings| Observe
    Aba -->|Zero-Token Findings| Observe
    AST -->|Diff Mutations| Observe

    Observe --> Gateway
    Gateway --> Reason
    Reason <--> Tier2
    Reason --> Decide
    Decide --> Execute

    Execute --> Dossier
    Execute --> Ticket
    Execute --> CIGate
```

---

## Cognitive Tier Breakdown

### Tier 1: System Invariants (`AGENTS.md`)
- **Immutable Governance Boundary**:
  - Direct unmasked PII (SSN, unencrypted credit cards, bank credentials) is strictly prohibited outside dedicated Tier 3 Restricted security vaults.
  - Data contracts cannot be violated without formal deprecation lifecycles.
  - Governance decisions must be auditable with cryptographic trace IDs.
  - Probabilistic LLM tokens must never be used for deterministic mathematical operations.

### Tier 2: Governance Policies (`src/tier2-policies/regulatoryMapper.ts`)
- Maps detected vulnerabilities directly to legal standards:
  - **GDPR**: Article 32 (pseudonymization & encryption), Article 17 (erasure lineage).
  - **HIPAA**: 45 CFR § 164.514 (Safe Harbor 18 Protected Health Identifiers).
  - **GLBA**: 15 U.S.C. § 6801 (Nonpublic Personal Financial Information safeguards).
  - **PCI-DSS**: Requirement 3.4 (PAN protection).

### Tier 3: Autonomous OODA Agent (`src/agent.ts`)
- **Observe**: Collects schema metadata, sample records, and Tier 4 deterministic outputs.
- **Reason**: Evaluates statutory risk, checks classification drift, and computes downstream consumer blast radius.
- **Decide**: Evaluates the decision matrix (`APPROVE`, `APPROVE_WITH_WARNING`, `QUARANTINE`, `BLOCK_DEPLOYMENT`).
- **Execute**: Emits machine-readable dossiers, locks or unlocks the pipeline, and generates defect tickets.

### Tier 4: Zero-Token Deterministic Scanner (`src/tier4-deterministic/`)
- Compiled regular expressions for direct PII and contact information.
- Mathematical **Luhn Mod 10** verification for credit card PANs.
- Mathematical **Federal Reserve ABA Routing** transit number checksum calculation.
- AST schema contract differ for field deletions, type narrowing, and nullability violations.
- Executes in **< 2ms** with **0 LLM tokens burned**.
