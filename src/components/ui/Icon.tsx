import type { SVGProps } from 'react'

export type IconName =
  | 'whatsapp' | 'arrowRight' | 'arrowLeft' | 'chevronDown' | 'chevronRight' | 'check' | 'close'
  | 'cpu' | 'gpu' | 'memory' | 'storage' | 'cooling' | 'power' | 'network' | 'upgrade'
  | 'sliders' | 'compare' | 'spark' | 'shield' | 'users' | 'search' | 'menu' | 'plus' | 'minus'
  | 'download' | 'external' | 'mail' | 'phone' | 'pin' | 'clock' | 'info' | 'layers' | 'chart'
  | 'brain' | 'image' | 'video' | 'eye' | 'code' | 'server' | 'flask' | 'cube' | 'bolt' | 'quote'
  | 'lock' | 'logout' | 'edit' | 'trash' | 'copy' | 'star'
  | 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'card' | 'pix'

const paths: Record<IconName, React.ReactNode> = {
  whatsapp: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.82c2.16 0 4.19.84 5.72 2.37a8.05 8.05 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.09 8.09a8.2 8.2 0 0 1-4.13-1.13l-.3-.18-3.07.81.82-3-.19-.31a8.07 8.07 0 0 1-1.24-4.29c0-4.46 3.63-8.08 8.11-8.08Zm-3.2 4.1c-.15 0-.4.06-.61.28-.21.22-.8.79-.8 1.92s.82 2.23.94 2.38c.12.16 1.6 2.44 3.87 3.42.54.23.96.37 1.29.48.54.17 1.04.15 1.43.09.44-.07 1.34-.55 1.53-1.08.19-.53.19-.98.13-1.08-.06-.09-.21-.15-.44-.26-.23-.12-1.34-.66-1.55-.74-.21-.08-.36-.11-.5.11-.15.22-.58.74-.71.89-.13.15-.26.17-.49.06-.23-.12-.96-.36-1.83-1.13-.68-.6-1.13-1.35-1.27-1.57-.13-.23-.01-.35.1-.46.1-.1.23-.27.34-.4.11-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.5-1.23-.69-1.68-.18-.44-.37-.38-.5-.39-.13 0-.28-.01-.43-.01Z"
    />
  ),
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  arrowLeft: <path d="M19 12H5m6 6-6-6 6-6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  check: <path d="M20 6 9 17l-5-5" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  cpu: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M9 1.8v1.7M15 1.8v1.7M9 20.5v1.7M15 20.5v1.7M22.2 9h-1.7M22.2 15h-1.7M3.5 9H1.8M3.5 15H1.8" />
    </>
  ),
  gpu: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="8.5" cy="12" r="2.6" />
      <circle cx="16" cy="12" r="2.6" />
      <path d="M2 18v3" />
    </>
  ),
  memory: (
    <>
      <rect x="2.5" y="7" width="19" height="10" rx="1.5" />
      <path d="M6 17v2.5M10 17v2.5M14 17v2.5M18 17v2.5M6.5 10.5h3M14.5 10.5h3" />
    </>
  ),
  storage: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </>
  ),
  cooling: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 10V4.5M12 14v5.5M14 12h5.5M10 12H4.5" />
    </>
  ),
  power: (
    <>
      <rect x="2" y="7" width="20" height="11" rx="2" />
      <circle cx="8" cy="12.5" r="2.5" />
      <path d="M14 10h5M14 14h5" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="19" r="2.5" />
      <circle cx="19" cy="19" r="2.5" />
      <path d="M12 7.5v4m0 0-5 5m5-5 5 5" />
    </>
  ),
  upgrade: <path d="M12 20V7m0 0-5 5m5-5 5 5M5 4h14" />,
  sliders: <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2M14 4v4M8 10v4M14 16v4" />,
  compare: (
    <>
      <path d="M12 3v18" />
      <path d="M6 8 2.5 14h7L6 8ZM18 8l-3.5 6h7L18 8Z" />
      <path d="M4 20h6M14 20h6" />
    </>
  ),
  spark: <path d="M12 3v4m0 10v4M3 12h4m10 0h4M6.3 6.3l2.5 2.5m6.4 6.4 2.5 2.5m0-11.4-2.5 2.5m-6.4 6.4-2.5 2.5" />,
  shield: <path d="M12 2.5 4.5 5.5v6c0 4.6 3.1 8.8 7.5 10 4.4-1.2 7.5-5.4 7.5-10v-6L12 2.5Z" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.3a3.2 3.2 0 0 1 0 5.4M17.5 14.6A6.5 6.5 0 0 1 21.5 20" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  download: <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 19h16" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  phone: <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />,
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8v.4" />
    </>
  ),
  layers: <path d="m12 3 9 5-9 5-9-5 9-5Zm9 11-9 5-9-5m18-3.5-9 5-9-5" />,
  chart: <path d="M4 20V10m5 10V4m5 16v-7m5 7V8" />,
  brain: (
    <>
      <path d="M12 5.5a3 3 0 0 0-5.8-1A2.8 2.8 0 0 0 4 7.2a3 3 0 0 0-.2 5.3A3 3 0 0 0 5.6 17a3 3 0 0 0 6.4.4Z" />
      <path d="M12 5.5a3 3 0 0 1 5.8-1A2.8 2.8 0 0 1 20 7.2a3 3 0 0 1 .2 5.3A3 3 0 0 1 18.4 17a3 3 0 0 1-6.4.4Z" />
      <path d="M12 5.5v13" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <circle cx="8.5" cy="10" r="1.8" />
      <path d="m3.5 17 5-4.5 4 3.5 3-2.5 5 4" />
    </>
  ),
  video: (
    <>
      <rect x="2.5" y="6" width="13" height="12" rx="2" />
      <path d="m15.5 10.5 6-3v9l-6-3z" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  code: <path d="m8.5 8-4.5 4 4.5 4M15.5 8l4.5 4-4.5 4M13.5 5l-3 14" />,
  server: (
    <>
      <rect x="2.5" y="3.5" width="19" height="7" rx="2" />
      <rect x="2.5" y="13.5" width="19" height="7" rx="2" />
      <path d="M6.5 7h.01M6.5 17h.01M10.5 7h5M10.5 17h5" />
    </>
  ),
  flask: <path d="M9.5 3v6.2L4.3 18a2 2 0 0 0 1.7 3h12a2 2 0 0 0 1.7-3l-5.2-8.8V3M8 3h8M7 14h10" />,
  cube: <path d="m12 2.8 8.5 4.6v9.2L12 21.2 3.5 16.6V7.4L12 2.8Zm0 0v18.4M3.5 7.4 12 12l8.5-4.6" />,
  bolt: <path d="M13.5 2 4 13.5h6.5L9.5 22 20 10.5h-6.5L13.5 2Z" />,
  quote: <path d="M9.5 6C6.5 7.5 5 10 5 13v5h6v-6H8c0-2 .6-3.4 2.4-4.4L9.5 6Zm9 0c-3 1.5-4.5 4-4.5 7v5h6v-6h-3c0-2 .6-3.4 2.4-4.4L18.5 6Z" />,
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  logout: <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4 4 4M6 12h11" />,
  edit: <path d="M4 20h4.5L20 8.5a2.1 2.1 0 0 0-3-3L5.5 17V20ZM14.5 6.5l3 3" />,
  trash: <path d="M4 7h16M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M6.5 7l.8 12a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9l.8-12" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
      <path d="M5 15.5A2 2 0 0 1 3.5 13.6V5.5a2 2 0 0 1 2-2h8.1A2 2 0 0 1 15.5 5" />
    </>
  ),
  star: <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z" />,
  facebook: <path d="M14 8.5V6.8c0-.8.5-1.3 1.3-1.3H17V2.5h-2.6C11.9 2.5 10.5 4 10.5 6.4v2.1H8V12h2.5v9.5H14V12h2.6l.4-3.5H14Z" fill="currentColor" stroke="none" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <path d="M4.5 9.5h3.2V20H4.5zM6.1 4a1.85 1.85 0 1 1 0 3.7 1.85 1.85 0 0 1 0-3.7Z" fill="currentColor" stroke="none" />
      <path d="M10 9.5h3v1.5c.5-.9 1.7-1.8 3.4-1.8 3.3 0 3.9 2.2 3.9 5V20h-3.2v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V20H10z" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8Z" />
      <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
      <path d="M2.5 10h19M6.5 14.5h4" />
    </>
  ),
  pix: <path d="m12 3.2 3.4 3.4h1.2a2.8 2.8 0 0 1 2 .8l2.2 2.2a3.4 3.4 0 0 1 0 4.8l-2.2 2.2a2.8 2.8 0 0 1-2 .8h-1.2L12 20.8l-3.4-3.4H7.4a2.8 2.8 0 0 1-2-.8l-2.2-2.2a3.4 3.4 0 0 1 0-4.8l2.2-2.2a2.8 2.8 0 0 1 2-.8h1.2L12 3.2Zm0 3.6L9.9 8.9a2.6 2.6 0 0 0 0 3.7l2.1 2.1 2.1-2.1a2.6 2.6 0 0 0 0-3.7L12 6.8Z" />,
}

const filled: IconName[] = ['whatsapp']

export function Icon({
  name,
  className,
  ...props
}: { name: IconName; className?: string } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
  const isFilled = filled.includes(name)
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={isFilled ? 'none' : 'currentColor'}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
