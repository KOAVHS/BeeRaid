interface BeeLogoProps {
  size?: number;
  className?: string;
}

/**
 * Logo de BeeRaid: silueta poligonal de abeja (cuerpo hexagonal + abdomen),
 * sin curvas, en linea con la estetica low-poly del HexGrid de fondo.
 * Usar a cualquier tamano: navbar (~28px), hero/footer (~120-160px), favicon (16px).
 */
export function BeeLogo({ size = 32, className = "" }: BeeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-44 -70 88 136"
      className={className}
      role="img"
      aria-label="BeeRaid"
    >
      <polygon points="0,-62 30,-44 30,-8 0,10 -30,-8 -30,-44" fill="#F59E0B" />
      <polygon points="0,10 32,-2 38,30 14,58 -14,58 -38,30 -32,-2" fill="#F59E0B" />
      <polygon points="-32,-2 32,-2 28,16 -28,16" fill="#110800" />
      <polygon points="-22,30 22,30 19,44 -19,44" fill="#110800" />
    </svg>
  );
}
