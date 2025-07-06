"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { NafathLogin } from "./NafathLogin";

export function UpdatedSignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);
  const [showNafath, setShowNafath] = useState(false);

  const handleNafathSuccess = async (userData: any) => {
    try {
      // في التطبيق الحقيقي، ستحتاج لإرسال بيانات نفاذ للخادم للتحقق
      // هنا سنستخدم تسجيل الدخول المجهول مع بيانات إضافية
      await signIn("anonymous");
      toast.success(`مرحباً ${userData.name}! تم تسجيل الدخول بنجاح عبر نفاذ الموحد`);
      setShowNafath(false);
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الدخول");
    }
  };

  return (
    <>
      {showNafath && (
        <NafathLogin
          onSuccess={handleNafathSuccess}
          onCancel={() => setShowNafath(false)}
        />
      )}
      
      <div className="w-full">
        {/* Nafath Login Button */}
        <button
          onClick={() => setShowNafath(true)}
          className="w-full mb-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
        >
          <span className="text-xl">🇸🇦</span>
          <span>تسجيل الدخول عبر نفاذ الموحد</span>
        </button>

        <div className="flex items-center justify-center my-4">
          <hr className="grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">أو</span>
          <hr className="grow border-gray-300" />
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitting(true);
            const formData = new FormData(e.target as HTMLFormElement);
            formData.set("flow", flow);
            void signIn("password", formData).catch((error) => {
              let toastTitle = "";
              if (error.message.includes("Invalid password")) {
                toastTitle = "كلمة مرور خاطئة. يرجى المحاولة مرة أخرى.";
              } else {
                toastTitle =
                  flow === "signIn"
                    ? "لا يمكن تسجيل الدخول، هل تقصد إنشاء حساب جديد؟"
                    : "لا يمكن إنشاء الحساب، هل تقصد تسجيل الدخول؟";
              }
              toast.error(toastTitle);
              setSubmitting(false);
            });
          }}
        >
          <input
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-shadow shadow-sm hover:shadow text-right"
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            required
          />
          <input
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-shadow shadow-sm hover:shadow text-right"
            type="password"
            name="password"
            placeholder="كلمة المرور"
            required
          />
            <button 
            className="w-full px-4 py-3 rounded-lg text-white font-semibold hover:bg-[#b3a369] transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            type="submit" 
            disabled={submitting}
            style={{
              backgroundImage: "linear-gradient(90deg, #C2B280 0%, #b3a369 100%)",
              position: "relative", // Ensure parent is relative for absolute child
            }}
            >
              <span className="relative z-10">
              {flow === "signIn" ? "تسجيل الدخول" : "إنشاء حساب"}
              </span>
            </button>
            <div className="text-center text-sm text-[#C2B280]">
            <span>
              {flow === "signIn"
              ? "ليس لديك حساب؟ "
              : "لديك حساب بالفعل؟ "}
            </span>
            <button
              type="button"
              className="bg-green-600 text-white hover:bg-green-700 font-medium cursor-pointer rounded px-3 py-1 transition-colors ml-2"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            >
              {flow === "signIn" ? "إنشاء حساب جديد" : "تسجيل الدخول"}
            </button>
            </div>
        </form>
        
        <div className="flex items-center justify-center my-4">
          <hr className="grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">أو</span>
          <hr className="grow border-gray-300" />
        </div>
        
        <button 
          className="w-full px-4 py-3 rounded-lg text-white font-semibold hover:bg-[#a08d4f] transition-colors shadow-sm hover:shadow relative overflow-hidden" 
          onClick={() => void signIn("anonymous")}
          style={{
            backgroundImage: "linear-gradient(90deg, #a08d4f 0%, #8c7a3a 100%)",
            position: "relative",
          }}
        >
          <span className="relative z-10">دخول كضيف</span>
        </button>
      </div>
    </>
  );
}
