# 03 — Claude Code na prática: as 6 peças

Tudo aqui tem exemplo funcionando **neste repositório**. Abra o arquivo, leia, rode.

| peça | onde mora | quem decide quando roda | exemplo aqui |
|---|---|---|---|
| Memória | `AGENTS.md` / `CLAUDE.md` | sempre carregada | [`AGENTS.md`](../AGENTS.md) |
| Skill | `.claude/skills/<nome>/SKILL.md` | o modelo (pela descrição) ou você (`/nome`) | [`revisar-diff`](../.claude/skills/revisar-diff/SKILL.md) |
| Subagente | `.claude/agents/<nome>.md` | o modelo delega, com contexto limpo | [`pesquisador`](../.claude/agents/pesquisador.md) |
| Hook | `.claude/settings.json` | **a máquina**, em todo evento — o modelo não escapa | [`proteger-env.sh`](../.claude/hooks/proteger-env.sh) |
| MCP | `.mcp.json` ou `claude mcp add` | o modelo chama a ferramenta | [`servidor MCP`](../exemplos/mcp-server-ts/src/servidor.ts) |
| Headless | `claude -p` | seu script / CI | abaixo |

## 1. Memória — `AGENTS.md`

Comandos, regras e armadilhas do projeto. O Claude Code lê `AGENTS.md` e `CLAUDE.md`; os outros
agentes (Codex, Gemini CLI, OpenCode, Cursor, Copilot) leem `AGENTS.md`. **Escreva um só.**

Curto e acionável. "Use `vitest run`, nunca `bun test`" vale mais que três parágrafos de filosofia.

## 2. Skill — instrução que carrega sob demanda

Só o `name` + `description` ficam no contexto o tempo todo; o corpo carrega quando a tarefa pede.
Por isso a **descrição é o gatilho** — escreva quando usar, não o que é.

```markdown
---
name: revisar-diff
description: Revisa o diff atual ... Use quando o aluno pedir "revisa meu código" ...
allowed-tools: Bash(git diff *) Read Grep
---
```

- Campos úteis: `disable-model-invocation: true` (só você chama), `allowed-tools`,
  `context: fork` (roda num subagente).
- "Slash command" virou skill: `.claude/commands/x.md` ainda funciona, mas o conceito é um só.
- **Padrão aberto**: o formato `SKILL.md` roda em ~40 agentes (https://agentskills.io).

## 3. Subagente — contexto limpo para tarefa isolada

Pesquisa, varredura, revisão: coisas que despejam muito texto. O subagente lê tudo e devolve **só a
conclusão**; seu contexto principal fica limpo. `model: haiku` para tarefa barata.

## 4. Hook — a regra que o modelo não consegue ignorar

```json
{ "hooks": { "PreToolUse": [ { "matcher": "Edit|Write",
  "hooks": [ { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/proteger-env.sh" } ] } ] } }
```

O script recebe um JSON no stdin. **Exit 2 bloqueia** e o stderr volta ao modelo como explicação.
Teste o hook alimentando o JSON na mão — é o que `proteger-env.test.sh` faz:

```bash
echo '{"tool_input":{"file_path":"/x/.env"}}' | .claude/hooks/proteger-env.sh; echo $?   # 2
```

## 5. MCP — dar ferramenta ao agente

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp          # remoto, login OAuth
claude mcp add dias -- node --experimental-strip-types "$PWD/exemplos/mcp-server-ts/src/servidor.ts"   # local, stdio
claude mcp list
```

Escopo: `--scope local` (padrão, só você neste projeto), `project` (vai para `.mcp.json`, o time
todo), `user` (todos os seus projetos). Servidor que só um projeto usa fica no projeto.

## 6. Headless — agente dentro de script e CI

```bash
git diff main | claude -p "revise este diff e liste bugs como arquivo:linha — problema"

claude -p "Liste as funções exportadas de exemplos/agente-ts/src/agente.ts" --allowedTools "Read" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"funcoes":{"type":"array","items":{"type":"string"}}},"required":["funcoes"]}' \
  | jq '.structured_output'
```

`--bare` pula hooks, skills, plugins, MCP e `CLAUDE.md` — execução reproduzível em CI (pede
`ANTHROPIC_API_KEY`). No GitHub: `anthropics/claude-code-action@v1`, instalado com
`/install-github-app`.

Fonte de tudo acima: https://code.claude.com/docs (skills, sub-agents, hooks-guide, mcp, headless),
conferido em 2026-09-25.
