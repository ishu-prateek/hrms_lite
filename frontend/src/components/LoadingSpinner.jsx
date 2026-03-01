
function LoadingSpinner({ size = 'md', message = 'Loading...', fullScreen = false }) {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className={`${fullScreen ? 'fixed inset-0 bg-white/60 backdrop-blur flex items-center justify-center z-50' : 'flex flex-col items-center justify-center py-12'}`}>
      <div className={`${sizes[size]} border-blue-600 border-t-transparent rounded-full animate-spin`} />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;