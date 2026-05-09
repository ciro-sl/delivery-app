// src/components/common/ConfirmDialog.jsx
const ConfirmDialog = ({ isOpen, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, onCancel, darkMode, children }) => {
  if (!isOpen) return null;

  const bgPanel = darkMode ? 'bg-[#111111]/95 text-white backdrop-blur-xl' : 'bg-gradient-to-br from-slate-100/95 via-slate-200/90 to-gray-300/85 text-slate-800 backdrop-blur-xl';
  const inputClass = darkMode
    ? 'w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-white placeholder:text-white/40 focus:border-naranja focus:ring-naranja/20 transition-all duration-300'
    : 'w-full rounded-2xl border border-slate-400/60 bg-gradient-to-r from-slate-50/90 via-gray-100/80 to-slate-200/70 px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-300/50 transition-all duration-300 shadow-sm shadow-gray-200 dark:shadow-black/20 hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-black/30';

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xl p-4 transition-all duration-300'
      style={{
        animation: 'modalFadeIn 0.3s ease-out forwards'
      }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-gradient-to-tr from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div
        className='relative w-full max-w-lg max-h-[calc(100vh-4rem)] overflow-hidden overflow-y-auto rounded-[2.5rem] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] bg-gradient-to-br from-[#111111]/98 via-[#0a0a0a]/95 to-[#000000]/98 backdrop-blur-2xl transform transition-all duration-500 ease-out'
        style={{
          animation: 'modalBounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards'
        }}
      >

        {/* Header premium con icono */}
        <div className='px-8 py-6 border-b border-white/5 bg-gradient-to-r from-red-500/5 via-transparent to-orange-500/5'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center'>
              <span className='text-lg'>⚠️</span>
            </div>
            <div>
              <h3 className='text-xl font-bold text-white'>
                {title}
              </h3>
            </div>
          </div>
        </div>

        <div className='px-8 py-6'>
          <p className='text-sm leading-relaxed mb-6 text-white/70'>
            {message}
          </p>

          {children && (
            <div className='mb-6'>
              {children}
            </div>
          )}

          <div className='flex gap-4'>
            <button
              type='button'
              onClick={onCancel}
              className='flex-1 rounded-xl border border-white/20 bg-[#1a1a1a]/50 text-white/80 hover:border-white/30 hover:bg-[#1a1a1a]/70 hover:text-white px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105'
            >
              {cancelText}
            </button>
            <button
              type='button'
              onClick={onConfirm}
              className='flex-1 rounded-xl border border-red-400/60 bg-gradient-to-r from-red-500 via-red-500 to-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-600/40 hover:border-red-500/70 hover:from-red-600 hover:to-red-700'
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;