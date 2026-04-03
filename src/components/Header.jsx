export function Header({ title, onBack, rightAction }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-white/10">
      <div className="w-12">
        {onBack && (
          <button onClick={onBack} className="text-primary text-2xl p-1 -ml-1">
            &#8592;
          </button>
        )}
      </div>
      <h1 className="text-lg font-semibold text-white flex-1 text-center">{title}</h1>
      <div className="w-12 text-right">
        {rightAction}
      </div>
    </div>
  )
}
