import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  
  const userStats = useQuery(api.users.getUserStats);
  const createUserProfile = useMutation(api.users.createUserProfile);

  if (!userStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      toast.error("يرجى إدخال اسم مستخدم صحيح");
      return;
    }

    try {
      await createUserProfile({ username: newUsername.trim() });
      toast.success("تم تحديث اسم المستخدم بنجاح");
      setIsEditing(false);
      setNewUsername("");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث اسم المستخدم");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">الملف الشخصي</h1>
        <p className="text-gray-400">إدارة معلوماتك الشخصية وإحصائياتك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Info */}
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">المعلومات الشخصية</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userStats.profile?.username?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">اسم المستخدم</label>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder={userStats.profile?.username || "اسم المستخدم"}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateUsername}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setNewUsername("");
                      }}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg">{userStats.profile?.username || "غير محدد"}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    تعديل
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">المستوى</label>
              <span className="text-cyan-400 text-xl font-bold">{userStats.profile?.level || 1}</span>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">إجمالي النقاط</label>
              <span className="text-yellow-400 text-xl font-bold">{userStats.profile?.totalPoints || 0}</span>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">تاريخ الانضمام</label>
              <span className="text-gray-300">
                {userStats.profile?.createdAt 
                  ? new Date(userStats.profile.createdAt).toLocaleDateString('ar-SA')
                  : "غير محدد"
                }
              </span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">الإحصائيات</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-purple-600/10 rounded-lg">
              <span className="text-gray-300">إجمالي المحاولات</span>
              <span className="text-white font-semibold">{userStats.totalAttempts}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-600/10 rounded-lg">
              <span className="text-gray-300">معدل النجاح</span>
              <span className="text-green-400 font-semibold">{userStats.successRate}%</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-cyan-600/10 rounded-lg">
              <span className="text-gray-300">التحديات المكتملة</span>
              <span className="text-cyan-400 font-semibold">{userStats.profile?.completedChallenges.length || 0}</span>
            </div>
          </div>

          {/* Category Progress */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-white mb-4">التقدم حسب الفئة</h4>
            <div className="space-y-3">
              {Object.entries(userStats.categoryStats).map(([category, stats]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 capitalize">{category}</span>
                    <span className="text-gray-400">{stats.completed}/{stats.total}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {userStats.recentSubmissions.length > 0 && (
        <div className="mt-8 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">النشاط الأخير</h3>
          <div className="space-y-3">
            {userStats.recentSubmissions.map((submission, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <div>
                  <span className={`text-sm ${submission.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {submission.isCorrect ? '✅ إجابة صحيحة' : '❌ إجابة خاطئة'}
                  </span>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(submission.submittedAt).toLocaleString('ar-SA')}
                  </p>
                </div>
                <span className="text-yellow-400 font-semibold">
                  {submission.pointsEarned} نقطة
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
