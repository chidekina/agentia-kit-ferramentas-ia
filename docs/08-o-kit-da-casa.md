# 08 — O kit da casa, e como a gente orquestra agentes

As peças que a gente montou ou adotou em cima do Claude Code, cada uma com o problema que
resolve e o **uso medido** em 2026-09-25 — inclusive quando o número é ruim.

## Como a orquestração funciona

### 1. A memória mora em arquivo

```
.planning/
  PROJECT.md         o que é, para quem, restrições
  REQUIREMENTS.md    requisitos com ID
  ROADMAP.md         milestones → fases, com critério de sucesso
  STATE.md           onde paramos (lido no início de toda sessão)
  phases/157-.../
    CONTEXT.md           decisões do discuss
    157-01-PLAN.md       tarefas + como verificar + arquivos que toca
    157-01-SUMMARY.md    o que o executor fez (existe = plano feito)
    157-REVIEW.md        achados da revisão
    157-VERIFICATION.md  o objetivo foi atingido?
```

A sessão acaba, o contexto compacta, o subagente nasce sem memória. **O disco é a memória.**

### 2. Um orquestrador enxuto, agentes especialistas

```
discuss-phase   humano + agente → CONTEXT.md
plan-phase      researcher + pattern-mapper (pesquisa, padrões do código)
                planner ↔ plan-checker (até 3 voltas de revisão)
execute-phase   orquestrador agrupa os planos em ONDAS pelas dependências
                onda 1: executor A | executor B | executor C  (em paralelo)
                onda 2: executor D (lê os SUMMARY da onda 1)
code-review → verifier → UAT → PR → CI → deploy
```

O orquestrador **coordena, não executa**. Cada executor roda numa *worktree* isolada do git, faz
commit atômico e escreve o `SUMMARY.md`. Uso medido: `gsd-executor` 1.071, `planner` 344,
`plan-checker` 342, `verifier` 225.

### 3. Hooks em cada instante

Um hook é um script que o Claude Code roda sozinho num momento fixo. Ele recebe um JSON com o que
está acontecendo (ferramenta, arquivo, comando) e pode **injetar texto** no contexto do modelo,
**bloquear** a ação (exit 2 — a mensagem volta ao modelo como explicação) ou só **registrar**.
A diferença para uma linha no `AGENTS.md`: a linha o modelo pode ignorar; o hook, não.

| evento | quantos | para quê | exemplos da casa |
|---|---|---|---|
| `SessionStart` | 21 | orientar e conferir que o ambiente está são | estado do projeto (`STATE.md`); smoke test dos próprios hooks resumido em **uma** linha; aviso de MCP configurado mas morto |
| `UserPromptSubmit` | 12 | pôr contexto do momento em cada mensagem | regra de qual ferramenta usar primeiro; aviso de que o `HEAD` do git andou com trabalho não commitado |
| `PreToolUse` | 46 | as guardas — antes de cada ação | sem teste, não escreve código (`tdd-guard`); `cd x && cmd` bloqueado (`cwd-guard`); `rm -rf` com variável bloqueado; não edita arquivo que mudou desde a leitura; lições relevantes injetadas; modelo sugerido para cada subagente |
| `PostToolUse` | 25 | conferir o resultado | roda os testes depois de editar e avisa se a cobertura caiu de 80%; nome de teste em formato BDD |
| `Stop` / `SubagentStop` | 16 / 4 | fechar a conta ao fim da resposta | suíte de testes; teste de mutação; custo da sessão; revisão obrigatória depois de subagente de risco alto |
| outros 7 | 1 cada | compactação de contexto, erro de ferramenta, fim de sessão… | `PostToolUseFailure` registra toda falha — é o começo do ciclo de lições |

Hooks que barraram a preparação desta aula: `tdd-guard` (arquivo sem teste), `cwd-guard`
(`cd` encadeado), `bash-safety` (`rm -rf $S/...` que viraria `rm -rf /` com a variável vazia),
`file-lock-check` (arquivo mudado desde a leitura). E o pre-commit do **git** — que não é hook do
Claude Code, roda em qualquer commit — recusou um diff de 1.454 linhas e um `console.log`.

Contra-exemplo, também medido: o aviso de nomenclatura BDD dispara em todo teste escrito em
português (`quando`/`então`), porque procura `when`/`then`. Alerta que dispara sempre vira ruído
que ninguém lê.

### 4. Como um erro vira lição

O modelo **não reconhece o próprio erro**. Quem reconhece é a máquina, pela **repetição**:

```
1 ferramenta falha      PostToolUseFailure -> tool-errors.log      19.945 falhas registradas
2 vira assinatura       troca linha, arquivo, aspas -> hash       3.758 padrões distintos
3 repetiu 3 vezes?      rascunho em pending-lessons.md
4 alguém aprova         /lesson: Erro / Contexto / Regra / Repetições -> lessons.md   (66 lições)
5 indexa                embedding de cada regra, com modelo local (Ollama)            (64 no índice)
6 volta na hora certa   antes de CADA comando, busca as regras parecidas              (77.500 injeções)
7 ignorou de novo?      relatório de promoção -> um humano escreve o hook que bloqueia
```

- **Passo 2** é o que torna erros diferentes "o mesmo": `line 42` vira `line N`, `(3,7)` vira
  `(N,N)`, `src/app.ts` vira `src/FILE.ts` (só o nome do arquivo), texto entre aspas vira `'X'`. Sem isso, cada ocorrência seria única e nada
  repetiria.
- **Passo 4** passa por aprovação. O rascunho só é promovido sozinho quando já repetiu 5 vezes
  **e** tem a regra preenchida; antes disso, alguém lê.
