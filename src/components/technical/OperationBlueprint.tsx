import type { ReactNode, Ref } from 'react'
import { operationLayers, type OperationLayerId } from '../../data/content'

const W = 760
const H = 540
const COLUMNS = [120, 240, 360, 480, 600]
const BAYS = COLUMNS.slice(0, -1)
const EAVE = 150
const PEAK = 100
const GROUND = 400
const slopeY = (x0: number, x: number) => EAVE - ((x - x0) * (EAVE - PEAK)) / 120
const range = (from: number, to: number, step: number) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step)

const GEOMETRY: Record<OperationLayerId, { y: number; marker: [number, number] }> = {
  roof: { y: 100, marker: [300, 128] },
  structure: { y: 200, marker: [240, 200] },
  systems: { y: 300, marker: [360, 284] },
  production: { y: 400, marker: [236, 352] },
  reservoirs: { y: 475, marker: [240, 462] },
}

function Roof() {
  return (
    <>
      <g className="bp-base">
        {BAYS.map((x0) => (
          <g key={x0}>
            <path d={`M${x0} ${EAVE} L${x0 + 120} ${PEAK} M${x0} ${EAVE - 5} L${x0 + 120} ${PEAK - 5}`} />
            <rect x={x0 + 113} y={PEAK + 2} width={6} height={EAVE - PEAK - 6} />
            {[0.3, 0.55, 0.8].map((t) => (
              <path key={t} d={`M${x0 + 113} ${PEAK + 2 + t * (EAVE - PEAK - 6)} h6`} />
            ))}
            <path d={`M${x0 - 6} ${EAVE} v6 h12 v-6`} />
            <path d={`M${x0 + 52} ${slopeY(x0, x0 + 52) - 5} l4 -9 h14 l4 9`} />
          </g>
        ))}
        <path d={`M600 ${PEAK - 5} v-6 M120 ${EAVE - 5} v-8`} />
      </g>
      <g className="bp-accent">
        {BAYS.map((x0) => (
          <rect key={x0} x={x0 + 113} y={PEAK + 2} width={6} height={EAVE - PEAK - 6} />
        ))}
        <path d={`M240 ${EAVE} L360 ${PEAK}`} />
      </g>
    </>
  )
}

function Structure() {
  return (
    <>
      <g className="bp-base">
        {COLUMNS.map((x) => (
          <g key={x}>
            <rect x={x - 4} y={EAVE} width={8} height={GROUND + 12 - EAVE} />
            <rect x={x - 11} y={GROUND + 9} width={22} height={4} />
            {x > 120 && <path d={`M${x - 4} 192 L${x - 30} 158`} />}
            {x < 600 && <path d={`M${x + 4} 192 L${x + 30} 158`} />}
          </g>
        ))}
        <path d={`M120 158 H600`} />
        {BAYS.map((x0) =>
          range(x0 + 20, x0 + 100, 20).map((x, i) => (
            <path key={`${x0}-${x}`} d={`M${x} 158 V${slopeY(x0, x) + 1} M${x} 158 L${x + (i % 2 ? -20 : 20)} ${slopeY(x0, x + (i % 2 ? -20 : 20)) + 1}`} />
          )),
        )}
        {[104, 604].map((x) => (
          <g key={x}>
            <rect x={x} y={EAVE} width={12} height={GROUND - EAVE} />
            {range(EAVE + 25, GROUND - 25, 25).map((y) => (
              <path key={y} d={`M${x} ${y} h12`} />
            ))}
          </g>
        ))}
      </g>
      <g className="bp-accent">
        <rect x={236} y={EAVE} width={8} height={GROUND + 12 - EAVE} />
        <rect x={104} y={EAVE} width={12} height={GROUND - EAVE} />
        <path d="M120 158 H600" />
      </g>
    </>
  )
}

function Systems() {
  return (
    <>
      <g className="bp-base">
        <rect x={130} y={168} width={460} height={14} />
        {range(190, 550, 60).map((x) => (
          <path key={x} d={`M${x} 168 v14`} />
        ))}
        {[200, 320, 440].map((x) => (
          <rect key={x} x={x - 8} y={182} width={16} height={7} />
        ))}
        <path d="M128 250 H596 M128 256 H596" />
        {range(134, 590, 12).map((x) => (
          <path key={x} d={`M${x} 250 v6`} />
        ))}
        {[180, 300, 420, 540].map((x) => (
          <path key={x} d={`M${x} 182 V250`} />
        ))}
        {[276, 284, 292].map((y) => (
          <path key={y} d={`M116 ${y} H596`} />
        ))}
        <path d="M470 292 V350 M464 314 l12 8 v-8 l-12 8 z" />
        <rect x={132} y={322} width={40} height={78} />
        <path d="M152 322 V400 M152 322 V256" />
        <rect x={136} y={328} width={12} height={5} />
      </g>
      <g className="bp-accent">
        <path d="M128 250 H596 M128 256 H596" />
        {[276, 284, 292].map((y) => (
          <path key={y} d={`M116 ${y} H596`} />
        ))}
        <rect x={132} y={322} width={40} height={78} />
      </g>
    </>
  )
}

