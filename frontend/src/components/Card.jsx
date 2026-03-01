function Card({ children, title, glass = false, className = '' }) {
  return (
    <div
      className={`
        ${glass ? 'bg-white/70 backdrop-blur-lg border border-white/40' : 'bg-white'}
        rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden
        ${className}
      `}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export default Card;