- **Passo 6** nunca bloqueia: similaridade não é motivo para parar um comando. Fora do caminho
  crítico, o Jev julga em lote se a lição injetada era mesmo relevante, e isso calibra a próxima.
- **Passo 7** é só relatório. Escrever o hook é decisão humana. O `cwd-guard` nasceu assim, depois
  de 376 repetições do mesmo erro.

**Onde o ciclo falha (medido):**

- De ~127 mil tentativas de injeção, **29.557 estouraram o prazo** (~23%) e 20.453 ficaram abaixo
  do limiar. Hook no caminho de todo comando precisa ser rápido, senão fica mudo exatamente quando
  mais importa.
- Existe um canal para capturar **correção do usuário** ("está errado", "na verdade", "você
  errou"). Ele funciona com uma correção forjada, mas nunca capturou uma real: gente corrige
  perguntando ("a gente usa todos esses?"), e a regra só casa frase explícita.

### 5. Roteador de modelo

Um hook classifica cada subagente antes de ele nascer: Haiku para buscar (193 decisões), Sonnet
para a maioria (1.047), Opus para planejar e arquitetura (553). Sugere, não bloqueia — e
registra. A escolha de modelo virou dado que dá para auditar. Tarefa sem valor de raciocínio
(mensagem de commit, resumo) vai para o Ollama local: custo zero.

## As peças

| peça | resolve | uso medido |
|---|---|---|
| **GSD** 1.42.3 | agente que pula etapa | ~3.000 invocações; 72 skills, 34 agentes |
| **Ralph** | tarefa longa em laço autônomo | 2 invocações |
| **ponytail** | a IA que escreve código demais | regra do `CLAUDE.md`, em toda sessão |
| **caveman** | resposta prolixa | 210 invocações |
| **Jev** (TypeSafe) | decisão sim/não sem chat | ~7.700 chamadas em 6 dias |

### GSD (get-shit-done)

Framework aberto (`gsd-build/get-shit-done`) de skills e subagentes que guardam estado em
`.planning/`. Ciclo: `/gsd-discuss-phase` → `/gsd-plan-phase` → `/gsd-execute-phase` →
`/gsd-verify-work` → `/gsd-ship`; pausa e retomada com `/gsd-pause-work` e `/gsd-resume-work`.
Funciona porque cada etapa escreve um arquivo e a próxima lê. **Custo:** cerimônia (para ajuste
pequeno existe `/gsd-quick`), e um update do GSD sobrescreve o que você editou dentro dele —
customização mora fora do diretório dele.

### Ralph loop

`prd.json` com histórias marcadas `passes: false`. A cada volta, uma **sessão nova** pega a
próxima história, implementa, testa, commita e marca `passes: true`, até todas passarem (o agente
responde `<promise>COMPLETE</promise>`) ou acabar o limite de voltas. A memória entre voltas é o
`progress.txt`, não a conversa: **contexto zerado a cada volta**, sem apodrecer.

**O que medimos:** 2 invocações, a última em julho; o piloto parou em 15 voltas sem terminar.
**A lição:** autonomia sem spec e sem portão sai cara. O GSD ficou com a boa ideia do Ralph —
contexto novo por tarefa, memória em arquivo — e acrescentou checkpoint humano e verificação.
Origem: `snarktank/ralph`.

### ponytail — pare no primeiro degrau que resolve

1. Precisa existir? Não → não escreva (YAGNI).
2. Já existe no código? Reuse.
3. A biblioteca padrão faz? Use.
4. A plataforma faz? Use (`<input type="date">` antes de instalar um calendário).
5. Uma dependência já instalada resolve? Use.
6. Cabe numa linha? Uma linha.
7. Só então: o mínimo que funciona. Atalho marcado: `// ponytail: <limite> — melhorar quando <condição>`.

Existe porque a IA erra para o lado do **excesso**. **Nunca** vale para: validação na fronteira,
tratamento de erro que evita perda de dado, segurança, acessibilidade.

### caveman

Plugin (`JuliusBrussee/caveman`) que faz o agente responder telegráfico. O benchmark do próprio
projeto vai de 22% a 87% menos token de saída, conforme a tarefa; `/caveman:compress` reescreve
arquivo de memória e corta ~46% de entrada. **Custo:** commit, PR e texto para cliente saem em
linguagem normal; aviso de segurança e passo irreversível voltam ao normal sozinhos. (Os
percentuais são do autor do plugin, não medição nossa.)

### Jev (TypeSafe) — nem toda IA precisa ser um chat

Modelo que devolve **julgamento tipado com probabilidade** em vez de texto. A gente usa em dois
hooks: "este prompt pede trabalho?" e "esta lição é relevante para este comando?" — ~7.700
chamadas, 96% com sucesso. As guardas: scanner de segredo **antes** de enviar (sem scanner, nada
sai), prazo curto, fallback para a heurística antiga, e o prompt nunca vai para o log.

**A ideia que transfere:** pergunta de classificar ou decidir → modelo pequeno e tipado é mais
barato, rápido e testável do que pedir texto a um LLM e fazer parse.

## O resto do ambiente

| peça | o que é | a ideia que transfere |
|---|---|---|
| superpowers | plugin: brainstorming, TDD, depuração sistemática, verificação antes de concluir | instale metodologia madura em vez de escrever a sua |
| Trail of Bits | plugin de segurança: revisão diferencial, semgrep, CodeQL | segurança como skill, não checklist na cabeça |
| Serena | MCP de navegação por símbolo (LSP) | achar a função sem ler o arquivo inteiro |
| ARIA | assistente próprio: MCP, painel, cron, Ollama para briefing | rotina automatizada fora do chat, com modelo local barato |
| nick-nope | skill que confere o diff contra as lições | revise contra os *seus* erros antigos |
| pre-commit global | 16 checagens em todos os repositórios | a última rede não depende da IA |
