// Importar el componente Link que permite navegación entre páginas.
import { Link } from 'react-router-dom'
// Importar el componente Menu para mostrar el menú destacado.
import Menu from '../components/user/Menu'

// Componente Home de la página principal.
const Home = () => {
  return (
    // Contenedor principal con padding inferior.
    <div className="pb-20">
      {/* Hero principal con imagen local como fondo y borde redondeado abajo. */}
      <section
        className="relative overflow-hidden rounded-b-[4rem] border-b border-naranja/20 bg-cover bg-center text-white min-h-[72vh]"
        style={{ backgroundImage: "url('src/assets/local.jpeg')" }}
      >
        {/* Capa oscura semitransparente para que el texto destaque sobre la foto. */}
        <div className="absolute inset-0 bg-black/45" />
        {/* Contenedor del contenido del hero con ancho máximo y padding. */}
        <div className="container relative mx-auto px-4 py-24 lg:py-32">
          {/* Bloque interno con separación entre cada elemento de texto. */}
          <div className="max-w-3xl space-y-6">
            {/* Texto pequeño en la parte superior para reforzar la marca. */}
            <span className="inline-flex rounded-full bg-vinotinto px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-vinotinto/20">
              Pizzería Pa' Que Arvey
            </span>
            {/* Título principal con tipografía grande y peso fuerte. */}
            <h1 className="text-4xl font-bold leading-tight md:text-6xl tracking-tight">
              El sabor nocturno que enciende la ciudad
            </h1>
            {/* Descripción breve que explica la oferta principal. */}
            <p className="max-w-2xl text-lg text-white/80">
              Pizzas artesanales, hamburguesas y combos pensados para pedidos rápidos y entregas seguras.
            </p>
            {/* Contenedor de botones con layout en columna en móviles y fila en pantallas grandes. */}
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Botón primario que lleva al carrito de compras. */}
              <Link to="/cart" className="inline-flex items-center justify-center rounded-full bg-naranja px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-naranja/90 shadow-lg shadow-naranja/20">
                Ver carrito
              </Link>
              {/* Botón secundario para ir al panel administrativo. */}
              <Link to="/admin/login" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/20">
                Panel administrativo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sección del menú destacado con su título y el componente Menu. */}
      <section className="container mx-auto px-4 py-14">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-[#e0e0e0] pb-8">
          <div>
            {/* Subtítulo de sección que introduce el menú destacado. */}
            <p className=" px-2 py-8 mb-1   flex flex-wraptext-sm uppercase tracking-[0.5em] text-[#e67e22] font-semibold">Menú destacado</p>
            {/* Título que indica que el usuario puede elegir sus productos favoritos. */}
            <h2 className="text-4xl font-bold text-blanco-900">Elija sus favoritos</h2>
          </div>
        </div>
        {/* Renderizar el componente del menú con todos los productos disponibles. */}
        <Menu />
      </section>
    </div>
  )
}

// Exportar el componente Home para que pueda ser usado en el router principal.
export default Home