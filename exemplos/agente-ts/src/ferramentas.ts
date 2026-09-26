export type Contagem = { total: number; maisFrequente: string | null };

export function contarPalavras(texto: string): Contagem {
  const palavras = texto.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  const freq = new Map<string, number>();
  for (const p of palavras) freq.set(p, (freq.get(p) ?? 0) + 1);

  let maisFrequente: string | null = null;
  let max = 0;
  for (const [p, n] of freq) if (n > max) [maisFrequente, max] = [p, n];

  return { total: palavras.length, maisFrequente };
}
