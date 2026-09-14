import type { ProductImage } from '@/lib/types'
import { cn } from '@/lib/cn'

/* ============================================================================
   Renderizações vetoriais dos equipamentos.
   São ILUSTRAÇÕES TÉCNICAS, usadas enquanto a UPAR não fornece a fotografia
   real dos produtos. Carregam rápido, funcionam em qualquer resolução e não
   simulam um produto fotografado que não existe.
   ========================================================================== */

type Props = {
  variant: ProductImage['render']
  gpuCount?: number
  className?: string
  /** Reduz detalhes em miniaturas. */
  compact?: boolean
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-case`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1A2440" />
        <stop offset="55%" stopColor="#0E1526" />
        <stop offset="100%" stopColor="#080D18" />
      </linearGradient>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#5C7FC4" stopOpacity="0.22" />
        <stop offset="45%" stopColor="#22D8F0" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#1F6BFF" stopOpacity="0.14" />
      </linearGradient>
      <linearGradient id={`${id}-gpu`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#16203A" />
        <stop offset="100%" stopColor="#22314F" />
      </linearGradient>
      <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#1F6BFF" />
        <stop offset="100%" stopColor="#35D8F0" />
      </linearGradient>
      <radialGradient id={`${id}-bloom`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#1F6BFF" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#1F6BFF" stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-soft`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
    </defs>
  )
}

function Fan({ x, y, r, id }: { x: number; y: number; r: number; id: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#0B1120" stroke="#273455" strokeWidth="1.2" />
      <circle cx={x} cy={y} r={r * 0.62} fill="none" stroke={`url(#${id}-accent)`} strokeWidth="1" opacity="0.75" />
      <circle cx={x} cy={y} r={r * 0.2} fill="#273455" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <path
          key={angle}
          d={`M ${x} ${y} L ${x + r * 0.58 * Math.cos((angle * Math.PI) / 180)} ${
            y + r * 0.58 * Math.sin((angle * Math.PI) / 180)
          }`}
          stroke="#3A4A70"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.8"
        />
      ))}
    </g>
  )
}

