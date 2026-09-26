// Um agente de verdade: modelo + instrução + ferramenta + laço com teto.
// O modelo entra por parâmetro — é isso que deixa testar sem gastar token (agente.test.ts).
import { ToolLoopAgent, tool, isStepCount, type LanguageModel } from 'ai';
import { z } from 'zod';
import { contarPalavras } from './ferramentas.ts';

export function criarAgente(model: LanguageModel) {
  return new ToolLoopAgent({
    model,
    instructions: 'Você é um assistente em PT-BR. Para contar palavras, use SEMPRE a ferramenta.',
    tools: {
      contarPalavras: tool({
        description: 'Conta as palavras de um texto e diz qual é a mais frequente.',
        inputSchema: z.object({ texto: z.string() }),
        execute: async ({ texto }) => contarPalavras(texto),
      }),
    },
    stopWhen: isStepCount(5), // agente sem teto de voltas é conta sem teto
  });
}