function Production() {
  return (
    <>
      <g className="bp-base">
        <rect x={104} y={GROUND} width={512} height={12} />
        {COLUMNS.map((x) => (
          <path key={x} d={`M${x + (x === 600 ? -14 : 4)} 206 h10`} />
        ))}
        <rect x={124} y={208} width={472} height={8} />
        <rect x={280} y={216} width={30} height={10} />
        <path d="M295 226 V300 M295 300 q0 8 -6 8" />
        <rect x={275} y={312} width={40} height={28} strokeDasharray="3 3" />
        <rect x={196} y={330} width={74} height={70} />
        <rect x={204} y={340} width={36} height={22} />
        <rect x={252} y={340} width={12} height={40} />
        <rect x={330} y={372} width={130} height={10} />
        {range(337, 455, 15).map((x) => (
          <circle key={x} cx={x} cy={377} r={3} />
        ))}
        {[340, 395, 450].map((x) => (
          <path key={x} d={`M${x} 382 V400`} />
        ))}
        <rect x={480} y={360} width={50} height={30} />
        {range(486, 524, 6).map((x) => (
          <path key={x} d={`M${x} 360 v30`} />
        ))}
        <path d="M530 375 H534" />
        <circle cx={548} cy={375} r={14} />
        <rect x={476} y={390} width={94} height={10} />
      </g>
      <g className="bp-accent">
        <rect x={196} y={330} width={74} height={70} />
        <rect x={480} y={360} width={50} height={30} />
        <circle cx={548} cy={375} r={14} />
        <rect x={275} y={312} width={40} height={28} />
      </g>
    </>
  )
}

function Reservoirs() {
  return (
    <>
      <g className="bp-base">
        <rect x={150} y={425} width={180} height={70} rx={6} />
        <rect x={157} y={432} width={166} height={56} rx={3} />
        <path d="M157 446 H323" strokeDasharray="6 4" />
        <rect x={290} y={GROUND + 12} width={22} height={13} />
        <path d="M286 398 h30" />
        {range(432, 484, 8).map((y) => (
          <path key={y} d={`M296 ${y} h10`} />
        ))}
        <path d="M296 425 V490 M306 425 V490" />
        <rect x={400} y={GROUND + 12} width={40} height={28} />
        <path d="M650 400 L662 252 M720 400 L708 252 M656 330 L714 290 M656 290 L714 330 M652 370 L718 345 M652 345 L718 370" />
        <path d="M645 250 V208 A40 9 0 0 1 725 208 V250 Z" />
        <path d="M645 208 A40 9 0 0 0 725 208" />
        <path d="M730 400 V200 M736 400 V200" />
        {range(210, 390, 14).map((y) => (
          <path key={y} d={`M730 ${y} h6`} />
        ))}
        <path d="M685 250 V290 H616" />
      </g>
      <g className="bp-accent">
        <rect x={150} y={425} width={180} height={70} rx={6} />
        <path d="M645 250 V208 A40 9 0 0 1 725 208 V250 Z" />
        <rect x={290} y={GROUND + 12} width={22} height={13} />
      </g>
    </>
  )
}

const LAYER_ART: Record<OperationLayerId, () => ReactNode> = {
  roof: Roof,
  structure: Structure,
  systems: Systems,
  production: Production,
  reservoirs: Reservoirs,
}

type Props = {
  layerRef: (id: OperationLayerId) => Ref<SVGGElement>
  wipeRef?: Ref<SVGRectElement>
  className?: string
}

export function OperationBlueprint({ layerRef, wipeRef, className = '' }: Props) {
  return (
    <svg viewBox={`0 70 ${W} ${H - 70}`} className={className} role="img" aria-label="Corte técnico de uma instalação industrial com cinco camadas: cobertura, estrutura, sistemas, área produtiva e reservatórios">
      <defs>
        <mask id="bp-wipe">
          <rect ref={wipeRef} x={0} y={0} width={W} height={H} fill="white" />
        </mask>
      </defs>
      <g mask="url(#bp-wipe)">
        <g className="bp-static">
          <path d={`M10 ${GROUND} H104 M616 ${GROUND} H750`} />
          {[...range(14, 96, 10), ...range(624, 744, 10)].map((x) => (
            <path key={x} d={`M${x} ${GROUND + 1} l-6 8`} />
          ))}
          <path d="M100 60 V505" strokeDasharray="2 4" />
        </g>

        {operationLayers.map((layer, i) => {
          const Art = LAYER_ART[layer.id]
          const { y, marker } = GEOMETRY[layer.id]
          return (
            <g key={layer.id} id={layer.id} ref={layerRef(layer.id)} className="bp-layer">
              <Art />
              <g className="bp-base">
                <path d={`M92 ${y} h16`} />
              </g>
              <text x={12} y={y - 4} className="font-mono" fontSize={9} letterSpacing={0.6} fill="var(--color-blueprint)">
                {layer.elevation}
              </text>
              <g className="bp-accent">
                <path d={`M108 ${y} H${marker[0]} V${marker[1] + Math.sign(y - marker[1]) * 8}`} strokeDasharray="2 3" strokeWidth={1} />
                <circle cx={marker[0]} cy={marker[1]} r={8} strokeWidth={1} />
                <circle cx={marker[0]} cy={marker[1]} r={3} fill="var(--color-accent)" stroke="none" />
                <text x={12} y={y + 12} className="font-mono" fontSize={9} letterSpacing={0.8} fill="var(--color-accent-ink)" stroke="none">
                  {String(i + 1).padStart(2, '0')} {layer.short.toUpperCase()}
                </text>
              </g>
            </g>
          )
        })}
      </g>

      <g className="bp-static" style={{ opacity: 0.7 }}>
        <rect x={560} y={510} width={190} height={22} />
        <text x={568} y={524} className="font-mono" fontSize={8} letterSpacing={0.8} fill="var(--color-blueprint)" stroke="none">
          CORTE A-A · ESC. ILUSTRATIVA
        </text>
      </g>
    </svg>
  )
}
