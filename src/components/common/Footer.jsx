const Footer = () => {
  return (
    <footer className="bg-white/80 dark:bg-[#121212]/85 border-t border-gray-200/70 dark:border-white/10 mt-16 py-6 text-gray-600 dark:text-texto-muted shadow-inner dark:shadow-black/20 backdrop-blur-xl">
      <div className="container mx-auto px-4 text-center">
        <p className="text-black dark:text-white">🍕 Pizzería Pa' Que Arvey - Servicio rápido y seguro para tu pedido</p>
        <p className="text-sm mt-2 text-gray-500 dark:text-texto-muted">© {new Date().getFullYear()} - Pa' Que Arvey</p>
      </div>
    </footer>
  )
}

export default Footer