# 01 — O nosso workflow

Como a gente trabalha com IA no dia a dia, de ponta a ponta. Não é teoria: é o que roda nos ~170
repositórios da nossa pasta de projetos (medido em 2026-09-25).

## A ideia central

> **O agente escreve; o processo decide se entra.**

O modelo erra com confiança — código que compila e está semanticamente errado. Então o valor não
está em "gerar mais rápido", está nos **portões** que o código gerado precisa atravessar antes de
chegar em produção. Cada etapa abaixo tem um portão.

## O ciclo

```
 ideia ──► ESPECIFICAR ──► PLANEJAR ──► TESTE QUE FALHA ──► IMPLEMENTAR ──► REVISAR ──► VERIFICAR ──► ENTREGAR
            (o quê)        (como)        (vermelho)          (verde)        (outro olho)  (de verdade)   (PR → CI → deploy)
```

| etapa | o que acontece | ferramenta que a gente usa | portão |
|---|---|---|---|
| Especificar | intenção + restrições + "pronto quando" escritos ANTES da IA ver o problema | GSD `discuss-phase` / `spec-phase` | spec aprovada pelo humano |
| Planejar | plano com tarefas, dependências e critério de verificação | GSD `plan-phase` + agente `plan-checker` | o checker reprova plano fraco |
| Teste que falha | o teste nasce vermelho, e a IA vê **só o teste** | Vitest / pytest | vermelho pelo motivo certo |
| Implementar | o mínimo que faz o teste passar, commit pequeno | Claude Code, subagentes `executor` em ondas | suíte verde |
| Revisar | outro revisor, nunca a própria IA que escreveu | `/code-review`, `/impact` (raio de impacto) | achado crítico bloqueia |
| Verificar | o objetivo foi atingido? (não "as tarefas foram feitas?") | agente `verifier`, teste manual (UAT) | relatório de verificação |
| Entregar | branch → PR → `develop` → `main` | GitHub Actions, Dokploy / Vercel | CI verde + smoke em produção |

**GSD** ("get-shit-done") é o framework de orquestração que a gente usa em cima do Claude Code:
um conjunto de skills e subagentes que guarda estado em `.planning/` (roadmap, fases, planos,
resumos). Qualquer um desses passos dá para fazer na mão — o GSD só impede de pular.

## As guardas que rodam sozinhas

Instrução em prosa o modelo pode ignorar. Por isso a gente põe regra em **máquina**:

- **Hooks do Claude Code** (131 registrados na nossa máquina): bloqueiam commit direto em `main`,
  exigem teste antes do arquivo de código, injetam as regras de arquitetura na primeira edição.
- **`CONTRACT.md` com seção `## validation`**: padrões que o pre-commit reprova (ex.: URL de banco
  com senha no código).
- **ESLint de fronteira**: camada de rota não importa banco direto.
- **CI obrigatório no PR**: typecheck + testes + build. Deploy automático sem CI é proibido.

## Memória do projeto

- `AGENTS.md` / `CLAUDE.md` na raiz: comandos, regras, armadilhas. Temos **64** `AGENTS.md` e
  **119** `CLAUDE.md` espalhados.
- Achado novo ("na verdade o comando é X") vai para o arquivo do repo **no mesmo dia** — memória só
  na cabeça (ou só no chat) some.

## Regras de bolso

1. Sessão nova para tarefa nova. Contexto velho envenena a resposta nova.
2. Commit antes de cada pedido grande à IA — fica fácil desfazer.
3. Nunca peça à IA para revisar o próprio código.
4. "Funcionou" = passou no MESMO teste + build que a produção roda.
