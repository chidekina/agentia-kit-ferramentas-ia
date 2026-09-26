---
name: revisar-diff
description: Revisa o diff atual (git) procurando bug, segredo vazado e teste faltando, e responde em PT-BR com achados por severidade. Use quando o aluno pedir "revisa meu código", "revisar diff" ou antes de um commit.
allowed-tools: Bash(git diff *) Bash(git status *) Read Grep
---

# Revisar diff

1. Rode `git status --short` e `git diff HEAD`. Diff vazio → diga isso e pare.
2. Para cada arquivo alterado, procure, nesta ordem:
   - **Segredo**: chave, token, senha, URL com credencial. Achou → severidade ALTA, sempre.
   - **Bug**: condição invertida, erro engolido (`catch {}` vazio), `await` faltando.
   - **Teste**: código novo em `src/` sem teste correspondente.
3. Responda neste formato, uma linha por achado:
   `arquivo:linha — [ALTA|MÉDIA|BAIXA] problema. conserto.`
4. Nada achado → "Sem achados." Não invente achado para parecer útil.

Não edite arquivo nenhum. Esta skill só lê.
