/* The MCP stdio proxy that Claude Code spawns. Kept as an embedded string so
 * it can be written to the plugin's dataDir at startup - files inside the
 * .jpl are not reliably addressable on disk, dataDir is.
 *
 * IMPORTANT: the embedded code must not contain backticks or "${" sequences.
 * It is a zero-dependency JSON-RPC-over-stdio MCP server that forwards every
 * tools/list and tools/call to the plugin's local control server, where the
 * real work happens via joplin.data (including the write-confirmation flow).
 */
export const MCP_PROXY_SOURCE = `/* Joplin Claude - MCP stdio proxy (auto-generated, do not edit) */
'use strict';
var http = require('http');

var PORT = parseInt(process.env.JOPLIN_CLAUDE_PORT || '0', 10);

function callControl(method, path, payload, cb) {
  var data = payload ? Buffer.from(JSON.stringify(payload), 'utf8') : null;
  var req = http.request({
    host: '127.0.0.1',
    port: PORT,
    path: path,
    method: method,
    headers: data
      ? { 'Content-Type': 'application/json', 'Content-Length': data.length }
      : {},
    timeout: 180000,
  }, function (res) {
    var chunks = [];
    res.on('data', function (c) { chunks.push(c); });
    res.on('end', function () {
      try {
        cb(null, JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (e) {
        cb(e, null);
      }
    });
  });
  req.on('error', function (e) { cb(e, null); });
  req.on('timeout', function () { req.destroy(new Error('control server timeout')); });
  if (data) req.write(data);
  req.end();
}

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + '\\n');
}

function reply(id, result) {
  send({ jsonrpc: '2.0', id: id, result: result });
}

function replyError(id, message) {
  send({ jsonrpc: '2.0', id: id, error: { code: -32000, message: String(message) } });
}

var buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (chunk) {
  buffer += chunk;
  var idx;
  while ((idx = buffer.indexOf('\\n')) >= 0) {
    var line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (line) handleLine(line);
  }
});
process.stdin.on('end', function () { process.exit(0); });

function handleLine(line) {
  var msg;
  try { msg = JSON.parse(line); } catch (e) { return; }
  var id = msg.id;
  var method = msg.method;

  if (method === 'initialize') {
    reply(id, {
      protocolVersion: (msg.params && msg.params.protocolVersion) || '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: 'joplin', version: '0.1.0' },
    });
    return;
  }
  if (method === 'ping') { reply(id, {}); return; }
  if (!method || method.indexOf('notifications/') === 0) return;

  if (method === 'tools/list') {
    callControl('GET', '/tools', null, function (err, res) {
      if (err) { replyError(id, err.message); return; }
      reply(id, { tools: res.tools || [] });
    });
    return;
  }

  if (method === 'tools/call') {
    var name = msg.params && msg.params.name;
    var args = (msg.params && msg.params.arguments) || {};
    callControl('POST', '/tool', { name: name, arguments: args }, function (err, res) {
      if (err) { replyError(id, err.message); return; }
      reply(id, {
        content: [{ type: 'text', text: typeof res.result === 'string' ? res.result : JSON.stringify(res.result) }],
        isError: !!res.isError,
      });
    });
    return;
  }

  if (id !== undefined) replyError(id, 'Method not supported: ' + method);
}
`;
