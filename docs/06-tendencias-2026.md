# 06 — O que está em alta (setembro de 2026)

Pesquisa feita em 2026-09-25, só com fontes abertas e datadas. Cada item diz se já é **prática
padrão** ou **técnica de nicho** — não é a mesma recomendação.

## As 6 tendências

| # | tendência | status | por que importa para você |
|---|---|---|---|
| 1 | **Agent Skills (`SKILL.md`) virou padrão aberto** — ~40 agentes leem o mesmo formato | padrão | a skill que você escreve hoje roda no agente que sua empresa usar amanhã |
| 2 | **`AGENTS.md` como arquivo único de instrução** — sob a Agentic AI Foundation | padrão | um arquivo, todos os agentes |
| 3 | **MCP 2026-07-28, sem estado** — servidor remoto escala como API comum | padrão | MCP remoto com OAuth virou o jeito normal de plugar SaaS no agente |
| 4 | **CLI + skill no lugar de MCP** quando a CLI já existe (Playwright CLI) | em alta | menos token, menos peça móvel |
| 5 | **Desenvolvimento guiado por spec** — GitHub Spec Kit 1.0 (spec → plano → tarefas) | nicho crescendo | é o que o nosso workflow faz com o GSD |
| 6 | **Evals e observabilidade de LLM** — promptfoo, Langfuse, Phoenix | padrão em produto com IA | sem eval você não sabe se a troca de modelo piorou |

## Agentes de código — comparação

| agente | código aberto | grátis? | AGENTS.md | MCP | Skills |
|---|---|---|---|---|---|
| Claude Code | não | não (plano pago) | sim | sim | sim |
| Gemini CLI 0.61 | Apache-2.0 | **sim, 1.000 req/dia** com login Google | sim | sim | sim |
| OpenCode 1.18 | MIT | **sim**, modelos grátis no "Zen" | sim | sim | sim |
| Codex CLI | Apache-2.0 | precisa de plano ChatGPT | sim | sim | sim |
| Copilot CLI / agente | não | **plano Estudante** (verificado) | sim | sim | sim |
| Cursor | não | não informado | sim | — | sim |

```bash
npm install -g @google/gemini-cli               # Gemini CLI
curl -fsSL https://opencode.ai/install | bash   # OpenCode
```

Ferramentas de apoio em alta: **mise** (versões de linguagem por projeto, ambiente reproduzível
para o agente), **Spec Kit** (`uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v1.0.12`),
**promptfoo** (`npx promptfoo@latest init`), **Langfuse** (tracing open source, self-host).

## Morreu ou parou — não ensine, não instale

| ferramenta | o que houve | fonte |
|---|---|---|
| Roo Code | encerrado em 2026-05-15, repositório arquivado | GitHub API (`archived: true`) |
| Windsurf / Cascade | virou Devin Desktop; Cascade removido em 2026-09-08 | techpillow.co (2026) |
| Aider | última versão em 2025-08-09 — parado há 13 meses | GitHub releases |
| GitHub Models | aposentado em 2026-07-30 | docs.github.com |
| Servidores MCP de referência antigos | arquivados em 2025-05-29 | github.com/modelcontextprotocol/servers-archived |
| AutoGen | modo manutenção | github.com/microsoft/autogen |

## O que NÃO achamos (e por isso não afirmamos)

- Ranking confiável de agentes de código em setembro/2026 — os placares não abriram para
  conferência. Não cite "o melhor agente".
- Número de instalação dos plugins do Claude Code — a Anthropic não publica.
- Se o Claude Code já fala a versão 2026-07-28 do MCP.

## Fontes principais

https://agentskills.io · https://agents.md · https://blog.modelcontextprotocol.io/posts/2026-07-28/ ·
https://github.com/microsoft/playwright-cli · https://github.com/github/spec-kit/releases ·
https://github.com/google-gemini/gemini-cli · https://opencode.ai/docs/ ·
https://github.blog/changelog/2026-03-13-updates-to-github-copilot-for-students/ ·
https://github.com/promptfoo/promptfoo/releases · https://github.com/langfuse/langfuse/releases ·
https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
