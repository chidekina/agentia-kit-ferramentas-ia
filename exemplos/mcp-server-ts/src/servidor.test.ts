import { describe, it, expect } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { criarServidor } from './servidor.ts';

// Um CLIENTE MCP de verdade conversando com o servidor em memória: é o mesmo protocolo
// que o Claude Code usa, sem subir processo nem abrir porta.
async function conectar() {
  const [ladoCliente, ladoServidor] = InMemoryTransport.createLinkedPair();
  await criarServidor().connect(ladoServidor);
  const cliente = new Client({ name: 'teste', version: '0.0.0' });
  await cliente.connect(ladoCliente);
  return cliente;
}

describe('quando um cliente MCP se conecta', () => {
  it('então enxerga a ferramenta com descrição', async () => {
    const { tools } = await (await conectar()).listTools();
    const t = tools.find((x) => x.name === 'dias_ate');
    expect(t?.description).toMatch(/dias/i);
  });

  it('então a ferramenta conta os dias entre duas datas', async () => {
    const r = await (await conectar()).callTool({
      name: 'dias_ate', arguments: { de: '2026-09-26', ate: '2026-12-25' },
    });
    expect(r.content).toEqual([{ type: 'text', text: '90' }]);
  });

  it('então data inválida volta como erro da ferramenta, não derruba o servidor', async () => {
    const r = await (await conectar()).callTool({
      name: 'dias_ate', arguments: { de: 'ontem', ate: '2026-12-25' },
    });
    expect(r.isError).toBe(true);
  });
});
