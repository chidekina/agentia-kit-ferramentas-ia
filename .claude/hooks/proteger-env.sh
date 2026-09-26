#!/usr/bin/env bash
# Hook PreToolUse: impede o agente de ESCREVER em arquivos .env (segredo mora ali).
# O Claude Code manda um JSON no stdin; exit 2 bloqueia e o stderr volta para o modelo
# como explicação. .env.example é modelo sem segredo, então passa.
# Por que hook e não instrução no AGENTS.md: instrução o modelo PODE ignorar; hook não.
arquivo=$(jq -r '.tool_input.file_path // empty')
nome=$(basename -- "${arquivo:-x}")
case "$nome" in
  .env.example) exit 0 ;;
  .env|.env.*)
    echo "Bloqueado: $nome guarda segredo. Edite .env.example e peça ao humano para copiar." >&2
    exit 2 ;;
esac
exit 0
