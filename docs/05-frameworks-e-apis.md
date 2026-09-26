# 05 — Frameworks de agente e APIs de modelo

Versões conferidas no npm/PyPI em **2026-09-25**. Framework muda rápido: confira a versão antes de
copiar tutorial.

## Primeiro: você precisa de framework?

Um agente é **modelo + instrução + ferramentas + laço com teto**. O exemplo
[`exemplos/agente-ts`](../exemplos/agente-ts) faz isso em ~20 linhas com o Vercel AI SDK. Framework
grande entra quando aparece: estado persistente, humano no meio do laço, vários agentes, retomada
depois de falha.

## Os que valem conhecer

| framework | linguagem | quando | versão | status |
|---|---|---|---|---|
| **Vercel AI SDK** (`ai`) | TS | padrão em TypeScript; `ToolLoopAgent`, troca de provedor por uma linha | 7.0.116 | padrão |
| **Pydantic AI** | Python | agente tipado, troca de provedor por string | 2.50.0 | padrão |
| **OpenAI Agents SDK** | Python / TS | ecossistema OpenAI, handoffs entre agentes | 0.22.3 | padrão |
| **LangGraph** | Python / TS | grafo com estado, durável, humano no laço | 1.2.12 | padrão |
| **Google ADK** | Python | ecossistema Gemini, A2A embutido | 2.10.0 | padrão |
| **Claude Agent SDK** | Python / TS | o laço do Claude Code como biblioteca (arquivos, bash, MCP, skills) | TS 0.3.282 | padrão |
| **Mastra** | TS | framework completo (agentes, workflows, memória) | `@mastra/core` 1.71 | em alta |

Mantidos, mas não prioridade para a aula: CrewAI 1.15, DSPy 3.4, LlamaIndex 0.14, smolagents 1.26.

## Pydantic AI em 4 linhas

```python
from pydantic_ai import Agent
agente = Agent('google:gemini-2.5-flash', instructions='Responda em PT-BR, curto.')
print(agente.run_sync('O que é MCP?').output)
```

Armadilha: a mesma chave do Gemini tem **nome de variável diferente** em cada framework —
`GOOGLE_API_KEY` no Pydantic AI, `GOOGLE_GENERATIVE_AI_API_KEY` no Vercel AI SDK. "Chave inválida"
muitas vezes é "chave no nome errado".

## Claude Agent SDK em 6 linhas (pede chave paga da Anthropic)

```python
import anyio
from claude_agent_sdk import query
async def main():
    async for msg in query(prompt="Quantos arquivos .md existem aqui?"):
        print(msg)
anyio.run(main)
```

## APIs para estudar SEM gastar

| provedor | o que é grátis | limite | cuidado |
|---|---|---|---|
| **Ollama** (local) | tudo | o seu hardware | modelo pequeno erra mais — ótimo para aprender a desconfiar |
| **Gemini API** | Flash, Flash-Lite, Gemma | números só no AI Studio | na camada grátis o Google **pode usar seus prompts** — nada pessoal/de cliente |
| **Groq** | gpt-oss, Qwen, Whisper | 30 req/min, 1.000 req/dia **por organização** | a turma inteira numa conta divide o limite |
| **OpenRouter** `:free` | modelos variados | 50 req/dia sem crédito | a lista muda toda semana — não conte com ela em aula |

Modelo local pequeno de 2026: **Gemma 4** E2B/E4B (~3–4,5 GB) roda em notebook.
`ollama pull gemma4:e2b` (tags conferidas: `e2b`, `e4b`).

## Não use

- **GitHub Models** — aposentado em 2026-07-30.
- **AutoGen** — em modo manutenção; substituído pelo Microsoft Agent Framework.
- **LiteLLM 1.82.7 e 1.82.8** — versões do PyPI com ladrão de credencial (2026-03-24). Use ≥ 1.83.0.
  Lição geral: **fixe versão e leia o changelog de dependência que toca em chave de API.**

## A2A — agente conversando com agente

MCP liga **agente → ferramenta**. A2A (Agent2Agent, v1.0, Linux Foundation) liga **agente → agente**
de fornecedores diferentes. Vale saber o nome; ainda é nicho no dia a dia.

Fontes: https://ai-sdk.dev/docs/agents/building-agents · https://pypi.org/project/pydantic-ai/ ·
https://pypi.org/project/claude-agent-sdk/ · https://ai.google.dev/gemini-api/docs/pricing ·
https://console.groq.com/docs/rate-limits · https://openrouter.ai/docs/api/reference/limits ·
https://docs.litellm.ai/blog/security-update-march-2026 · https://github.com/microsoft/autogen
