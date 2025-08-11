import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function LoginView({ initialCheck, error, loading, handleGoogleLogin, renderDots, isTermsAccepted, setIsTermsAccepted }) {
  if (initialCheck) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full flex flex-col lg:flex-row bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="relative lg:w-1/2 p-8 sm:p-12 flex flex-col items-center justify-center text-center text-gray-900">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">{renderDots()}</div>
            <div className="relative z-10">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                TodoPro<span className="text-blue-600">.</span>
              </h1>
              <p className="text-2xl sm:text-3xl font-semibold text-balance">
                Organize it all<span className="text-blue-600">.</span>
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 p-8 sm:p-12 bg-white flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
                <p className="text-gray-600">Continue with your Google account</p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center space-x-3 py-3 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 rounded-lg shadow-md hover:shadow-lg"
                disabled={loading || !isTermsAccepted}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </Button>

              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="terms"
                  checked={isTermsAccepted}
                  onCheckedChange={(checked) => setIsTermsAccepted(checked)}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}