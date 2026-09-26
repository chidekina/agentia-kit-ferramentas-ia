import { describe, it, expect } from 'vitest';
import { contarPalavras } from './ferramentas.ts';

// A ferramenta é uma função pura: testa sem modelo, sem rede, sem chave.
// O LLM decide QUANDO chamar; o que ela devolve é código seu, e código seu tem teste.
describe('quando o agente pede para contar palavras', () => {
  it('então devolve o total e a palavra mais frequente', () => {
    expect(contarPalavras('o gato e o rato')).toEqual({ total: 5, maisFrequente: 'o' });
  });

  it('então ignora caixa e pontuação', () => {
    expect(contarPalavras('Agente, agente! AGENTE.')).toEqual({ total: 3, maisFrequente: 'agente' });
  });

  it('então texto vazio devolve zero, não quebra', () => {
    expect(contarPalavras('   ')).toEqual({ total: 0, maisFrequente: null });
  });
});
