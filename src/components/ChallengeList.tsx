import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { Id } from "../../convex/_generated/dataModel";

interface ChallengeListProps {
  onSelectChallenge: (challengeId: Id<"challenges">) => void;
}

export function ChallengeList({ onSelectChallenge }: ChallengeListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  
  const challenges = useQuery(api.challenges.getAllChallenges);

  if (!challenges) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  const categories = [
    { id: "all", label: "جميع الفئات", icon: "🔍" },
    { id: "web", label: "أمان الويب", icon: "🌐" },
    { id: "network", label: "أمان الشبكات", icon: "🔗" },
    { id: "cryptography", label: "التشفير", icon: "🔐" },
    { id: "forensics", label: "الطب الشرعي الرقمي", icon: "🔬" },
    { id: "reverse-engineering", label: "الهندسة العكسية", icon: "⚙️" },
  ];

  const difficulties = [
    { id: "all", label: "جميع المستويات", color: "text-gray-400" },
    { id: "beginner", label: "مبتدئ", color: "text-green-400" },
    { id: "intermediate", label: "متوسط", color: "text-yellow-400" },
    { id: "advanced", label: "متقدم", color: "text-orange-400" },
    { id: "expert", label: "خبير", color: "text-red-400" },
  ];

  const filteredChallenges = challenges.filter(challenge => {
    const categoryMatch = selectedCategory === "all" || challenge.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === "all" || challenge.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-400 bg-green-400/10 border-green-400/30";
      case "intermediate": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "advanced": return "text-orange-400 bg-orange-400/10 border-orange-400/30";
      case "expert": return "text-red-400 bg-red-400/10 border-red-400/30";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || "🎯";
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">التحديات</h1>
        <p className="text-gray-400">اختبر مهاراتك في الأمن السيبراني</p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div>
          <h3 className="text-white font-semibold mb-3">الفئات</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedCategory === category.id
                    ? "bg-purple-600/30 text-purple-300 border-purple-500/50"
                    : "bg-black/20 text-gray-400 border-gray-600/30 hover:bg-white/5"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">مستوى الصعوبة</h3>
          <div className="flex flex-wrap gap-2">
            {difficulties.map(difficulty => (
              <button
                key={difficulty.id}
                onClick={() => setSelectedDifficulty(difficulty.id)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedDifficulty === difficulty.id
                    ? "bg-purple-600/30 text-purple-300 border-purple-500/50"
                    : "bg-black/20 text-gray-400 border-gray-600/30 hover:bg-white/5"
                }`}
              >
                <span className={difficulty.color}>{difficulty.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map(challenge => (
          <div
            key={challenge._id}
            className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-200 cursor-pointer"
            onClick={() => onSelectChallenge(challenge._id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
                <div>
                  <h3 className="text-white font-semibold text-lg">{challenge.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
              </div>
              {challenge.isCompleted && (
                <div className="text-green-400 text-xl">✅</div>
              )}
            </div>

            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {challenge.description}
            </p>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-yellow-400">
                <span>⭐</span>
                <span className="text-sm">{challenge.points} نقطة</span>
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200">
                {challenge.isCompleted ? "مراجعة" : "ابدأ"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">لا توجد تحديات</h3>
          <p className="text-gray-400">جرب تغيير المرشحات للعثور على تحديات أخرى</p>
        </div>
      )}
    </div>
  );
}
