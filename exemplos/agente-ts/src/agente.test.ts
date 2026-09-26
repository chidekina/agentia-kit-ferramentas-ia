import { describe, it, expect } from 'vitest';
import { MockLanguageModelV4 } from 'ai/test';
import { criarAgente } from './agente.ts';

// Testar agente sem gastar token: um modelo FALSO que responde um roteiro fixo.
// Volta 1: o "modelo" pede a ferramenta. Volta 2: responde com texto.
// O que se prova aqui é o LAÇO — a ferramenta foi chamada e o resultado voltou ao modelo.
const uso = {
  inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 1, text: 1, reasoning: 0 },
};

function modeloRoteirizado() {
  return new MockLanguageModelV4({
    doGenerate: [
      {
        content: [{
          type: 'tool-call', toolCallId: 'c1', toolName: 'contarPalavras',
          input: JSON.stringify({ texto: 'o gato e o rato' }),
        }],
        finishReason: { unified: 'tool-calls', raw: 'tool_calls' },
        usage: uso, warnings: [],
      },
      {
        content: [{ type: 'text', text: 'São 5 palavras; a mais frequente é "o".' }],
        finishReason: { unified: 'stop', raw: 'stop' },
        usage: uso, warnings: [],
      },
    ],
  });
}

describe('quando o agente recebe uma pergunta de contagem', () => {
  it('então chama a ferramenta e devolve o resultado dela ao modelo', async () => {
    const r = await criarAgente(modeloRoteirizado()).generate({ prompt: 'conte' });

    const resultados = r.steps.flatMap((p) => p.toolResults);
    expect(resultados).toHaveLength(1);
    expect(resultados[0].output).toEqual({ total: 5, maisFrequente: 'o' });
    expect(r.text).toContain('5 palavras');
  });

  it('então para no teto de voltas mesmo se o modelo insistir', async () => {
    // Modelo "teimoso": pede a ferramenta para sempre. Sem teto, seria conta sem fim.
    const teimoso = new MockLanguageModelV4({
      doGenerate: async () => ({
        content: [{ type: 'tool-call', toolCallId: crypto.randomUUID(), toolName: 'contarPalavras',
          input: JSON.stringify({ texto: 'a' }) }],
        finishReason: { unified: 'tool-calls', raw: 'tool_calls' },
        usage: uso, warnings: [],
      }),
    });
    const r = await criarAgente(teimoso).generate({ prompt: 'conte' });
    expect(r.steps.length).toBe(5);
  });
});
