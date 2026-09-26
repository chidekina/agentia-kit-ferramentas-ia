#!/usr/bin/env bash
# Teste do hook proteger-env.sh: alimenta o JSON que o Claude Code manda no stdin
# e confere o exit code. 2 = bloqueia (e o stderr volta para o modelo). 0 = segue.
set -u
H="$(dirname "$0")/proteger-env.sh"
falhas=0
caso() { # caso <esperado> <descricao> <json>
  printf '%s' "$3" | bash "$H" >/dev/null 2>&1; got=$?
  if [ "$got" = "$1" ]; then echo "ok   $2"; else echo "FALHA $2 (esperado $1, veio $got)"; falhas=$((falhas+1)); fi
}
caso 2 "bloqueia Write em .env"            '{"tool_name":"Write","tool_input":{"file_path":"/p/.env"}}'
caso 2 "bloqueia Edit em .env.local"       '{"tool_name":"Edit","tool_input":{"file_path":"/p/app/.env.local"}}'
caso 0 "libera .env.example (é modelo)"    '{"tool_name":"Write","tool_input":{"file_path":"/p/.env.example"}}'
caso 0 "libera arquivo comum"              '{"tool_name":"Edit","tool_input":{"file_path":"/p/src/env.ts"}}'
caso 0 "libera ferramenta sem file_path"   '{"tool_name":"Bash","tool_input":{"command":"ls"}}'
[ "$falhas" = 0 ] && echo "5/5 ok" || { echo "$falhas falha(s)"; exit 1; }
