# Briefing para o gestor de tráfego: Google Ads da UPAR AI

Documento de trabalho. O que o site já entrega, o que o gestor configura e como o ciclo semanal funciona.

## Decisões que orientam a campanha

- Meta: conversas iniciadas no WhatsApp e leads pelo formulário do site.
- Verba: R$ 1.500 por mês, por 3 meses. Cerca de R$ 50 por dia.
- Região inicial: Fortaleza e Nordeste. Restante do Brasil só no mês 2, se o custo por conversa estiver bom.
- Público: empresas primeiro, universidades e pesquisa em segundo, autônomos por último.
- Ciclo de venda: 1 a 4 semanas. Janela de atribuição de 30 dias.
- Ligação telefônica e CRM ficam fora nesta fase.
- Domínio: upartechai.com.br. Anúncio só sobe com o domínio no ar.

## O que o site já entrega

| Item | Como está |
| --- | --- |
| Consent Mode v2 | Tags do Google carregam em modo anônimo e só usam cookies após o aceite no banner. Modelagem de conversão habilitada. |
| Eventos | `whatsapp_click` (origem e página), `generate_lead`, `view_item`, `diagnostic_complete`, `compare_products`. Marcar `whatsapp_click` e `generate_lead` como eventos principais no GA4. |
| Conversões do Ads | O site dispara `conversion` com `send_to` para dois rótulos, cadastrados em Admin → Configurações: clique no WhatsApp e lead do formulário. |
| UTM e gclid | Gravados no lead e enviados junto com cada evento. A mensagem do WhatsApp inclui a campanha de origem. |
| Conversão offline | Admin → Leads → "Conversões para o Ads" exporta as vendas concluídas com gclid no formato de importação do Google Ads. Nome da ação: **Venda fechada**. Fuso: America/Fortaleza. |
| Páginas de destino | `/lp/empresas`, `/lp/universidades`, `/lp/fortaleza`. Sem menu, com WhatsApp e formulário curto. Textos editáveis em Admin → Páginas de destino. |
| Imagem de compartilhamento | Gerada por página, para prévia no WhatsApp. |

## O que o gestor configura

1. **Ações de conversão** (Ads → Metas → Conversões):
   - "Clique no WhatsApp": site, categoria Contato, contagem uma por clique, principal. Copiar o rótulo para o painel do site.
   - "Lead do formulário": site, categoria Envio de formulário de lead, contagem uma, principal. Copiar o rótulo para o painel.
   - "Venda fechada": importação de cliques de conversão, categoria Compra, valor definido na importação, secundária no início. Passa a principal quando houver 15 ou mais vendas importadas.
2. **Vincular** GA4 e Google Ads. Importar os eventos `whatsapp_click` e `generate_lead` como referência cruzada, sem duplicar a contagem (a conversão principal é a do site).
3. **Lista de clientes** e remarketing ficam para o mês 2.

## Estrutura da campanha

Uma campanha de Pesquisa, R$ 50 por dia, Fortaleza e Nordeste, idioma português, rede de pesquisa apenas (sem parceiros de pesquisa, sem Display).

### Grupo 1: termos de IA → /lp/empresas

Correspondência exata e de frase:

- workstation para ia
- workstation para inteligencia artificial
- computador para rodar ia local
- computador para inteligencia artificial
- pc para deep learning
- pc para machine learning
- computador para rodar llm
- workstation gpu

### Grupo 2: públicos parecidos → /lp/empresas

- workstation para renderização
- pc para render 3d
- workstation para arquitetura
- computador para edição de vídeo 4k
- workstation para cad
- computador para simulação cfd
- computador para ciência de dados

### Grupo 3: universidades e pesquisa → /lp/universidades

- workstation para pesquisa
- computador para laboratório de pesquisa
- servidor gpu para universidade
- estação de trabalho para pesquisa ia
- computador para deep learning universidade

### Grupo 4: Fortaleza → /lp/fortaleza

Todos os termos dos grupos 1 e 2 com "fortaleza" e "ceará", mais:

- montagem de pc fortaleza
- workstation fortaleza
- computador de alta performance fortaleza

