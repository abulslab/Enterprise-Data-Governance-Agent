# Enterprise Data Governance Agent — Deployment Modes

This document details the four production deployment modes supported by the Enterprise Data Governance Agent.

---

## 1. CI/CD Governance Gate (Shift-Left Pipeline Gating)

Prevent non-compliant schemas, direct PII, or breaking contract drift from ever merging into production branches.

### GitHub Actions
```yaml
name: Data Governance Gate
on: [pull_request]
jobs:
  governance-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - name: Run Autonomous Governance Audit
        run: npx tsx src/cli.ts --candidate ./schemas/new_order.json --baseline ./contracts/orders_v1.json --llm mock
```
**Exit Code Semantics**:
- `0`: **PASS** (`APPROVE` or `APPROVE_WITH_WARNING`). Pipeline proceeds.
- `1`: **BLOCK** (`QUARANTINE` or `BLOCK_DEPLOYMENT`). PR blocked; Invariant G-4 Human-in-the-Loop review triggered.

---

## 2. Streaming Ingestion Boundary (Kafka / Kinesis / Event Hub)

Intercept event streams in micro-batches before records land in lakehouse delta tables.

```typescript
import { GovernanceAgent } from 'enterprise-data-governance-agent';

const agent = new GovernanceAgent({ provider: 'mock' });

export async function processKafkaBatch(records: ConsumerRecord[]) {
  const candidateSchema = extractSchema(records);
  const result = await agent.audit(candidateSchema, registeredContract);

  if (result.decision === 'QUARANTINE') {
    // Route entire partition to dead-letter quarantine topic
    await producer.send({ topic: 'lakehouse.quarantine.dlq', messages: records });
    console.warn(`[GOVERNANCE INTERCEPTOR] Diverted ${records.length} records to DLQ.`);
  } else {
    // Route compliant records to Delta Lake ingestion topic
    await producer.send({ topic: 'lakehouse.production.certified', messages: records });
  }
}
```

---

## 3. Data Catalog Governance (Unity Catalog / Collibra / Atlan / DataHub)

Automatically discover sensitive data attributes, classify datasets into standard enterprise tiers (`PUBLIC`, `INTERNAL`, `CONFIDENTIAL`, `RESTRICTED`), and push tags directly to enterprise data catalogs.

### Automated Metadata Tagging
```bash
# Query Catalog Tagging API
curl http://localhost:8080/api/catalog/tags/urn:datacatalog:production:finance:customer_orders_v2
```
**Response**:
```json
{
  "datasetUrn": "urn:datacatalog:production:finance:customer_orders_v2",
  "catalogTags": [
    "governance:audited",
    "tier:RESTRICTED",
    "escalation:STANDARD",
    "agent:autonomous-edga"
  ],
  "certifiedAt": "2026-10-30T21:00:00.000Z"
}
```

---

## 4. Production REST API Server

Expose real-time governance, memory inspection, and policy compilation endpoints over HTTP.

### Start the REST Server
```bash
npm run server
# Listening on http://localhost:8080
```

### Endpoints
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status |
| `POST` | `/api/audit` | Execute autonomous governance audit on schema |
| `GET` | `/api/memory` | Retrieve historical audits and repeat offenders |
| `POST` | `/api/compile-policy` | Compile natural language prompt into Invariant rule |
| `GET` | `/api/catalog/tags/:urn` | Export catalog tags for Unity Catalog / Collibra |
