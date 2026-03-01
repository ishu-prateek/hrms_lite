
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-sm">
      <div className="text-red-600 mb-4 text-4xl">⚠️</div>

      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Something went wrong
      </h3>

      <p className="text-red-600 mb-6">
        {message}
      </p>

      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;