### Grupo 5: teste de marca (R$ 5 por dia, separado)

- razor workstation
- razor computadores

Se a Razor confirmar o encerramento das operações, o termo fica. Se voltar a operar, pausar.

### Negativas desde o primeiro dia

gamer, barato, usado, notebook, curso, o que é, como fazer, grátis, download, aluguel, monitor, console, celular, tablet, emprego, vaga, salário, mineração

Revisar o relatório de termos de pesquisa toda semana e acrescentar.

## Lances e orçamento

- Semanas 1 e 2: maximizar cliques com CPC máximo de R$ 6. Objetivo é volume e aprender quais termos convertem.
- A partir da semana 3: maximizar conversões, sem CPA alvo até ter 30 conversões.
- Ajuste de lance por dispositivo só depois de 2 semanas de dados.
- Programação: sem restrição de horário no início. Revisar depois de 30 dias.

## Anúncios

Cinco títulos e quatro descrições por grupo, com as vantagens reais. Nada de número que a UPAR não tenha medido, nada de "melhor", "mais rápido" ou prazo de entrega.

Argumentos disponíveis: consultoria técnica gratuita; em até 21x sem juros no cartão; garantia de 12 a 60 meses conforme o produto; montagem e testes pela equipe UPAR; recompra dos itens no upgrade; preventiva gratuita de 1 a 5 anos para clientes de Fortaleza (só no grupo 4).

### Grupo 1 e 2 (empresas)

Títulos: "Workstation para IA sob medida" · "Consultoria técnica gratuita" · "Em até 21x sem juros" · "Montada e testada pela UPAR" · "Garantia de 12 a 60 meses"

Descrições: "Diga quais modelos e programas você usa. A UPAR dimensiona, monta e testa a configuração." · "Recompra dos itens quando você fizer upgrade. Consultoria gratuita antes da proposta." · "Workstations para IA, render e simulação. Atendimento em todo o Brasil." · "Fale com um especialista pelo WhatsApp e receba a configuração na medida."

### Grupo 3 (universidades)

Títulos: "Workstation para pesquisa em IA" · "Especificação para licitação" · "Memória ECC e expansão" · "Consultoria técnica gratuita" · "Garantia de 12 a 60 meses"

Descrições: "Documentação técnica para o processo de compra institucional. Equipe que dimensiona, monta e atende." · "Plataformas com memória ECC e espaço para mais placas de vídeo." · "Atendemos universidades, institutos e órgãos públicos em todo o Brasil." · "Peça a especificação técnica pelo WhatsApp ou pelo formulário."

### Grupo 4 (Fortaleza)

Títulos: "Workstation para IA em Fortaleza" · "Preventiva gratuita de 1 a 5 anos" · "Loja física e equipe técnica" · "Em até 21x sem juros" · "Consultoria técnica gratuita"

Descrições: "Computador para IA montado em Fortaleza, com manutenção preventiva gratuita para clientes da cidade." · "Visite a loja ou fale pelo WhatsApp. Consultoria gratuita antes da proposta." · "Garantia de 12 a 60 meses e recompra dos itens no upgrade." · "Montagem e testes pela equipe UPAR, a poucos minutos de você."

Extensões: sitelinks (Catálogo, Encontre sua configuração, Consultoria, Garantia), frases de destaque (as vantagens acima), snippet estruturado (Tipos: Workstation, Desktop, Servidor), local (Google Business Profile da loja).

## Ciclo semanal

1. Relatório de termos de pesquisa: negativar o que não é compra.
2. Redistribuir a verba entre grupos pelo custo por conversa.
3. Baixar "Conversões para o Ads" no painel do site e importar em Metas → Conversões → Importações.
4. Registrar em uma linha: gasto, cliques, conversas, leads, vendas importadas, custo por conversa.

## O que não fazer

- Não apontar anúncio para a home enquanto a seção de depoimentos demonstrativos estiver ligada (chave em Admin → Configurações).
- Não usar Performance Max ou Display nesta fase: verba pequena e pouco dado de conversão.
- Não prometer prazo de entrega, número de clientes ou desempenho em tokens por segundo.
