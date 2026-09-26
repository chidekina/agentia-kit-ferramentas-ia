import { describe, it, expect } from 'vitest';
import { escolherModelo } from './perguntar.ts';

// A escolha de provedor é onde o aluno mais tropeça: variável com nome errado, modelo
// que não existe no provedor. Então ela é função pura sobre o ambiente, e tem teste.
describe('quando o aluno não configura nada', () => {
  it('então usa o Ollama local com o modelo pequeno', () => {
    const m = escolherModelo({});
    expect(m.provider).toMatch(/ollama/);
    expect(m.modelId).toBe('llama3.2:3b');
  });
});

describe('quando o aluno escolhe o Gemini', () => {
  it('então usa o provedor do Google com o Flash', () => {
    const m = escolherModelo({ PROVEDOR: 'gemini' });
    expect(m.provider).toMatch(/google/);
    expect(m.modelId).toBe('gemini-2.5-flash');
  });
});

describe('quando o aluno escolhe outro modelo', () => {
  it('então MODELO troca o modelo sem trocar o provedor', () => {
    const m = escolherModelo({ MODELO: 'gemma4:e2b' });
    expect(m.provider).toMatch(/ollama/);
    expect(m.modelId).toBe('gemma4:e2b');
  });
});
