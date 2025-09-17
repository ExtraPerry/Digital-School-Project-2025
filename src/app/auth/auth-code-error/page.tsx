export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-4">
          There was an error processing your authentication request.
        </p>
        <p className="text-sm text-gray-500">
          Please try again or contact support if the problem persists.
        </p>
      </div>
    </div>
  )
}
