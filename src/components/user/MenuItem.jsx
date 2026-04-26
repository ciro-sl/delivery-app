// MenuItem.jsx - SOMBRAS MUY NOTORIAS EN AMBOS MODOS
import { useContext, useState } from 'react';
import { CartContext } from '../../contexts/CartContext';

const categoryIcons = {
  pizzas: '🍕',
  hamburguesas: '🍔',
  bebidas: '🥤',
  extras: '🍟'
};

const MenuItem = ({ item }) => {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = (variant, price) => {
    addToCart(
      {
        ...item,
        selectedPrice: price,
        variant: variant,
        cartKey: `${item.id}-${variant.toLowerCase()}`,
      },
      quantity,
    );
    setQuantity(1);
  };

  return (
    <article className="group rounded-2xl border border-gray-300 dark:border-white/20 bg-white dark:bg-[#111111] p-6 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3),0_8px_10px_-6px_rgba(0,0,0,0.2)] dark:shadow-[0_15px_55px_-5px_rgba(255,255,255,0.15),0_8px_10px_-6px_rgba(255,255,255,0.1)]">
      <div className="mb-5 overflow-hidden rounded-xl bg-gray-100 dark:bg-[#181818]">
        <img
          src={item.image || 'https://via.placeholder.com/400x280?text=Pa+Que+Arvey'}
          alt={item.name}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-white/70">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amarillo/15 text-amarillo">
              {categoryIcons[item.category] ?? '✨'}
            </span>
            <span className="font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-white/60">
              {item.category}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-black dark:text-white">{item.name}</h3>
          <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Precio</p>
            <p className="text-3xl font-bold text-amarillo">
              ${item.price.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-gray-100 dark:bg-white/10 px-3 py-2 text-sm text-black dark:text-white shadow-md shadow-gray-400/50 dark:shadow-white/10">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-white/15 transition-all hover:bg-gray-300 dark:hover:bg-white/25"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className="min-w-[1.6rem] text-center text-sm font-semibold">
              {quantity}
            </span>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-white/15 transition-all hover:bg-gray-300 dark:hover:bg-white/25"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="rounded-full bg-gradient-to-r from-verde to-emerald-400 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:from-emerald-500 hover:to-lime-400 hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-700/40 dark:shadow-emerald-500/30"
            onClick={() => handleAdd('Individual', item.price)}
          >
            Agregar individual
          </button>
          {item.priceLarge && (
            <button
              type="button"
              className="rounded-full border border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-white/10 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-white transition-all duration-300 hover:bg-gray-200 dark:hover:bg-white/20 hover:scale-[1.02] active:scale-95 shadow-lg shadow-gray-500/30 dark:shadow-white/15"
              onClick={() => handleAdd('Grande', item.priceLarge)}
            >
              Agregar grande
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default MenuItem;