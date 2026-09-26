// Ponto de entrada: escolhe o provedor e roda o agente. Os dois provedores são GRATUITOS:
//   Ollama local (padrão) — offline, nada sai da máquina:   ollama pull llama3.2:3b
//   Gemini (camada gratuita):  PROVEDOR=gemini GOOGLE_GENERATIVE_AI_API_KEY=... npm run agente
// Na camada gratuita do Gemini o Google pode usar seus prompts para treinar. Nada de dado
// pessoal ou de cliente ali.
import { google } from '@ai-sdk/google';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { criarAgente } from './agente.ts';

const ollama = createOpenAICompatible({ name: 'ollama', baseURL: 'http://localhost:11434/v1' });

type Ambiente = { PROVEDOR?: string; MODELO?: string };

export function escolherModelo(env: Ambiente) {
  return env.PROVEDOR === 'gemini'
    ? google(env.MODELO ?? 'gemini-2.5-flash')
    : ollama(env.MODELO ?? 'llama3.2:3b');
}

// Só roda quando executado direto — importado pelo teste, não.
if (import.meta.url === `file://${process.argv[1]}`) {
  const pergunta = process.argv.slice(2).join(' ') ||
    'Quantas palavras tem "o rato roeu a roupa do rei de roma", e qual a mais frequente?';

  const r = await criarAgente(escolherModelo(process.env)).generate({ prompt: pergunta });
  for (const passo of r.steps)
    for (const c of passo.toolCalls)
      process.stdout.write(`[ferramenta] ${c.toolName}(${JSON.stringify(c.input)})\n`);
  process.stdout.write(`${r.text}\n`);
}
