# Exercícios

Do mais curto ao mais longo. Cada um termina num **critério que dá para conferir** — não em "acho
que funcionou".

## Na aula

**1. Ambiente (5 min).** `./verificar-ferramentas.sh` termina com "Pronto". Instale pelo menos UM
agente de código (Claude Code, Gemini CLI ou OpenCode).
*Critério:* exit 0.

**2. O agente roda (10 min).** Rode `npm run agente` em `exemplos/agente-ts`. Na saída aparece a
linha `[ferramenta] contarPalavras(...)`.
*Critério:* a linha `[ferramenta]` aparece. Compare o número da ferramenta com o que o modelo
escreveu — batem? Não apareceu? Rode de novo: com o modelo de 3B, 5 de 6 corridas chamaram a
ferramenta quando medimos. Isso não é bug do exemplo, é o modelo — e é o assunto do exercício 7.

**3. Uma ferramenta nova, com teste antes (20 min).** Adicione ao agente a ferramenta
`inverterTexto`. Ordem obrigatória: teste em `ferramentas.test.ts` → rodar e ver VERMELHO → função
→ VERDE → registrar no `agente.ts`.
*Critério:* `npm test` verde, e se você trocar o corpo da função por `return ''` ele fica vermelho.

**4. Um hook seu (15 min).** Crie um hook que bloqueia `rm -rf` no Bash (matcher `Bash`, o comando
vem em `.tool_input.command`). Escreva o teste no molde de `proteger-env.test.sh` ANTES do hook.
*Critério:* o teste passa, e passa a falhar se você apagar o `exit 2`.

**5. MCP no seu agente (10 min).** `npm install --prefix exemplos/mcp-server-ts`, depois abra o Claude Code (ou outro agente com MCP) nesta pasta, aprove
o servidor `dias` do `.mcp.json` e pergunte "quantos dias faltam para o Natal?".
*Critério:* o agente chama `dias_ate` — não calcula de cabeça.

## Depois da aula

**6. Skill portátil.** Escreva uma skill sua em `.claude/skills/` e rode a MESMA skill em outro
agente (Gemini CLI lê `.gemini/skills` ou `.agents/skills`; `npx skills add` instala em vários).
*Critério:* dois agentes diferentes seguindo o mesmo `SKILL.md`.

**7. Troca de provedor.** Rode o exemplo 2 com Ollama e com Gemini, 5 vezes cada, e anote quantas
vezes cada um chamou a ferramenta.
*Critério:* uma tabelinha com os números. (Isso é um *eval* — a semente dos testes de LLM.)

**8. Seu servidor MCP.** Uma ferramenta útil para VOCÊ (cotação, clima, sua API), com teste pelo
cliente em memória, igual ao `servidor.test.ts`.
*Critério:* `npm test` verde + funcionando no seu agente.
