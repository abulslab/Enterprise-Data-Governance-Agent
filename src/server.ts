import http from 'http';
import { GovernanceAgent } from './agent.js';
import { GovernanceMemory } from './memory/governanceMemory.js';
import { PolicyCompiler } from './compiler/policyCompiler.js';
import { RemediationSynthesizer } from './autofix/remediationSynthesizer.js';
import { EscalationManager } from './hitl/escalationManager.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

function parseJsonBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: http.ServerResponse, status: number, data: any) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data, null, 2));
}

export function createServer(): http.Server {
  return http.createServer(async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const path = url.pathname;

    try {
      // Health Check
      if (req.method === 'GET' && path === '/api/health') {
        sendJson(res, 200, {
          status: 'UP',
          service: 'Enterprise Data Governance Agent',
          cognitiveArchitecture: '4-Tier Cognitive',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        });
        return;
      }

      // 1. Audit Endpoint (CI/CD & Ingestion Boundary Gate)
      if (req.method === 'POST' && path === '/api/audit') {
        const body = await parseJsonBody(req);
        if (!body.candidate) {
          sendJson(res, 400, { error: "Missing required 'candidate' dataset schema in request body." });
          return;
        }

        const agent = new GovernanceAgent({
          mode: (body.provider || body.mode || 'mock'),
          geminiKey: body.geminiApiKey || body.geminiKey || process.env.GEMINI_API_KEY,
          ollamaUrl: body.ollamaUrl || process.env.OLLAMA_URL
        });

        const result = await agent.audit(body.candidate, body.baseline);

        // Record in Governance Memory
        const incidentHistory = GovernanceMemory.recordAudit(
          body.candidate.datasetUrn,
          result.decision,
          result.dossier.regulatoryCitations.map(r => r.violationContext)
        );

        // Synthesize Remediation
        const remediation = RemediationSynthesizer.synthesize(
          body.candidate,
          result.dossier.sensitiveDataFindings,
          result.dossier.schemaDiffFindings
        );

        // Generate HITL package if QUARANTINE or BLOCK_DEPLOYMENT
        let hitlPackage = null;
        if (result.decision === 'QUARANTINE' || result.decision === 'BLOCK_DEPLOYMENT' || incidentHistory.isRepeatOffender) {
          hitlPackage = EscalationManager.createEscalationPackage(
            body.candidate,
            result.decision,
            result.dossier.sensitiveDataFindings,
            result.dossier.schemaDiffFindings,
            incidentHistory.isRepeatOffender
          );
        }

        sendJson(res, 200, {
          ...result,
          incidentHistory,
          remediation,
          hitlPackage
        });
        return;
      }

      // 2. Governance Memory History
      if (req.method === 'GET' && path === '/api/memory') {
        const histories = GovernanceMemory.getAllHistories();
        sendJson(res, 200, {
          totalTrackedDatasets: histories.length,
          repeatOffendersCount: histories.filter(h => h.isRepeatOffender).length,
          histories
        });
        return;
      }

      // 3. Natural Language Policy Compiler
      if (req.method === 'POST' && path === '/api/compile-policy') {
        const body = await parseJsonBody(req);
        if (!body.policyPrompt) {
          sendJson(res, 400, { error: "Missing 'policyPrompt' text string in request body." });
          return;
        }
        const compiled = PolicyCompiler.compile(body.policyPrompt);
        sendJson(res, 200, compiled);
        return;
      }

      // 4. Catalog Auto-Tagger (Simulated Unity Catalog / Collibra / Atlan integration)
      if (req.method === 'GET' && path.startsWith('/api/catalog/tags/')) {
        const urn = decodeURIComponent(path.replace('/api/catalog/tags/', ''));
        const memory = GovernanceMemory.getHistory(urn);
        sendJson(res, 200, {
          datasetUrn: urn,
          catalogTags: [
            'governance:audited',
            `tier:${memory?.isRepeatOffender ? 'RESTRICTED' : 'CONFIDENTIAL'}`,
            `escalation:${memory?.escalationLevel || 'STANDARD'}`,
            'agent:autonomous-edga'
          ],
          certifiedAt: new Date().toISOString()
        });
        return;
      }

      sendJson(res, 404, { error: `Endpoint '${path}' not found.` });
    } catch (err: any) {
      sendJson(res, 500, { error: err.message || 'Internal Server Error' });
    }
  });
}

// Start server if run directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`🛡️ Enterprise Data Governance Agent REST API listening on http://localhost:${PORT}`);
  });
}
