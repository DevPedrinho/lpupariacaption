import type { IconName } from '@/components/ui/Icon'
import type { Capability } from './auth'

export type NavItem = { href: string; label: string; icon: IconName; capability: Capability }

/**
 * Definido fora do módulo cliente: valores exportados de um arquivo 'use client'
 * viram referências opacas no servidor e não podem ser percorridos.
 */
export const ADMIN_NAV: NavItem[] = [
  { href: '/admin', label: 'Visão geral', icon: 'chart', capability: 'dashboard' },
  { href: '/admin/leads', label: 'Leads', icon: 'users', capability: 'leads' },
  { href: '/admin/produtos', label: 'Produtos', icon: 'cpu', capability: 'produtos' },
  { href: '/admin/conteudos', label: 'Conteúdos', icon: 'edit', capability: 'conteudos' },
  { href: '/admin/configuracoes', label: 'Configurações', icon: 'sliders', capability: 'configuracoes' },
  { href: '/admin/usuarios', label: 'Usuários', icon: 'lock', capability: 'usuarios' },
  { href: '/admin/registros', label: 'Registros', icon: 'clock', capability: 'logs' },
]
