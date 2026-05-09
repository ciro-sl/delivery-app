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
        className="relative overflow-hidden rounded-b-[2rem] sm:rounded-b-[3rem] md:rounded-b-[4rem] border-b border-naranja/20 bg-cover bg-center text-white min-h-[60vh] sm:min-h-[70vh] md:min-h-[72vh]"
        style={{ backgroundImage: "url('src/assets/local.jpeg')" }}
      >
        {/* Capa oscura semitransparente para que el texto destaque sobre la foto. */}
        <div className="absolute inset-0 bg-black/50 sm:bg-black/45" />
        {/* Contenedor del contenido del hero con ancho máximo y padding. */}
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32">
          {/* Bloque interno con separación entre cada elemento de texto. */}
          <div className="max-w-3xl space-y-6 sm:space-y-8">
            {/* Texto pequeño en la parte superior para reforzar la marca. */}
            <span className="inline-flex rounded-full bg-vinotinto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white shadow-xl shadow-vinotinto/30">
              Pizzería Pa' Que Arvey
            </span>
            {/* Título principal con tipografía grande y peso fuerte - centrado en móvil */}
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight text-white drop-shadow-2xl text-center sm:text-left">
              El sabor nocturno que<br /> enciende la ciudad
            </h1>
            {/* Descripción breve que explica la oferta principal. */}
            <p className="max-w-2xl text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed font-medium text-center sm:text-left">
              Pizzas artesanales, hamburguesas y combos pensados para pedidos rápidos y entregas seguras.
            </p>
          </div>
        </div>
      </section>

      {/* Sección del menú destacado con su título y el componente Menu. */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="mb-12 sm:mb-16 md:mb-20 text-center relative">
          {/* Subtítulo de sección que introduce el menú destacado. */}
          <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[#e67e22] font-bold mb-6 sm:mb-8 sm:ml-0 md:ml-4 lg:ml-6 drop-shadow-md">
            Menú destacado
          </p>
          {/* Título que indica que el usuario puede elegir sus productos favoritos. */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight sm:ml-0 md:ml-4 lg:ml-6 drop-shadow-lg relative">
            {/* Decorative line above the title */}
            <div className="absolute -top-3 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#e67e22] to-transparent rounded-full shadow-lg shadow-[#e67e22]/20"></div>
            <div className="absolute -top-3 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#e67e22]/50 to-transparent rounded-full blur-sm"></div>
            Elija sus favoritos
            {/* Decorative line under the title */}
            <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#e67e22] to-transparent rounded-full shadow-lg shadow-[#e67e22]/20"></div>
            <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#e67e22]/50 to-transparent rounded-full blur-sm"></div>
          </h2>
        </div>
        {/* Renderizar el componente del menú con todos los productos disponibles. */}
        <Menu />
      </section>
    </div>
  )
}

// Exportar el componente Home para que pueda ser usado en el router principal.
export default Home