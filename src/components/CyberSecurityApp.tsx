// CyberSecurityApp.tsx
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { NewDashboard } from "./NewDashboard";
import { ChallengeList } from "./ChallengeList";
import { ChallengeDetail } from "./ChallengeDetail";
import { Leaderboard } from "./Leaderboard";
import { UserProfile } from "./UserProfile";
import React from "react";

// ✅ نموذج الاشتراك المنبثق
function SubscriptionModal({ isOpen, onClose, plan }: { isOpen: boolean; onClose: () => void; plan: string }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#0c1f17] text-green-100 p-6 rounded-xl w-full max-w-md relative border border-green-600 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-red-400 hover:text-red-600 font-bold text-xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-green-300">طلب اشتراك - {plan}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("📩 تم إرسال طلب الاشتراك (تجريبي)");
            onClose();
          }}
        >
          <label className="block mb-3">
            الاسم الكامل
            <input
              type="text"
              className="w-full mt-1 p-2 rounded bg-black text-green-100 border border-green-700"
              required
            />
          </label>
          <label className="block mb-3">
            البريد الإلكتروني
            <input
              type="email"
              className="w-full mt-1 p-2 rounded bg-black text-green-100 border border-green-700"
              required
            />
          </label>
          <label className="block mb-3">
            رقم الجوال
            <input
              type="tel"
              className="w-full mt-1 p-2 rounded bg-black text-green-100 border border-green-700"
              required
            />
          </label>
          <div className="mt-4 mb-2 text-yellow-300 text-sm">
            <p>معلومات التحويل البنكي (تجريبية):</p>
            <p>اسم البنك: بنك الأمن الرقمي</p>
            <p>الآيبان: SA00 0000 0000 0000 0000 0000</p>
            <p>اسم المستفيد: CybrainSA</p>
          </div>
          <button
            type="submit"
            className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 rounded font-bold text-white"
          >
            إرسال الطلب
          </button>
        </form>
      </div>
    </div>
  );
}

// دالة تفعيل النسخة
function activateWithCode(setIsUnlocked: (val: boolean) => void) {
  const code = prompt("أدخل كود التفعيل:");
  if (code === "elias207") {
    localStorage.setItem("isUnlocked", "true");
    alert("✅ تم تفعيل النسخة الكاملة!");
    setIsUnlocked(true);
  } else if (code === "lock123") {
    localStorage.setItem("isUnlocked", "false");
    alert("⚠️ تم قفل النسخة الآن!");
    setIsUnlocked(false);
  } else {
    alert("❌ الكود غير صحيح.");
  }
}

