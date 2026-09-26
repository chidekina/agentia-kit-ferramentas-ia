// Servidor MCP mínimo: UMA ferramenta, transporte stdio.
// Registrar no Claude Code (a partir desta pasta):
//   claude mcp add dias -- node --experimental-strip-types "$PWD/src/servidor.ts"
// Inspecionar sem agente nenhum:  npm run inspector
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const DIA_MS = 24 * 60 * 60 * 1000;
const dataISO = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use AAAA-MM-DD');

export function criarServidor() {
  const servidor = new McpServer({ name: 'dias', version: '0.1.0' });

  // A descrição é o que o MODELO lê para decidir usar a ferramenta — é prompt, não comentário.
  // E é também por onde um servidor malicioso injeta instrução ("tool poisoning"): leia antes de instalar.
  servidor.registerTool(
    'dias_ate',
    {
      description: 'Conta quantos dias corridos existem entre duas datas (AAAA-MM-DD).',
      inputSchema: { de: dataISO, ate: dataISO },
    },
    async ({ de, ate }) => {
      const dias = Math.round((Date.parse(ate) - Date.parse(de)) / DIA_MS);
      return { content: [{ type: 'text', text: String(dias) }] };
    },
  );

  return servidor;
}

// Só sobe o stdio quando executado direto — importado pelo teste, não.
if (import.meta.url === `file://${process.argv[1]}`) {
  await criarServidor().connect(new StdioServerTransport());
}
