# 07 — Dicas e armadilhas (as que custaram caro para a gente)

## Contexto é o recurso escasso

1. **Sessão nova para tarefa nova.** Contexto de uma tarefa velha piora a resposta da nova, sem
   avisar.
2. **Subagente para ler muito.** Pesquisa e varredura em subagente: ele lê 50 arquivos e te devolve
   10 linhas.
3. **Spec antes do problema.** Escreva intenção + restrições + "pronto quando" ANTES de mostrar o
   problema à IA. Se ela propõe primeiro, você ancora na proposta dela.
4. **`AGENTS.md` curto e acionável.** Comando exato > parágrafo de filosofia.
5. **Cada skill instalada custa token em TODO prompt** (o nome e a descrição). Instale o que usa.

## Desconfie do "funcionou"

6. **IA escreve código que compila e está errado.** Teste primeiro; mostre à IA só o teste; peça o
   mínimo que passa.
7. **Nunca peça à IA para revisar o próprio código.** Outro revisor, outra sessão, ou humano.
8. **O exit 0 prova que o comando rodou, não que o efeito aconteceu.** Depois de deploy, migração
   ou `kill`: leia o estado.
9. **Teste que não falha nunca não testa nada.** Quebre o código de propósito e veja o teste ficar
   vermelho (é o que a gente chama de mutação).
10. **Modelo pequeno, conclusão errada:** rode `npm run agente` no exemplo — a ferramenta conta
    certo, o modelo de 3B escreve a conclusão torta. O dado vem da ferramenta; a prosa, do modelo.
    E ele nem sempre chama a ferramenta: medido em 2026-09-25, **5 de 6 corridas** chamaram. Mesma
    pergunta, resultado diferente — por isso agente se mede com várias corridas (exercício 7).

## Guardas em máquina, não em prosa

11. Regra que importa vira **hook**, **CI** ou **pre-commit**. Instrução em markdown o modelo pode
    ignorar.
12. **Todo agente tem teto** de voltas e de gasto (`isStepCount(5)` no exemplo). Laço sem teto é
    conta sem teto.
13. `main` protegido: só entra por PR com CI verde.

## Segurança

14. Segredo em `.env`, fora do git; `.env.example` com valor de mentira.
15. API gratuita = seus prompts podem virar treino. Nada de dado pessoal ou de cliente.
16. Servidor MCP / plugin / skill de terceiro é **código rodando com seus acessos**. Leia antes.
    Fixe versão.
17. Banco para o agente: usuário só-leitura.
18. Conteúdo que o agente busca (página, issue, e-mail) pode conter instrução maliciosa
    (*prompt injection*).

## Terminal

19. `claude -p "..."` dentro de script; `--output-format json --json-schema` para saída tipada.
20. `git worktree` para dois agentes em paralelo sem um varrer o trabalho do outro.
21. `rg` (ripgrep) e `jq` são as duas ferramentas que o agente mais usa — tenha as duas.
