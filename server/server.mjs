import http from 'node:http';
import { URL } from 'node:url';

const PORT = process.env.PORT || 5000;
const startTime = Date.now();

// In-memory ring buffer for anonymous telemetry
const searchEvents = [];
const MAX_EVENTS = 500;

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  // ── Route: GET /api/health ──────────────────────────────────
  if (req.method === 'GET' && pathname === '/api/health') {
    const uptimeSec = Math.floor((Date.now() - startTime) / 1000);
    return sendJson(res, 200, {
      status: 'healthy',
      app: 'DogmaDesk Bioinfo Workstation',
      version: '1.0.0',
      uptimeSeconds: uptimeSec,
      totalDatabasesIndexed: 55,
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
    });
  }

  // ── Route: GET /api/search (Proxy for NCBI / UniProt) ───────
  if (req.method === 'GET' && pathname === '/api/search') {
    const db = reqUrl.searchParams.get('db') || 'ncbi';
    const query = reqUrl.searchParams.get('q');

    if (!query) {
      return sendJson(res, 400, { error: 'Missing query parameter q' });
    }

    try {
      let targetUrl = '';
      if (db === 'ncbi') {
        targetUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=${encodeURIComponent(query)}&retmode=json&retmax=5`;
      } else if (db === 'uniprot') {
        targetUrl = `https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(query)}&size=5&format=json`;
      } else {
        return sendJson(res, 400, { error: `Unsupported database proxy: ${db}` });
      }

      const fetchRes = await fetch(targetUrl);
      if (!fetchRes.ok) {
        return sendJson(res, fetchRes.status, {
          error: `Upstream error from ${db}`,
          statusText: fetchRes.statusText,
        });
      }

      const data = await fetchRes.json();
      return sendJson(res, 200, {
        source: db,
        query,
        data,
      });
    } catch (err) {
      return sendJson(res, 502, {
        error: 'Proxy fetch failed',
        details: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // ── Route: POST /api/event (Anonymous telemetry) ───────────
  if (req.method === 'POST' && pathname === '/api/event') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) req.destroy();
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const event = {
          event: payload.event || 'search',
          query: payload.query || '',
          tier: payload.tier || 'All',
          timestamp: new Date().toISOString(),
        };

        searchEvents.push(event);
        if (searchEvents.length > MAX_EVENTS) {
          searchEvents.shift();
        }

        return sendJson(res, 201, { success: true, recorded: event });
      } catch {
        return sendJson(res, 400, { error: 'Invalid JSON body' });
      }
    });
    return;
  }

  // ── Route: GET /api/analytics ──────────────────────────────
  if (req.method === 'GET' && pathname === '/api/analytics') {
    const queryCounts = {};
    const tierCounts = {};

    for (const ev of searchEvents) {
      if (ev.query) {
        queryCounts[ev.query] = (queryCounts[ev.query] || 0) + 1;
      }
      if (ev.tier) {
        tierCounts[ev.tier] = (tierCounts[ev.tier] || 0) + 1;
      }
    }

    const topSearches = Object.entries(queryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));

    return sendJson(res, 200, {
      totalEvents: searchEvents.length,
      topSearches,
      tierDistribution: tierCounts,
      recentEvents: searchEvents.slice(-10).reverse(),
    });
  }

  // Fallback 404
  return sendJson(res, 404, {
    error: 'Not found',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/search?db=ncbi|uniprot&q={query}',
      'POST /api/event',
      'GET /api/analytics',
    ],
  });
});

server.listen(PORT, () => {
  console.log(`[DogmaDesk Bioinfo Workstation] Server running at http://localhost:${PORT}`);
  console.log(`[DogmaDesk Bioinfo Workstation] Health endpoint: http://localhost:${PORT}/api/health`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
