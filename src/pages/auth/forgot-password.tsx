
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import { useCountdown } from "@/hooks/use-countdown";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "verification">("email");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const { 
    seconds, 
    isActive, 
    startCountdown, 
    resetCountdown 
  } = useCountdown(60);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Mock API call to send verification code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Move to verification step
      setStep("verification");
      startCountdown();
    } catch (err) {
      setError("Failed to send verification code");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isActive) return;
    
    setError("");
    setIsLoading(true);

    try {
      // Mock API call to resend verification code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      resetCountdown();
      startCountdown();
    } catch (err) {
      setError("Failed to resend verification code");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Mock API call to verify code and reset password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes - would be replaced with actual verification
      if (verificationCode === "123456") {
        // Success - redirect to login
        router.push("/auth/login?reset=success");
      } else {
        setError("Invalid verification code");
      }
    } catch (err) {
      setError("Failed to verify code");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password</title>
        <meta name="description" content="Reset your password" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-9 w-9 rounded-full"
                onClick={() => step === "verification" ? setStep("email") : router.push("/auth/login")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-2xl font-bold text-center flex-1 pr-9">
                {step === "email" ? "Forgot Password" : "Verify Code"}
              </CardTitle>
            </div>
            <CardDescription className="text-center">
              {step === "email" 
                ? "Enter your email to receive a verification code" 
                : "Enter the verification code sent to your email"}
            </CardDescription>
          </CardHeader>
          
          {step === "email" ? (
            <form onSubmit={handleSendCode}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
                
                <div className="text-center text-sm">
                  Remember your password?{" "}
                  <Link 
                    href="/auth/login" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Back to login
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Didn't receive the code?{" "}
                    {isActive ? (
                      <span className="text-gray-400">
                        Resend in {seconds}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        disabled={isLoading}
                      >
                        Resend Code
                      </button>
                    )}
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Reset Password"}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </>
  );
}
