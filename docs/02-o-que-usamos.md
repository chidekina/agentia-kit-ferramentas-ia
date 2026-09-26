# 02 — O que a gente usa (medido, não lembrado)

Números contados na nossa pasta de projetos em **2026-09-25**. Número em documento envelhece — o
comando para recontar vai junto.

```bash
# quantos package.json usam uma dependência (fora de node_modules)
find ~/projetos -maxdepth 6 -name package.json -not -path '*/node_modules/*' \
  | xargs grep -l '"vitest"' | wc -l
```

## 1. O ambiente de agente (onde a IA trabalha)

| peça | o que é | uso medido |
|---|---|---|
| **Claude Code** | agente de código no terminal | ferramenta principal, v2.1.x |
| **Skills** | pastas `SKILL.md` com instrução sob demanda | 119 instaladas; mais usadas: `code-review` (289), `impact` (174), ciclo GSD |
| **Subagentes** | agentes com contexto próprio, disparados pelo principal | mais usados: `executor` (1.067), `general-purpose` (967), `Explore` (362) |
| **Hooks** | scripts que rodam em eventos do agente | 131 registrados |
| **Plugins** | pacote de skills + agentes + hooks + MCP | 15 ativos: `superpowers`, Trail of Bits (segurança), LSP de TypeScript |
| **GSD** | orquestração spec → plano → execução → verificação | 72 skills, 34 subagentes |
| **Ollama** | modelo local | `llama3.2:3b`, `nomic-embed-text` (embeddings) |

## 2. MCP — as ferramentas que o agente alcança

| servidor | para quê | chamadas medidas |
|---|---|---|
| Linear | issues e backlog | 231 |
| ARIA (nosso) | contexto, tarefas, busca semântica nas notas | 197 |
| GitHub | PR, issue, código remoto | 80 |
| Supabase | banco de staging/produção | 81 |
| Serena | navegação de código por símbolo (LSP) | 56 |
| Docker (nosso) | containers e bancos locais | 11 |
| Playwright | navegador automatizado (testes E2E) | por projeto |

## 3. Stack das aplicações

| camada | escolha | repositórios |
|---|---|---|
| linguagem | TypeScript | 198 `package.json` |
| front | Next.js + React | 61 |
| validação | Zod | 69 |
| teste | Vitest (+ Playwright no E2E) | 59 |
| banco | Drizzle ORM (Postgres) | 38 |
| API | Fastify | 24 |
| Python | FastAPI + SQLAlchemy + Alembic + pytest | 15 |
| runtime | Bun, Node 24, `uv` no Python | — |
| deploy | Docker Compose + Dokploy (VPS), Vercel | 102 compose, 22 `vercel.json` |
| CI | GitHub Actions | 52 repositórios |
| logs / erros | Pino (28), Sentry (13) | — |

## 4. SDK de IA dentro das aplicações

| SDK | repositórios |
|---|---|
| `openai` | 11 |
| `@anthropic-ai/sdk` | 6 |
| `@modelcontextprotocol/sdk` | 6 |
| Vercel AI SDK (`ai`) | 2 |
| LangGraph | 1 (Python) |
| LangChain | 3 manifestos (2 Python, 1 JS) |

**A leitura que importa:** a IA mora no **ambiente** (agente + skills + MCP + hooks), muito mais do
que dentro dos produtos. Framework de agente é para quando o PRODUTO é um agente — e aí a gente
escolhe pelo problema, não pela moda (ver `05-frameworks-e-apis.md`).