function SubscriptionPlans({ isUnlocked, onSubscribe }: { isUnlocked: boolean; onSubscribe: (plan: string) => void }) {
  const plans = [
    {
      id: "basic",
      name: "الأساسية",
      price: "99 ريال / شهر",
      features: ["✅ الوصول لتحديات محدودة", "✅ تتبع نقاطك وتقدمك", "❌ بدون توليد تحديات AI"],
      borderColor: "border-green-500",
    },
    {
      id: "pro",
      name: "برو",
      price: "199 ريال / شهر",
      features: ["✅ كل مزايا الأساسية", "✅ تحديات أكثر وتخصصات متنوعة", "✅ توليد تحديات بالذكاء الاصطناعي"],
      borderColor: "border-yellow-500",
      popular: true,
    },
    {
      id: "elite",
      name: "النخبة",
      price: "349 ريال / شهر",
      features: ["✅ كل مزايا برو", "✅ تقارير أداء تفصيلية", "✅ دعم مباشر + دخول فرق / مدربين"],
      borderColor: "border-yellow-300",
      featured: true,
    },
  ];

  return (
    <div className="p-8 text-right text-gray-200">
      <h1 className="text-3xl font-bold text-green-300 mb-6">باقات الاشتراك</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-[#0c1f17] border-t-4 ${plan.borderColor} rounded-xl p-6 w-72 shadow-lg hover:scale-105 transition relative`}
          >
            {plan.popular && (
              <span className="absolute top-[-10px] left-[-10px] bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-bold">
                الأكثر شيوعًا
              </span>
            )}
            {plan.featured && (
              <span className="absolute top-[-10px] left-[-10px] bg-yellow-300 text-black text-xs px-3 py-1 rounded-full font-bold">
                الأكثر تميزًا
              </span>
            )}
            <h2 className="text-xl font-bold text-green-400 mb-2">{plan.name}</h2>
            <p className="text-sm text-green-100 mb-4" style={{ lineHeight: "1.6" }}>
              {plan.features.map((f, i) => (
                <span key={i}>
                  {f}
                  <br />
                </span>
              ))}
            </p>
            <p className="font-bold text-lg">{plan.price}</p>
            <button
              disabled={!isUnlocked}
              onClick={() => onSubscribe(plan.name)}
              className={`w-full mt-4 py-2 rounded font-semibold ${
                isUnlocked ? "bg-green-600 hover:bg-green-700 cursor-pointer" : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              اشترك الآن
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-center gap-3">
        {!isUnlocked && (
          <p className="text-yellow-400 font-bold">مزايا الاشتراك مقفلة، يرجى التفعيل للمزايا الكاملة.</p>
        )}
      </div>
    </div>
  );
}

function DeveloperFeatures({ onLock }: { onLock: () => void }) {
  return (
    <div className="p-8 text-green-300">
      <h1 className="text-3xl font-bold mb-6">ميزات المطور (مفعلة)</h1>
      <ul className="list-disc list-inside mb-6">
        <li>الوصول الكامل لكل التحديات</li>
        <li>توليد تحديات بالذكاء الاصطناعي</li>
        <li>تحكم كامل في المستخدمين والإعدادات</li>
        <li>مميزات إضافية خاصة بالمطورين</li>
      </ul>
      <button onClick={onLock} className="px-4 py-2 bg-red-600 rounded text-white font-bold hover:bg-red-700 transition">
        قفل المزايا
      </button>
    </div>
  );
}

function About() {
  return (
    <div className="p-8 text-green-300 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">نبذة عن CybrainSA</h1>
      <p className="mb-4 leading-relaxed">
        CybrainSA هو موقع متكامل لتعلم الأمن السيبراني، مصمم بشغف وعناية ليقدم لك أفضل المحتوى والتحديات. كل شيء في
        هذا الموقع عمل فردي من مطور متخصص يسعى لرفع مستوى مهاراتك بأحدث التقنيات.
      </p>
      <p className="mb-4 leading-relaxed">
        انضم إلى مجتمعنا واكتشف تحديات متنوعة، متجددة، مع دعم مستمر وفرص تعلم تفاعلية. نسعى لأن نكون وجهتك الأولى
        لتطوير مهاراتك في الأمن السيبراني.
      </p>
      <p className="text-sm text-yellow-400">ملاحظة: هذا الموقع عمل فردي، لذلك يرجى تفهم أي تأخير في الدعم أو التحديثات.</p>
    </div>
  );
}

// =========================================
// ✅ المكون الرئيسي
export function CyberSecurityApp() {
  const [currentView, setCurrentView] = useState<any>("dashboard");
  const [selectedChallengeId, setSelectedChallengeId] = useState<Id<"challenges"> | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => localStorage.getItem("isUnlocked") === "true");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const userProfile = useQuery(api.users.getUserProfile);
  const initializeChallenges = useMutation(api.challenges.initializeChallenges);

  useEffect(() => {
    initializeChallenges();
  }, [initializeChallenges]);

  const renderContent = () => {
    if (selectedChallengeId) {
      if (!isUnlocked) {
        return (
          <div className="p-8 text-center text-yellow-400">
            <h2>يجب تفعيل النسخة الكاملة للوصول إلى تفاصيل التحديات.</h2>
          </div>
        );
      }
      return <ChallengeDetail challengeId={selectedChallengeId} onBack={() => setSelectedChallengeId(null)} />;
    }

    switch (currentView) {
      case "dashboard":
        return isUnlocked ? (
          <NewDashboard onNavigate={setCurrentView} />
        ) : (
          <div className="p-8 text-center text-yellow-400">لوحة التحكم مقفلة حتى يتم التفعيل.</div>
        );
      case "challenges":
        return isUnlocked ? (
          <ChallengeList onSelectChallenge={setSelectedChallengeId} />
        ) : (
          <div className="p-8 text-center text-yellow-400">التحديات مقفلة حتى يتم التفعيل.</div>
        );
      case "leaderboard":
        return isUnlocked ? <Leaderboard /> : <div className="p-8 text-center text-yellow-400">المتصدرين مقفلة.</div>;
      case "profile":
        return isUnlocked ? <UserProfile /> : <div className="p-8 text-center text-yellow-400">الملف الشخصي مقفل.</div>;
      case "news":
        return <div className="p-8 text-green-300">الأخبار قريبًا...</div>;
      case "chat":
        return <div className="p-8 text-green-300">الدردشة قريبًا...</div>;
      case "subscriptions":
        return (
          <>
            <SubscriptionPlans
              isUnlocked={isUnlocked}
              onSubscribe={(plan) => {
                setSelectedPlan(plan);
                setShowSubscriptionModal(true);
              }}
            />
            <SubscriptionModal
              isOpen={showSubscriptionModal}
              onClose={() => setShowSubscriptionModal(false)}
              plan={selectedPlan}
            />
          </>
        );
      case "developer":
        return isUnlocked ? (
          <DeveloperFeatures
            onLock={() => {
              localStorage.setItem("isUnlocked", "false");
              setIsUnlocked(false);
              setCurrentView("dashboard");
              alert("⚠️ تم قفل النسخة الآن!");
            }}
          />
        ) : (
          <div className="p-8 text-center text-yellow-300">
            <h2>للوصول لميزات المطور، يرجى التفعيل.</h2>
            <button
              onClick={() => activateWithCode(setIsUnlocked)}
              className="mt-4 px-4 py-2 bg-yellow-400 rounded text-black font-bold"
            >
              أدخل كود التفعيل أو القفل
            </button>
          </div>
        );
      case "about":
        return <About />;
      default:
        return <NewDashboard onNavigate={setCurrentView} />;
    }
  };

  const navigation = [
    { id: "dashboard", label: "لوحة التحكم", icon: "📊" },
    { id: "challenges", label: "التحديات", icon: "🎯" },
    { id: "leaderboard", label: "المتصدرين", icon: "🏆" },
    { id: "profile", label: "الملف الشخصي", icon: "👤" },
    { id: "news", label: "الأخبار", icon: "📰" },
    { id: "chat", label: "الدردشة", icon: "💬" },
    { id: "subscriptions", label: "الاشتراكات", icon: "💳" },
    { id: "developer", label: "مطور", icon: "👨‍💻" },
    { id: "about", label: "نبذة", icon: "ℹ️" },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-black/40 backdrop-blur-sm border-r border-green-500/20">
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-2">مرحباً</h3>
            <p className="text-green-300 text-sm">{userProfile?.username || "المتعلم"}</p>
            <div className="mt-2 text-xs text-gray-400">
              المستوى {userProfile?.level || 1} • {userProfile?.totalPoints || 0} نقطة
            </div>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as any);
                  setSelectedChallengeId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${
                  currentView === item.id && !selectedChallengeId
                    ? "bg-green-600/30 text-green-300 border border-green-500/30"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  );
}
