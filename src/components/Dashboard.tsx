import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";
import { CyberSimulator } from "./CyberSimulator";

type View = "dashboard" | "challenges" | "leaderboard" | "profile";

interface DashboardProps {
  onNavigate: (view: View) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [showSimulator, setShowSimulator] = useState(false);
  const [showChallengeGenerator, setShowChallengeGenerator] = useState(false);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
        <p className="text-gray-400">تتبع تقدمك في تعلم الأمن السيبراني</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm">إجمالي النقاط</p>
              <p className="text-2xl font-bold text-white">{userStats.profile?.totalPoints || 0}</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300 text-sm">المستوى</p>
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

        <div className="bg-gradient-to-r from-orange-600/20 to-orange-800/20 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300 text-sm">معدل النجاح</p>
              <p className="text-2xl font-bold text-white">{userStats.successRate}%</p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">التقدم العام</h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>مكتمل</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            لقد أكملت {completedChallenges} من أصل {totalChallenges} تحدي
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
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
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <button
            onClick={() => onNavigate("challenges")}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-lg transition-all duration-200 text-center"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold">ابدأ تحدي جديد</div>
          </button>
          
          <button
            onClick={() => onNavigate("leaderboard")}
            className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-6 py-4 rounded-lg transition-all duration-200 text-center"
          >
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-semibold">عرض المتصدرين</div>
          </button>
          
          <button
            onClick={() => onNavigate("profile")}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-lg transition-all duration-200 text-center"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="font-semibold">الملف الشخصي</div>
          </button>

          {challenges.length <= 4 && (
            <button
              onClick={handleAddMoreChallenges}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-4 rounded-lg transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">➕</div>
              <div className="font-semibold">إضافة تحديات جديدة</div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
