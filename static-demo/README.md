# static-demo — versão de apresentação

Página única, **sem build e sem servidor**, gerada a partir dos mesmos dados
demonstrativos de `src/data`. Existe para garantir um endereço publicável
mesmo que o build da aplicação Next.js falhe.

## O que tem aqui

- `index.html` — documento completo (HTML, CSS e JS embutidos).
- `upar-data.js` — catálogo comprimido em gzip + base64, reidratado no
  navegador com `DecompressionStream('gzip')`, sem biblioteca externa.

## O que esta versão **não** faz

Ela é uma apresentação navegável (home, catálogo, produto, comparador,
diagnóstico e soluções), não a aplicação real:

- não tem painel administrativo;
- não registra leads;
- não lê nem escreve no Supabase — os dados são os do pacote, congelados no
  momento em que o arquivo foi gerado.

A aplicação completa é a do restante do repositório. Esta pasta é descartável:
pode ser removida assim que o deploy do Next.js estiver de pé.

## Como publicar

Servir os dois arquivos como conteúdo estático. Nenhuma etapa de build,
nenhuma variável de ambiente e nenhuma dependência são necessárias.
