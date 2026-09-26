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

| evento | quantos | exemplos |
|---|---|---|
| `SessionStart` | 21 | estado do projeto, smoke test do próprio harness (292 casos) |
| `UserPromptSubmit` | 12 | injeta a regra de roteamento de ferramenta |
| `PreToolUse` | 46 | gate de TDD, `cwd-guard`, lições relevantes, regras de arquitetura, roteador de modelo |
| `PostToolUse` | 25 | nomenclatura BDD de teste |
| `Stop` / `SubagentStop` | 16 / 4 | custo da sessão, mutação, revisão depois de subagente |

### 4. O agente que aprende com o erro

1. **Registra** — erro que se repete vira entrada em `lessons.md` (69 lições).
2. **Injeta** — antes de cada comando, as lições relevantes para aquele comando entram no contexto
   (busca por embedding; o Jev julga a relevância). ~127 mil injeções registradas.
3. **Promove** — lição que o modelo ignora vira hook que bloqueia. O `cwd-guard` nasceu de 376
   repetições do mesmo erro.
4. **Mede** — todo evento vai para um log (~393 mil). Antes de instalar algo novo, olha-se o que é
   usado de verdade.

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
