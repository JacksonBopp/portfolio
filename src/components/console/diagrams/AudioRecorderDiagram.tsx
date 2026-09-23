function Node({ x, y, w, h, label, sub }: { x: number; y: number; w: number; h: number; label: string; sub?: string }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={2}
        fill="var(--panel-raised)"
        stroke="var(--hairline-strong)"
        strokeWidth={1}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + (sub ? -4 : 4)}
        textAnchor="middle"
        fontSize="10"
        fontFamily="var(--font-geist-mono), monospace"
        fill="var(--fg)"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 10}
          textAnchor="middle"
          fontSize="8"
          fontFamily="var(--font-geist-mono), monospace"
          fill="var(--fg-dim)"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--cyan-dim)"
      strokeWidth={1}
      markerEnd="url(#arrow)"
    />
  );
}

export default function AudioRecorderDiagram() {
  return (
    <div className="hairline rounded p-4">
      <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-[var(--fg-dim)]">
        System block diagram
      </span>
      <svg
        viewBox="0 0 480 200"
        className="mt-3 w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--cyan-dim)" />
          </marker>
        </defs>

        <Node x={10} y={70} w={110} h={50} label="SSM2603" sub="Audio CODEC (I2C)" />
        <Node x={185} y={70} w={110} h={50} label="PicoBlaze" sub="soft-core MCU" />
        <Node x={360} y={70} w={110} h={50} label="Serial Terminal" sub="UART menu" />
        <Node x={185} y={150} w={110} h={40} label="DDR2 SDRAM" />
        <Node x={185} y={10} w={110} h={40} label="Switches / LEDs" />

        <Arrow x1={120} y1={95} x2={185} y2={95} />
        <Arrow x1={295} y1={95} x2={360} y2={95} />
        <Arrow x1={240} y1={70} x2={240} y2={50} />
        <Arrow x1={240} y1={120} x2={240} y2={150} />
      </svg>
    </div>
  );
}