function Tower({ id, glass, gpuCount, compact }: { id: string; glass: boolean; gpuCount: number; compact: boolean }) {
  const gpus = Math.min(Math.max(gpuCount, 1), 4)
  return (
    <>
      <ellipse cx="210" cy="470" rx="150" ry="26" fill={`url(#${id}-bloom)`} opacity="0.5" />
      {/* Corpo */}
      <rect x="86" y="52" width="248" height="412" rx="18" fill={`url(#${id}-case)`} stroke="#273455" strokeWidth="1.5" />
      {/* Painel frontal */}
      <rect x="86" y="52" width="42" height="412" rx="18" fill="#0A0F1C" />
      {glass ? (
        <>
          <rect x="136" y="66" width="184" height="384" rx="10" fill={`url(#${id}-glass)`} stroke="#3A4A70" strokeWidth="1" />
          <path d="M150 440 L292 80" stroke="#8698B8" strokeWidth="1" opacity="0.12" />
          <path d="M176 446 L318 86" stroke="#8698B8" strokeWidth="1" opacity="0.08" />
        </>
      ) : (
        <g opacity="0.5">
          {Array.from({ length: 18 }).map((_, row) => (
            <line
              key={row}
              x1="140"
              x2="316"
              y1={74 + row * 21}
              y2={74 + row * 21}
              stroke="#273455"
              strokeWidth="1"
            />
          ))}
        </g>
      )}

      {/* Radiador superior */}
      <rect x="146" y="74" width="164" height="30" rx="6" fill="#0B1120" stroke="#273455" strokeWidth="1" />
      {!compact && (
        <>
          <Fan x={175} y={89} r={11} id={id} />
          <Fan x={228} y={89} r={11} id={id} />
          <Fan x={281} y={89} r={11} id={id} />
        </>
      )}

      {/* Placa-mãe */}
      <rect x="152" y="118" width="152" height="196" rx="6" fill="#0C1322" stroke="#1A2540" strokeWidth="1" />
      {!compact && (
        <g opacity="0.55">
          <path d="M164 138 H210 V166 H244" stroke="#3A4A70" strokeWidth="1" fill="none" />
          <path d="M164 152 H196 V186" stroke="#3A4A70" strokeWidth="1" fill="none" />
          <path d="M258 130 V170 H292" stroke="#3A4A70" strokeWidth="1" fill="none" />
        </g>
      )}
      {/* Dissipador do processador */}
      <rect x="168" y="130" width="56" height="52" rx="5" fill="#131C31" stroke="#3A4A70" strokeWidth="1" />
      <rect x="176" y="138" width="40" height="36" rx="3" fill="#0B1120" />
      <rect x="182" y="146" width="28" height="4" rx="2" fill={`url(#${id}-accent)`} opacity="0.85" />

      {/* Módulos de memória */}
      {Array.from({ length: 4 }).map((_, index) => (
        <rect
          key={index}
          x={238 + index * 12}
          y={128}
          width="7"
          height="58"
          rx="2"
          fill="#16203A"
          stroke="#3A4A70"
          strokeWidth="0.8"
        />
      ))}

      {/* Placas de vídeo */}
      {Array.from({ length: gpus }).map((_, index) => (
        <g key={index}>
          <rect
            x="150"
            y={206 + index * 30}
            width="158"
            height="24"
            rx="4"
            fill={`url(#${id}-gpu)`}
            stroke="#3A4A70"
            strokeWidth="1"
          />
          <rect x="156" y={212 + index * 30} width="96" height="3" rx="1.5" fill={`url(#${id}-accent)`} opacity="0.9" />
          {!compact && (
            <>
              <circle cx="272" cy={218 + index * 30} r="7" fill="#0B1120" stroke="#3A4A70" strokeWidth="0.8" />
              <circle cx="292" cy={218 + index * 30} r="7" fill="#0B1120" stroke="#3A4A70" strokeWidth="0.8" />
            </>
          )}
        </g>
      ))}

      {/* Compartimento da fonte */}
      <rect x="146" y="380" width="164" height="62" rx="8" fill="#0A101E" stroke="#273455" strokeWidth="1" />
      <rect x="160" y="396" width="64" height="4" rx="2" fill="#273455" />
      <rect x="160" y="408" width="44" height="4" rx="2" fill="#273455" />
      {!compact && <Fan x={280} y={411} r={16} id={id} />}

      {/* Faixa luminosa frontal */}
      <rect x="100" y="96" width="6" height="324" rx="3" fill={`url(#${id}-accent)`} opacity="0.9" />
      <rect x="96" y="96" width="14" height="324" rx="7" fill={`url(#${id}-accent)`} opacity="0.25" filter={`url(#${id}-soft)`} />
    </>
  )
}

