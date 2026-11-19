// Ícono SVG en línea (set Lucide, de react-icons) en lugar de un emoji: toma el color y el tamaño del texto
// que lo rodea. Uso: <Icono de={LuGift} /> Texto. Es decorativo: los lectores de pantalla lo saltean.
export default function Icono({ de: Svg, style, ...props }) {
  return <Svg aria-hidden="true" focusable="false" style={{ verticalAlign: "-0.125em", flexShrink: 0, ...style }} {...props} />;
}
