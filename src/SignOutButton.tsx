"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="px-4 py-2 rounded font-semibold transition-colors shadow-sm border-4 border-yellow-900 text-yellow-900 hover:bg-[#e5ddc5] relative overflow-hidden"
      style={{
        backgroundImage: 'url("/333.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#C2B280",
        borderColor: "#b8860b",
      }}
      onClick={() => void signOut()}
    >
      Sign out
    </button>
  );
}
