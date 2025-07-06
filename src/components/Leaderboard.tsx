import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Leaderboard() {
  const leaderboard = useQuery(api.users.getLeaderboard, { limit: 20 });

  if (!leaderboard) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case 2: return "text-gray-300 bg-gray-300/10 border-gray-300/30";
      case 3: return "text-orange-400 bg-orange-400/10 border-orange-400/30";
      default: return "text-purple-400 bg-purple-400/10 border-purple-400/30";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">المتصدرون</h1>
        <p className="text-gray-400">أفضل المتعلمين في الأمن السيبراني</p>
      </div>

      {/* Top 3 */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {leaderboard.slice(0, 3).map((user, index) => (
            <div
              key={user._id}
              className={`bg-black/40 backdrop-blur-sm border rounded-xl p-6 text-center ${getRankColor(user.rank)}`}
            >
              <div className="text-4xl mb-4">{getRankIcon(user.rank)}</div>
              <h3 className="text-xl font-bold text-white mb-2">{user.username}</h3>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{user.totalPoints}</p>
                <p className="text-sm opacity-75">نقطة</p>
                <p className="text-sm opacity-75">{user.completedChallenges.length} تحدي مكتمل</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-purple-500/20">
          <h3 className="text-xl font-semibold text-white">جميع المتصدرين</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-600/10">
              <tr>
                <th className="text-right p-4 text-purple-300 font-semibold">الترتيب</th>
                <th className="text-right p-4 text-purple-300 font-semibold">المستخدم</th>
                <th className="text-right p-4 text-purple-300 font-semibold">النقاط</th>
                <th className="text-right p-4 text-purple-300 font-semibold">المستوى</th>
                <th className="text-right p-4 text-purple-300 font-semibold">التحديات المكتملة</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr
                  key={user._id}
                  className={`border-b border-purple-500/10 hover:bg-purple-600/5 transition-colors ${
                    index < 3 ? "bg-gradient-to-r from-purple-600/5 to-transparent" : ""
                  }`}
                >
                  <td className="p-4">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankColor(user.rank)}`}>
                      {getRankIcon(user.rank)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{user.username}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-yellow-400 font-bold text-lg">{user.totalPoints}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-cyan-400 font-semibold">{user.level}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-green-400">{user.completedChallenges.length}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-white mb-2">لا يوجد متصدرون بعد</h3>
          <p className="text-gray-400">كن أول من يكمل التحديات ويظهر في المتصدرين!</p>
        </div>
      )}
    </div>
  );
}
