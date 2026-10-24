"use client";

import { useSignIn, useUser } from "@clerk/nextjs";
import { useSignIn as useSignInLegacy } from "@clerk/nextjs/legacy";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const { isLoaded, signIn, setActive } = useSignInLegacy();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const role = user?.publicMetadata?.role;

  useEffect(() => {
    if (userLoaded && isSignedIn && typeof role === "string" && role) {
      router.replace(`/${role}`);
    }
  }, [userLoaded, isSignedIn, role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setError("");
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: username, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        setError("Extra verification is required for this account.");
      }
    } catch (err: any) {
      setError(
        err?.errors?.[0]?.longMessage ||
          err?.errors?.[0]?.message ||
          "Sign in failed. Check your username and password."
      );
    } finally {
      setLoading(false);
    }
  };

  // Signed in but no role: show a clear message instead of a blank page
  if (userLoaded && isSignedIn && !role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-lamaSkyLight p-4">
        <p>Your account has no role assigned yet. Ask an administrator.</p>
        <SignOutLink />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lamaSkyLight p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2 w-full max-w-sm"
      >
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Image src="/logo.png" alt="" width={24} height={24} />
          SchooLama
        </h1>
        <h2 className="text-gray-400">Sign in to your account</h2>

        <div className="flex flex-col gap-2 mt-2">
          <label htmlFor="username" className="text-xs text-gray-500">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 rounded-md ring-1 ring-gray-300"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-xs text-gray-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded-md ring-1 ring-gray-300"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !isLoaded}
          className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px] disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

import { SignOutButton } from "@clerk/nextjs";
const SignOutLink = () => (
  <SignOutButton>
    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
      Sign out
    </button>
  </SignOutButton>
);

export default LoginPage;