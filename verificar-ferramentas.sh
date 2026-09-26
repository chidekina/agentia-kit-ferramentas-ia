#!/usr/bin/env bash
# Mostra quais ferramentas da aula estão na sua máquina. Não instala nada.
# Obrigatórias: sem elas os exemplos não rodam. Opcionais: a aula mostra, você escolhe.
set -u

cor() { [ -n "${NO_COLOR:-}" ] && printf '%s' "$2" || printf '\033[%sm%s\033[0m' "$1" "$2"; }
faltam=0

checar() { # checar <obrigatoria|opcional> <comando> <para que serve>
  if command -v "$2" >/dev/null 2>&1; then
    v=$("$2" --version 2>/dev/null | head -1 | cut -c1-40)
    printf '  %s %-10s %s\n' "$(cor 32 ok)" "$2" "${v:-instalado}"
  elif [ "$1" = obrigatoria ]; then
    printf '  %s %-10s %s\n' "$(cor 31 FALTA)" "$2" "$3"
    faltam=$((faltam + 1))
  else
    printf '  %s %-10s %s\n' "$(cor 33 --)" "$2" "$3"
  fi
}

echo "Obrigatórias"
checar obrigatoria git  "controle de versão"
checar obrigatoria node "roda os exemplos (precisa 24+)"
checar obrigatoria npm  "instala dependências"
checar obrigatoria jq   "o hook de exemplo lê JSON com ele"

echo "Agentes de código (pelo menos um)"
checar opcional claude   "Claude Code — o que a gente usa (pago)"
checar opcional gemini   "Gemini CLI — camada gratuita com login Google"
checar opcional opencode "OpenCode — open source, escolhe o provedor"
checar opcional codex    "Codex CLI — da OpenAI (plano ChatGPT)"

echo "Modelo local e utilitários"
checar opcional ollama "modelo local, offline e grátis"
checar opcional gh     "GitHub pela linha de comando"
checar opcional uv     "Python rápido (instala ferramentas como o Spec Kit)"
checar opcional docker "containers"

if command -v node >/dev/null 2>&1; then
  maior=$(node -p 'process.versions.node.split(".")[0]')
  if [ "$maior" -lt 24 ]; then
    echo "$(cor 31 FALTA) node $maior encontrado; os exemplos precisam de 24+"
    faltam=$((faltam + 1))
  fi
fi

if [ "$faltam" -eq 0 ]; then echo "Pronto: nada obrigatório faltando."; exit 0; fi
echo "$faltam obrigatória(s) faltando."; exit 1
