export const mainNav = [
  { href: '/solucoes', label: 'Soluções' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/comparativo', label: 'Comparativo' },
  { href: '/consultoria', label: 'Consultoria' },
  { href: '/conteudos', label: 'Conteúdos' },
  { href: '/sobre', label: 'Sobre a UPAR' },
] as const

export const footerNav = [
  {
    title: 'Soluções',
    links: [
      { href: '/solucoes/llms-locais', label: 'LLMs locais' },
      { href: '/solucoes/machine-learning', label: 'Machine learning' },
      { href: '/solucoes/deep-learning', label: 'Deep learning' },
      { href: '/solucoes/ciencia-de-dados', label: 'Ciência de dados' },
      { href: '/solucoes/geracao-de-imagens', label: 'Geração de imagens' },
      { href: '/solucoes/geracao-de-video', label: 'Geração de vídeo' },
      { href: '/solucoes', label: 'Ver todas as aplicações' },
    ],
  },
  {
    title: 'Computadores',
    links: [
      { href: '/catalogo', label: 'Catálogo completo' },
      { href: '/catalogo?formFactor=workstation', label: 'Workstations' },
      { href: '/catalogo?formFactor=desktop', label: 'Desktops' },
      { href: '/catalogo?formFactor=server', label: 'Servidores' },
      { href: '/comparativo', label: 'Comparativo' },
      { href: '/encontre-sua-configuracao', label: 'Encontre sua configuração' },
    ],
  },
  {
    title: 'A UPAR',
    links: [
      { href: '/sobre', label: 'Sobre a empresa' },
      { href: '/consultoria', label: 'Como funciona a consultoria' },
      { href: '/conteudos', label: 'Guias e comparativos' },
      { href: '/contato', label: 'Contato' },
    ],
  },
  {
    title: 'Institucional',
    links: [
      { href: '/garantia', label: 'Política de Garantia' },
      { href: '/politica-de-privacidade', label: 'Política de Privacidade' },
      { href: '/termos-de-uso', label: 'Termos de Uso' },
      { href: '/admin/login', label: 'Acesso administrativo' },
    ],
  },
] as const
