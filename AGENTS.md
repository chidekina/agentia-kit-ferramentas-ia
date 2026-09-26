# AGENTS.md

Instruções para QUALQUER agente de código que abrir este repositório — Claude Code, Codex, Gemini
CLI, OpenCode, Cursor, Copilot. Um arquivo, todos os agentes (padrão aberto: https://agents.md).

## O que é este repositório

Kit de estudo da aula de ferramentas e frameworks de IA da Agentia. Não é produto: é material para
ler, rodar e modificar.

## Comandos

```bash
./verificar-ferramentas.sh                 # o que está instalado na sua máquina
npm test --prefix exemplos/agente-ts       # testes do agente (sem modelo, sem chave)
npm test --prefix exemplos/mcp-server-ts   # testes do servidor MCP
bash .claude/hooks/proteger-env.test.sh    # teste do hook
```

Testes com `vitest run`. Node 24+ (roda TypeScript direto com `--experimental-strip-types`).

## Regras

- **Teste antes do código.** Mudou comportamento → primeiro um teste que falha, depois o mínimo que
  passa.
- **Nunca escreva em `.env`.** Segredo mora ali e não entra no git. Use `.env.example` com valor de
  mentira. (Um hook bloqueia isso no Claude Code; nos outros agentes, esta linha é a única guarda.)
- **Nada de dado pessoal ou de cliente em API gratuita.** Na camada gratuita, o provedor pode usar
  seus prompts para treinar o modelo.
- **Commit pequeno, uma intenção por commit.** Mensagem diz o PORQUÊ.
- Responda em português do Brasil.
