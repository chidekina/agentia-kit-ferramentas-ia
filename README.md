# Kit — Ferramentas e Frameworks de IA

Semente da aula prática da **Agentia — Escola de IA**. Tudo o que a gente usa no dia a dia com IA,
num repositório que você clona, roda e modifica.

## Começar (5 minutos)

```bash
./verificar-ferramentas.sh                   # o que falta na sua máquina
npm install --prefix exemplos/agente-ts
npm test    --prefix exemplos/agente-ts      # 8 testes, sem modelo e sem chave
ollama pull llama3.2:3b                      # modelo local grátis (~2 GB)
npm run agente --prefix exemplos/agente-ts   # o agente de verdade, offline
```

Sem Ollama? Use a camada gratuita do Gemini (chave em https://aistudio.google.com):

```bash
PROVEDOR=gemini GOOGLE_GENERATIVE_AI_API_KEY=sua-chave npm run agente --prefix exemplos/agente-ts
```

## O que tem aqui

```
AGENTS.md                      instrução para QUALQUER agente de código (Claude, Codex, Gemini, OpenCode...)
.claude/
  settings.json                hook + permissão: o agente não lê nem escreve .env
  hooks/proteger-env.sh        o hook, e o teste dele (proteger-env.test.sh)
  skills/revisar-diff/         uma skill: revisa o diff procurando segredo, bug e teste faltando
  agents/pesquisador.md        um subagente: pesquisa na web e devolve só a conclusão com fonte
.mcp.json                      registra o servidor MCP do exemplo neste projeto
exemplos/
  agente-ts/                   agente com ferramenta, Vercel AI SDK, Ollama ou Gemini, com teste
  mcp-server-ts/               servidor MCP de uma ferramenta, com teste por cliente MCP real
docs/
  01-nosso-workflow.md         especificar → planejar → testar → implementar → revisar → entregar
  02-o-que-usamos.md           as ferramentas, com o número de uso medido
  03-claude-code-na-pratica.md memória, skills, subagentes, hooks, MCP, headless
  04-mcp.md                    o protocolo, servidores que valem, segurança
  05-frameworks-e-apis.md      frameworks de agente e APIs gratuitas para estudar
  06-tendencias-2026.md        o que está em alta, e o que morreu
  07-dicas-e-armadilhas.md     21 dicas que custaram caro
verificar-ferramentas.sh       diagnóstico do ambiente
EXERCICIOS.md                  o que fazer na aula e depois dela
```

## Regra do kit

Todo exemplo tem teste, e todo teste foi quebrado de propósito para provar que fica vermelho. Se você
mudar um exemplo, mantenha isso.

Versões e fontes conferidas em **2026-09-25**. Ferramenta de IA envelhece em meses: antes de seguir
um tutorial, confira a versão.
