import { useState } from "react";
import { toast } from "sonner";

interface NafathLoginProps {
  onSuccess: (userData: any) => void;
  onCancel: () => void;
}

export function NafathLogin({ onSuccess, onCancel }: NafathLoginProps) {
  const [step, setStep] = useState<"phone" | "otp" | "loading">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error("يرجى إدخال رقم الهوية الصحيح (10 أرقام)");
      return;
    }

    setIsLoading(true);
    // محاكاة إرسال OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      toast.success("تم إرسال رمز التحقق إلى جوالك");
    }, 2000);
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("يرجى إدخال رمز التحقق المكون من 6 أرقام");
      return;
    }

    setIsLoading(true);
    setStep("loading");
    
    // محاكاة التحقق من OTP والحصول على بيانات المستخدم
    setTimeout(() => {
      const mockUserData = {
        nationalId: "1234567890",
        name: "أحمد محمد العلي",
        phone: phoneNumber,
        email: "ahmed.ali@example.com",
        nafathVerified: true
      };
      
      onSuccess(mockUserData);
      toast.success("تم تسجيل الدخول بنجاح عبر نفاذ الموحد");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🇸🇦</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">نفاذ الموحد</h2>
          <p className="text-gray-600">تسجيل الدخول الآمن للخدمات الحكومية</p>
        </div>

        {step === "phone" && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                رقم الهوية
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="1xxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
                  dir="ltr"
                />
                <span className="absolute left-3 top-3 text-gray-500">🇸🇦</span>
              </div>
            </div>
            
            <button
              onClick={handlePhoneSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                رمز التحقق
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest"
                maxLength={6}
              />
              <p className="text-sm text-gray-600 mt-2 text-center">
                تم إرسال الرمز إلى {phoneNumber}
              </p>
            </div>
            
            <button
              onClick={handleOtpSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? "جاري التحقق..." : "تأكيد"}
            </button>
            
            <button
              onClick={() => setStep("phone")}
              className="w-full text-green-600 hover:text-green-700 py-2 text-sm"
            >
              تغيير رقم الهوية
            </button>
          </div>
        )}

        {step === "loading" && (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600">جاري التحقق من هويتك...</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>✓ التحقق من رقم الهوية</p>
              <p>✓ التحقق من الهوية الوطنية</p>
              <p className="animate-pulse">⏳ جاري تسجيل الدخول...</p>
            </div>
          </div>
        )}

        <button
          onClick={onCancel}
          className="w-full mt-4 text-gray-500 hover:text-gray-700 py-2 text-sm"
        >
          إلغاء
        </button>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            خدمة آمنة مقدمة من الهيئة السعودية للبيانات والذكاء الاصطناعي
          </p>
        </div>
      </div>
    </div>
  );
}
