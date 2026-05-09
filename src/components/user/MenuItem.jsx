// MenuItem.jsx - NOTIFICATION STYLE (MOBILE + DESKTOP)
import { useContext, useState } from 'react';
import { CartContext } from '../../contexts/CartContext';

const categoryIcons = {
  pizzas: '🍕',
  hamburguesas: '🍔',
  bebidas: '🥤',
  combos: '🍱',
  postres: '🍰',
  extras: '🍟'
};

const MenuItem = ({ item }) => {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = (variant, price) => {
    addToCart(
      { ...item, selectedPrice: price, variant: variant, cartKey: `${item.id}-${variant.toLowerCase()}` },
      quantity,
    );
    setQuantity(1);
  };

  const getImageUrl = () => {
    if (!item.image) return 'https://via.placeholder.com/400x280?text=Pa+Que+Arvey';
    return item.image.startsWith('http') ? item.image : `http://localhost:3001${item.image}`;
  };

  const isPizza = item.category && item.category.toLowerCase() === 'pizzas';
  const minPrice = isPizza
    ? Math.min(...[item.price_small, item.price_medium, item.price_large].filter(Boolean))
    : null;

  return (
    <article className="group rounded-lg border border-gray-200/60 dark:border-white/15 bg-white dark:bg-[#0f0f0f] overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5">
      {/* MOBILE: horizontal notification style */}
      <div className="flex sm:hidden flex-col">
        <div className="flex items-start gap-3 p-3">
          <div className="w-20 h-20 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0">
            <img
              src={getImageUrl()}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x280?text=Pa+Que+Arvey'; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-1 flex-1 min-w-0">
                {item.name}
              </h3>
              <span className="inline-flex items-center gap-0.5 text-xs text-gray-500 dark:text-white/60 font-medium whitespace-nowrap flex-shrink-0">
                <span>{categoryIcons[item.category] ?? '✨'}</span>
                <span>{item.category}</span>
              </span>
            </div>
            {item.description && (
              <p className="text-xs leading-4 text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{item.description}</p>
            )}
            {isPizza ? (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Desde: <span className="text-sm font-bold text-orange-600 dark:text-orange-400">${minPrice?.toLocaleString()}</span>
              </p>
            ) : (
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400 leading-tight">${(item.price_small || item.price)?.toLocaleString()}</p>
            )}
          </div>
        </div>
        <div className="px-3 pb-3 border-t border-gray-100 dark:border-white/5 pt-2">
          {isPizza ? (
            <div className="grid grid-cols-3 gap-1">
              {item.price_small && <button type="button" className="flex flex-col items-center justify-center rounded bg-gradient-to-r from-green-500 to-emerald-500 px-1 py-1.5 text-[10px] font-medium text-white transition-all duration-200 hover:from-green-600 hover:to-emerald-600 hover:scale-[1.02] active:scale-95 shadow-sm shadow-green-600/20" onClick={() => handleAdd('Pequeña', item.price_small)}><span>Pequeña</span><span>${item.price_small.toLocaleString()}</span></button>}
              {item.price_medium && <button type="button" className="flex flex-col items-center justify-center rounded bg-gradient-to-r from-green-500 to-emerald-500 px-1 py-1.5 text-[10px] font-medium text-white transition-all duration-200 hover:from-green-600 hover:to-emerald-600 hover:scale-[1.02] active:scale-95 shadow-sm shadow-green-600/20" onClick={() => handleAdd('Mediana', item.price_medium)}><span>Mediana</span><span>${item.price_medium.toLocaleString()}</span></button>}
              {item.price_large && <button type="button" className="flex flex-col items-center justify-center rounded bg-gradient-to-r from-green-500 to-emerald-500 px-1 py-1.5 text-[10px] font-medium text-white transition-all duration-200 hover:from-green-600 hover:to-emerald-600 hover:scale-[1.02] active:scale-95 shadow-sm shadow-green-600/20" onClick={() => handleAdd('Grande', item.price_large)}><span>Grande</span><span>${item.price_large.toLocaleString()}</span></button>}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-0.5 rounded bg-gray-100 dark:bg-white/10 px-1 py-0.5 border border-gray-200 dark:border-white/15">
                <button type="button" className="inline-flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-white/15 transition-all hover:bg-gray-300 dark:hover:bg-white/25 active:scale-90 text-[10px] font-bold" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="min-w-[1rem] text-center text-[10px] font-medium text-gray-700 dark:text-white px-0.5">{quantity}</span>
                <button type="button" className="inline-flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-white/15 transition-all hover:bg-gray-300 dark:hover:bg-white/25 active:scale-90 text-[10px] font-bold" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button type="button" className="inline-flex items-center justify-center rounded bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 text-[10px] font-semibold text-white transition-all duration-200 hover:from-green-600 hover:to-emerald-600 hover:scale-[1.02] active:scale-95 shadow-sm shadow-green-600/20 whitespace-nowrap" onClick={() => handleAdd('Individual', item.price_small || item.price)}>Agregar</button>
              {item.price_large && <button type="button" className="inline-flex items-center justify-center rounded border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 px-2 py-1 text-[10px] font-medium text-gray-600 dark:text-white/70 transition-all hover:bg-gray-100 dark:hover:bg-white/5 hover:scale-[1.02] active:scale-95 shadow-sm whitespace-nowrap" onClick={() => handleAdd('Grande', item.price_large)}>Grande</button>}
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP: Imagen grande a la izquierda, contenido a la derecha */}
      <div className="hidden sm:flex sm:flex-row sm:min-h-[220px]">
        {/* Imagen izquierda - ocupa altura completa */}
        <div className="w-40 sm:w-48 lg:w-52 flex-shrink-0 overflow-hidden rounded-l-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <img
            src={getImageUrl()}
            alt={item.name}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x280?text=Pa+Que+Arvey'; }}
          />
        </div>

        {/* Contenido derecha */}
        <div className="flex flex-col flex-1 min-w-0 p-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-1 flex-1 min-w-0">{item.name}</h3>
            <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-white/60 font-medium uppercase tracking-wider whitespace-nowrap flex-shrink-0">
              <span>{categoryIcons[item.category] ?? '✨'}</span>
              <span>{item.category}</span>
            </span>
          </div>
          {item.description && (
            <p className="text-sm leading-5 text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{item.description}</p>
          )}
          <div className="flex-1" />
          <div className="flex items-end justify-between gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
            {isPizza ? (
              <>
                <p className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  Desde: <span className="text-lg font-bold text-orange-600 dark:text-orange-400">${minPrice?.toLocaleString()}</span>
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {item.price_small && <button type="button" className="flex flex-col items-center justify-center rounded bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-2 text-xs font-medium text-white transition-all duration-200 hover:from-green-600 hover:to-emerald-600 hover:scale-[1.02] active:scale-95 shadow-sm shadow-green-600/20" onClick={() => handleAdd('Pequeña', item.price_small)}><span>Pequeña</span><span className="text-[11px]">${item.price_small.toLocaleString()}</span></button>}
                  {item.price_medium && <button type="button" className="flex flex-col items-center justify-center rounded bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-2 text-xs font-medium text-white transition-all duration-200 hover:from-green-600 hover:to-emerald-600 hover:scale-[1.02] active:scale-95 shadow-sm shadow-green-600/20" onClick={() => handleAdd('Mediana', item.price_medium)}><span>Mediana</span><span className="text-[11px]">${item.price_medium.toLocaleString()}</span></button>}
                  {item.price_large && <button type="button" className="flex flex-col items-center justify-center rounded bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-2 text-xs font-medium text-white transition-all duration-200 hover:from-green-600 hover:to-emerald-600 hover:scale-[1.02] active:scale-95 shadow-sm shadow-green-600/20" onClick={() => handleAdd('Grande', item.price_large)}><span>Grande</span><span className="text-[11px]">${item.price_large.toLocaleString()}</span></button>}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap">${(item.price_small || item.price)?.toLocaleString()}</p>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5 rounded bg-gray-100 dark:bg-white/10 px-1 py-0.5 border border-gray-200 dark:border-white/15">
                    <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded bg-gray-200 dark:bg-white/15 transition-all hover:bg-gray-300 dark:hover:bg-white/25 active:scale-90 text-[11px] font-bold" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                    <span className="min-w-[1.5rem] text-center text-sm font-medium text-gray-700 dark:text-white px-0.5">{quantity}</span>
                    <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded bg-gray-200 dark:bg-white/15 transition-all hover:bg-gray-300 dark:hover:bg-white/25 active:scale-90 text-[11px] font-bold" onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                  <button type="button" className="inline-flex items-center justify-center rounded bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:from-green-600 hover:to-emerald-600 hover:scale-[1.02] active:scale-95 shadow-sm shadow-green-600/20 whitespace-nowrap" onClick={() => handleAdd('Individual', item.price_small || item.price)}>Agregar</button>
                  {item.price_large && <button type="button" className="inline-flex items-center justify-center rounded border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-white/70 transition-all hover:bg-gray-100 dark:hover:bg-white/5 hover:scale-[1.02] active:scale-95 shadow-sm" onClick={() => handleAdd('Grande', item.price_large)}>Grande</button>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default MenuItem;