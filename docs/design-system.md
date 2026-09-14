# Design system — UPAR AI

Fonte única: `src/styles/globals.css`. Tudo consome tokens; nenhum componente usa
cor literal fora do arquivo de tema.

## Cores

> As cores de marca são **provisórias**. Substituir o bloco `MARCA` em
> `globals.css` aplica a identidade real em todo o site de uma vez.

| Grupo | Uso |
| --- | --- |
| `brand-50…900` | Cor primária. Ações, links, destaques e selos |
| `flux-300…600` | Acento de dados e IA. Ênfases técnicas (VRAM), ícones e microtextos |
| `neural-400…600` | Acento secundário, uso pontual |
| `ink-50…950` | Neutros. `ink-950` é o fundo base; `ink-50` é a superfície clara |
| `positive`, `caution`, `critical` | Estados semânticos e marcação de conteúdo demonstrativo |

**Contraste:** texto corrido usa `ink-100`/`ink-200` sobre `ink-950`/`ink-880`;
`ink-300` fica reservado a apoio e `ink-400`/`ink-500` a legendas curtas. As seções
claras (`.surface-light`) invertem a escala para manter a leitura confortável.

## Tipografia

- **Sora** nos títulos (`--font-display`), com `letter-spacing: -0.022em` e `text-wrap: balance`.
- **Inter** no texto (`--font-sans`), com `text-wrap: pretty` nos parágrafos.
- Escala fluida por seção; o passo `text-2xs` (0.6875rem) cobre selos e legendas.

## Superfícies e profundidade

- `panel` — cartão translúcido com desfoque para sobreposições.
- `grid-mesh` — malha sutil que remete a processamento e dados, sempre com máscara radial.
- `shadow-soft` / `shadow-lift` / `shadow-glow` — três níveis de elevação, nada além disso.
- Gradientes radiais de marca como “luz” atrás do conteúdo, nunca sobre o texto.

## Movimento

Animações são funcionais, não decorativas: entrada suave (`animate-rise`),
pulsação lenta nos brilhos de fundo, transições de 200–300 ms nos controles.
Tudo é suprimido sob `prefers-reduced-motion: reduce`.

## Componentes

- **Primitivos** (`src/components/ui/`): `Button`/`ButtonLink`, `Badge`, `Section`,
  `SectionHeader`, `Field`/`Input`/`Select`/`Textarea`/`Checkbox`, `Accordion`,
  `Icon`, `DemoNotice`.
- **Ilustrações** (`MachineRender`): seis variações vetoriais — torre com painel de
  vidro, torre em malha, servidor 2U, desktop compacto, placa de vídeo e placa-mãe.
  O número de placas desenhadas acompanha a configuração cadastrada.
- **Ícones**: conjunto SVG próprio com traço 1,6 px, sem biblioteca externa.

## Acessibilidade

- Foco visível uniforme (`:focus-visible` com anel em `flux-400`) em todo o site.
- Atalho “Ir para o conteúdo” como primeiro elemento focável.
- Um `h1` por página e hierarquia de títulos sem saltos.
- Todo controle tem nome acessível; todo campo tem rótulo associado.
- Tabelas com `caption`, `scope` e cabeçalhos de linha.
- Estados de seleção comunicados por `aria-pressed` e `aria-current`.

## Responsividade

Ponto de partida em 360 px. Grades passam a uma coluna, a barra de filtros vira
painel lateral, tabelas ganham versão em cartões (comparativo de categorias) ou
rolagem horizontal contida (comparador e ficha técnica). O rodapé de cada card usa
**container query**, adaptando-se à largura do próprio card e não à da tela.
Verificado sem rolagem horizontal em 360, 390, 768, 1024 e 1440 px.
