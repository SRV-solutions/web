import Nav from "./Nav/Index";

export default function Header() {
  return (
    <>
      <Nav />
      {/* Spacer para que el contenido de la app no quede oculto detrás de la barra fija */}
      <div style={{ height: "70px" }} />
    </>
  );
}