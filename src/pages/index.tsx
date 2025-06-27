
import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Welcome to Our Platform</title>
        <meta name="description" content="Welcome to our platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-4">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Our Platform</h1>
          <p className="text-lg text-gray-600">
            A secure and feature-rich platform for all your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push("/auth/login")}
              className="w-full sm:w-auto"
            >
              Sign In
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push("/auth/register")}
              className="w-full sm:w-auto"
            >
              Create Account
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
