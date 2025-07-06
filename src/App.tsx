import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { UpdatedSignInForm } from "./components/UpdatedSignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { CyberSecurityApp } from "./components/CyberSecurityApp";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      <header className="sticky top-0 z-10 bg-black/20 backdrop-blur-sm h-16 flex justify-between items-center border-b border-green-500/20 shadow-lg px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-white rounded-lg flex items-center justify-center">
            <span className="text-green-800 font-bold text-sm">🇸🇦</span>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent">
            سايبرين السعودية CybrainSA
          </h2>
        </div>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      
      <main className="flex-1">
        <Content />
      </main>
      
      <Toaster theme="dark" />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent mb-4">
            سايبرين السعودية CybrainSA
            </h1>
            <p className="text-gray-300 text-lg">
              تعلم الأمن السيبراني واكتشاف الثغرات من خلال التحديات العملية
            </p>
          </div>
          <UpdatedSignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <CyberSecurityApp />
      </Authenticated>
    </div>
  );
}
