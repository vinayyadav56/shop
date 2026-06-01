/** Premium placeholder mark: a house roofline with a sprout/leaf rising through it.
 *  Single-colour, print-ready. Swap with the user's reference art when provided. */
export function LogoMark({
  className = '',
  stroke = 'currentColor',
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* house */}
      <path d="M9 22 24 9l15 13" />
      <path d="M12 21v16h24V21" />
      {/* sprout inside */}
      <path d="M24 37v-9" />
      <path d="M24 30c0-3-2.4-5-5.2-5C18.8 28 21 30 24 30Z" fill={stroke} stroke="none" />
      <path d="M24 28c0-3 2.4-5.4 5.4-5.4C29.4 25.8 27 28 24 28Z" fill={stroke} stroke="none" />
    </svg>
  );
}

export function BrandLogo({
  light = false,
  className = '',
}: {
  light?: boolean;
  className?: string;
}) {
  const fg = light ? 'text-white' : 'text-forest';
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span
        className={`grid h-9 w-9 place-items-center rounded-xl ${
          light ? 'bg-white/15 backdrop-blur' : 'bg-forest'
        }`}
      >
        <LogoMark className="h-5 w-5" stroke="#fff" />
      </span>
      <span
        className={`font-heading text-[15px] font-extrabold uppercase tracking-[0.18em] ${fg}`}
      >
        PlantAtHome
      </span>
    </div>
  );
}
