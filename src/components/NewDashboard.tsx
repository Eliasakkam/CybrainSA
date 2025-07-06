import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";
import { CyberSimulator } from "./CyberSimulator";

type View = "dashboard" | "challenges" | "leaderboard" | "profile";

interface DashboardProps {
  onNavigate: (view: View) => void;
}

export function NewDashboard({ onNavigate }: DashboardProps) {
  const [showSimulator, setShowSimulator] = useState(false);
  const [showChallengeGenerator, setShowChallengeGenerator] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [generatorForm, setGeneratorForm] = useState({
    category: "web",
    difficulty: "beginner",
    count: 3
  });
  
  const userStats = useQuery(api.users.getUserStats);
  const challenges = useQuery(api.challenges.getAllChallenges);
  const addMoreChallenges = useMutation(api.additionalChallenges.addMoreChallenges);
  const generateChallenges = useAction(api.aiChallengeGenerator.generateChallenges);

  if (!userStats || !challenges) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </div>
    );
  }

  const totalChallenges = challenges.length;
  const completedChallenges = userStats.profile?.completedChallenges.length || 0;
  const progressPercentage = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

  const difficultyStats = {
    beginner: challenges.filter(c => c.difficulty === "beginner").length,
    intermediate: challenges.filter(c => c.difficulty === "intermediate").length,
    advanced: challenges.filter(c => c.difficulty === "advanced").length,
    expert: challenges.filter(c => c.difficulty === "expert").length,
  };

  const handleAddMoreChallenges = async () => {
    try {
      await addMoreChallenges();
      toast.success("تم إضافة المزيد من التحديات بنجاح! 🎯");
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة التحديات");
    }
  };

  const handleGenerateChallenges = async () => {
    try {
      toast.loading("جاري إنشاء التحديات بالذكاء الاصطناعي...");
      const result = await generateChallenges(generatorForm);
      toast.dismiss();
      toast.success(`تم إنشاء ${result.count} تحديات جديدة بنجاح! 🤖`);
      setShowChallengeGenerator(false);
    } catch (error) {
      toast.dismiss();
      toast.error("فشل في إنشاء التحديات. تأكد من إعدادات الذكاء الاصطناعي.");
    }
  };

  return (
    <>
      {showSimulator && <CyberSimulator onClose={() => setShowSimulator(false)} />}
      
      {showChallengeGenerator && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-green-500/30 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🤖 مولد التحديات بالذكاء الاصطناعي
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-green-400 text-sm mb-2">الفئة</label>
                <select
                  value={generatorForm.category}
                  onChange={(e) => setGeneratorForm({...generatorForm, category: e.target.value})}
                  className="w-full bg-gray-800 border border-green-500/30 rounded-lg p-3 text-white"
                >
                  <option value="web">أمان الويب</option>
                  <option value="network">أمان الشبكات</option>
                  <option value="cryptography">التشفير</option>
                  <option value="forensics">الطب الشرعي الرقمي</option>
                  <option value="reverse-engineering">الهندسة العكسية</option>
                </select>
              </div>
              
              <div>
                <label className="block text-green-400 text-sm mb-2">مستوى الصعوبة</label>
                <select
                  value={generatorForm.difficulty}
                  onChange={(e) => setGeneratorForm({...generatorForm, difficulty: e.target.value})}
                  className="w-full bg-gray-800 border border-green-500/30 rounded-lg p-3 text-white"
                >
                  <option value="beginner">مبتدئ</option>
                  <option value="intermediate">متوسط</option>
                  <option value="advanced">متقدم</option>
                  <option value="expert">خبير</option>
                </select>
              </div>
              
              <div>
                <label className="block text-green-400 text-sm mb-2">عدد التحديات</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={generatorForm.count}
                  onChange={(e) => setGeneratorForm({...generatorForm, count: parseInt(e.target.value)})}
                  className="w-full bg-gray-800 border border-green-500/30 rounded-lg p-3 text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleGenerateChallenges}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition-all duration-200"
              >
                إنشاء التحديات
              </button>
              <button
                onClick={() => setShowChallengeGenerator(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            🇸🇦 لوحة التحكم -  سايبرين السعودية CybrainSA
          </h1>
          <p className="text-gray-400">تتبع تقدمك في تعلم الأمن السيبراني وحماية الوطن السعودي الرقمي</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">إجمالي النقاط</p>
                <p className="text-2xl font-bold text-white">{userStats.profile?.totalPoints || 0}</p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">المستوى</p>
                <p className="text-2xl font-bold text-white">{userStats.profile?.level || 1}</p>
              </div>
              <div className="text-3xl">🎖️</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">التحديات المكتملة</p>
                <p className="text-2xl font-bold text-white">{completedChallenges}/{totalChallenges}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm">معدل النجاح</p>
                <p className="text-2xl font-bold text-white">{userStats.successRate}%</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">التقدم العام</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>مكتمل</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              لقد أكملت {completedChallenges} من أصل {totalChallenges} تحدي
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">التحديات حسب المستوى</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-400">مبتدئ</span>
                <span className="text-white">{difficultyStats.beginner}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">متوسط</span>
                <span className="text-white">{difficultyStats.intermediate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-400">متقدم</span>
                <span className="text-white">{difficultyStats.advanced}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-400">خبير</span>
                <span className="text-white">{difficultyStats.expert}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">الأدوات والإجراءات السريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <button
              onClick={() => onNavigate("challenges")}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-lg transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold text-sm">ابدأ تحدي جديد</div>
            </button>
            
            <button
              onClick={() => setShowSimulator(true)}
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-4 rounded-lg transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">💻</div>
              <div className="font-semibold text-sm">محاكي كالي لينكس</div>
            </button>
            
            <button
              onClick={() => setShowChallengeGenerator(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-lg transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-semibold text-sm">مولد التحديات AI</div>
            </button>
            
            <button
              onClick={() => onNavigate("leaderboard")}
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-4 rounded-lg transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-semibold text-sm">عرض المتصدرين</div>
            </button>
            
            <button
              onClick={() => onNavigate("profile")}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-lg transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">👤</div>
              <div className="font-semibold text-sm">الملف الشخصي</div>
            </button>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-4 rounded-lg transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">💡</div>
              <div className="font-semibold text-sm">الإقتراحات والشكاوى</div>
            </button>
          </div>
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-orange-500/30 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          💡 الإقتراحات والشكاوى
              </h3>
              <form
          onSubmit={async (e) => {
            e.preventDefault();
            // يمكنك هنا إرسال البيانات إلى السيرفر أو البريد الإلكتروني
            toast.success("تم إرسال ملاحظتك بنجاح! شكراً لك 🙏");
            setShowFeedbackModal(false);
          }}
          className="space-y-4"
              >
          <div>
            <label className="block text-orange-400 text-sm mb-2">ملاحظتك</label>
            <textarea
              required
              rows={4}
              className="w-full bg-gray-800 border border-orange-500/30 rounded-lg p-3 text-white"
              placeholder="اكتب اقتراحك أو شكواك هنا..."
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-3 rounded-lg font-semibold transition-all duration-200"
            >
              إرسال
            </button>
            <button
              type="button"
              onClick={() => setShowFeedbackModal(false)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
            >
              إلغاء
            </button>
          </div>
              </form>
            </div>
          </div>
        )}

        {/* Saudi Vision 2030 Section */}
        <div className="mt-8 bg-gradient-to-r from-green-600/10 to-white/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            🇸🇦 رؤية المملكة 2030 - الأمن السيبراني
          </h3>
          <p className="text-gray-300 mb-4">
            نساهم في تحقيق رؤية المملكة 2030 من خلال إعداد كوادر متخصصة في الأمن السيبراني لحماية الوطن الرقمي
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-600/20 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="text-white font-semibold">حماية البنية التحتية</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🎓</div>
              <div className="text-white font-semibold">تطوير المواهب</div>
            </div>
            <div className="bg-green-600/20 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-white font-semibold">الابتكار التقني</div>
            </div>
            <p className="text-gray-300 mb-4 text-center md:col-span-3">
              هاذا الموقع صمم من قبل طالب سعودي موهوب في مجال الأمن السيبراني والذكاء الاصطناعي وقام بعمل هاذا الموقع لمساعدة الناس لتعلم 
             وكسب المهارات الازمة في مجال الأمن السيبراني وامن المعلومات
            </p>
            <p className="text-gray-300 mb-4 text-center md:col-span-3">
              منصات التواصل الاجتماعي للمطور:
            </p>
            {/* مكان الصورة الشخصية */}
            <div className="flex flex-col items-center md:col-span-3 mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 bg-gray-800 flex items-center justify-center">
              {/* public/157.png */}
                {/* مثال: <img src="/my-photo.jpg" alt="صورة المطور" className="w-full h-full object-cover" /> */}
                <img src="/157.png" alt="157.png" className="public/157.png" />
              </div>
              {/* منصات التواصل الاجتماعي تحت الصورة بشكل أفقي */}
              <div className="flex justify-center gap-4 mt-4">
              {/* X (Twitter) */}
              <a
                href="https://x.com/ly0s1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center gap-2 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-lg transition-all duration-200 text-center"
                aria-label="حساب X"
              >
                X (Twitter)
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/ly0s1/profilecard/?igsh=MWZhYTFmaXRvNXVwdg=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white px-4 py-2 rounded-lg transition-all duration-200 text-center"
                aria-label="حساب انستقرام"
              >
                Instagram
              </a>
              {/* Snapchat */}
              <a
                href="https://snapchat.com/t/z39tuRMB"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg transition-all duration-200 text-center"
                aria-label="حساب سناب شات"
              >
                Snapchat
              </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