export function MachineRender({ variant, gpuCount = 1, className, compact = false }: Props) {
  const id = `mr-${variant}-${gpuCount}`

  if (variant === 'rack-2u') {
    return (
      <svg viewBox="0 0 420 520" className={cn('h-full w-full', className)} role="presentation">
        <Defs id={id} />
        <ellipse cx="210" cy="420" rx="170" ry="24" fill={`url(#${id}-bloom)`} opacity="0.45" />
        {[0, 1, 2].map((unit) => (
          <g key={unit} opacity={unit === 1 ? 1 : 0.42}>
            <rect
              x="40"
              y={150 + unit * 96}
              width="340"
              height="82"
              rx="8"
              fill={`url(#${id}-case)`}
              stroke="#273455"
              strokeWidth="1.5"
            />
            <rect x="52" y={162 + unit * 96} width="14" height="58" rx="3" fill="#0A0F1C" />
            <circle cx="59" cy={172 + unit * 96} r="3" fill={`url(#${id}-accent)`} />
            {Array.from({ length: 8 }).map((_, index) => (
              <rect
                key={index}
                x={80 + index * 33}
                y={164 + unit * 96}
                width="26"
                height="54"
                rx="3"
                fill="#0C1322"
                stroke="#1A2540"
                strokeWidth="0.8"
              />
            ))}
            <rect x="80" y={226 + unit * 96} width="290" height="2" rx="1" fill={`url(#${id}-accent)`} opacity={unit === 1 ? 0.9 : 0.3} />
          </g>
        ))}
      </svg>
    )
  }

  if (variant === 'component-gpu') {
    return (
      <svg viewBox="0 0 420 520" className={cn('h-full w-full', className)} role="presentation">
        <Defs id={id} />
        <ellipse cx="210" cy="380" rx="160" ry="30" fill={`url(#${id}-bloom)`} opacity="0.5" />
        <rect x="40" y="180" width="340" height="122" rx="12" fill={`url(#${id}-gpu)`} stroke="#3A4A70" strokeWidth="1.5" />
        <rect x="56" y="196" width="200" height="5" rx="2.5" fill={`url(#${id}-accent)`} />
        <Fan x={140} y={250} r={40} id={id} />
        <Fan x={270} y={250} r={40} id={id} />
        <rect x="60" y="302" width="300" height="12" rx="3" fill="#0B1120" stroke="#273455" strokeWidth="1" />
        {Array.from({ length: 22 }).map((_, index) => (
          <rect key={index} x={68 + index * 13} y="314" width="7" height="14" rx="1" fill="#C8A64B" opacity="0.75" />
        ))}
      </svg>
    )
  }

  if (variant === 'component-board') {
    return (
      <svg viewBox="0 0 420 520" className={cn('h-full w-full', className)} role="presentation">
        <Defs id={id} />
        <ellipse cx="210" cy="420" rx="150" ry="26" fill={`url(#${id}-bloom)`} opacity="0.4" />
        <rect x="70" y="90" width="280" height="310" rx="12" fill="#0C1322" stroke="#273455" strokeWidth="1.5" />
        <g opacity="0.55">
          {Array.from({ length: 9 }).map((_, index) => (
            <path
              key={index}
              d={`M ${90 + index * 10} 110 V ${180 + (index % 4) * 24} H ${150 + index * 18}`}
              stroke="#3A4A70"
              strokeWidth="1"
              fill="none"
            />
          ))}
        </g>
        <rect x="102" y="128" width="92" height="92" rx="8" fill="#131C31" stroke={`url(#${id}-accent)`} strokeWidth="1.2" />
        <rect x="118" y="144" width="60" height="60" rx="4" fill="#0B1120" />
        <rect x="128" y="162" width="40" height="5" rx="2.5" fill={`url(#${id}-accent)`} />
        {Array.from({ length: 4 }).map((_, index) => (
          <rect key={index} x={216 + index * 18} y="126" width="11" height="96" rx="3" fill="#16203A" stroke="#3A4A70" strokeWidth="1" />
        ))}
        {Array.from({ length: 3 }).map((_, index) => (
          <rect key={index} x="102" y={252 + index * 40} width="216" height="22" rx="4" fill="#101828" stroke="#273455" strokeWidth="1" />
        ))}
        <rect x="110" y="262" width="120" height="3" rx="1.5" fill={`url(#${id}-accent)`} opacity="0.8" />
      </svg>
    )
  }

  if (variant === 'desktop-compact') {
    return (
      <svg viewBox="0 0 420 520" className={cn('h-full w-full', className)} role="presentation">
        <Defs id={id} />
        <ellipse cx="210" cy="420" rx="140" ry="24" fill={`url(#${id}-bloom)`} opacity="0.45" />
        <rect x="116" y="146" width="188" height="252" rx="16" fill={`url(#${id}-case)`} stroke="#273455" strokeWidth="1.5" />
        <rect x="116" y="146" width="30" height="252" rx="16" fill="#0A0F1C" />
        <rect x="158" y="160" width="132" height="224" rx="9" fill={`url(#${id}-glass)`} stroke="#3A4A70" strokeWidth="1" />
        <rect x="170" y="178" width="50" height="46" rx="5" fill="#131C31" stroke="#3A4A70" strokeWidth="1" />
        <rect x="180" y="194" width="30" height="4" rx="2" fill={`url(#${id}-accent)`} />
        <rect x="166" y="246" width="118" height="22" rx="4" fill={`url(#${id}-gpu)`} stroke="#3A4A70" strokeWidth="1" />
        <rect x="172" y="252" width="70" height="3" rx="1.5" fill={`url(#${id}-accent)`} opacity="0.9" />
        <Fan x={238} y={330} r={26} id={id} />
        <rect x="126" y="176" width="5" height="192" rx="2.5" fill={`url(#${id}-accent)`} opacity="0.9" />
        <rect x="122" y="176" width="13" height="192" rx="6.5" fill={`url(#${id}-accent)`} opacity="0.22" filter={`url(#${id}-soft)`} />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 420 520" className={cn('h-full w-full', className)} role="presentation">
      <Defs id={id} />
      <Tower id={id} glass={variant === 'tower-glass'} gpuCount={gpuCount} compact={compact} />
    </svg>
  )
}
