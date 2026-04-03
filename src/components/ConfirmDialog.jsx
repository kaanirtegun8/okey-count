export function ConfirmDialog({ title, message, onConfirm, onCancel, confirmText = 'Evet', cancelText = 'Vazgec' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onCancel}>
      <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
        <p className="text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-surface-light text-slate-300 font-medium active:scale-95 transition-transform"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-danger text-white font-medium active:scale-95 transition-transform"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
