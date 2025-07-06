import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

import { Id } from "../../convex/_generated/dataModel";

interface ChallengeDetailProps {
  challengeId: Id<"challenges">;
  onBack: () => void;
}

export function ChallengeDetail({ challengeId, onBack }: ChallengeDetailProps) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [startTime] = useState(Date.now());
  const [hintsUsed, setHintsUsed] = useState(0);
  
  const challenge = useQuery(api.challenges.getChallenge, { challengeId });
  const submitAnswer = useMutation(api.challenges.submitAnswer);

  if (!challenge) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error("يرجى إدخال إجابة");
      return;
    }

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const result = await submitAnswer({
        challengeId,
        answer: answer.trim(),
        timeSpent,
        hintsUsed,
      });

      if (result.isCorrect) {
        toast.success(`إجابة صحيحة! حصلت على ${result.pointsEarned} نقطة`);
        setTimeout(() => onBack(), 2000);
      } else {
        toast.error(`إجابة خاطئة. الإجابة الصحيحة: ${result.correctAnswer}`);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الإجابة");
    }
  };

  const handleShowHint = () => {
    if (currentHintIndex < challenge.hints.length) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
    }
  };

  const handleNextHint = () => {
    if (currentHintIndex < challenge.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
      setHintsUsed(prev => prev + 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-400 bg-green-400/10 border-green-400/30";
      case "intermediate": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "advanced": return "text-orange-400 bg-orange-400/10 border-orange-400/30";
      case "expert": return "text-red-400 bg-red-400/10 border-red-400/30";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/30";
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-400 hover:text-green-300 mb-4 transition-colors"
        >
          <span>←</span>
          <span>العودة للتحديات</span>
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{challenge.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-sm px-3 py-1 rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </span>
              <span className="text-purple-400">{challenge.category}</span>
              <span className="text-yellow-400 flex items-center gap-1">
                <span>⭐</span>
                <span>{challenge.points} نقطة</span>
              </span>
            </div>
          </div>
          
          {"isCompleted" in challenge && challenge.isCompleted && (
            <div className="text-green-400 text-3xl">✅</div>
          )}
        </div>
        
        <p className="text-gray-400 text-lg">{challenge.description}</p>
      </div>

      {/* Challenge Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">التحدي</h3>
          <div 
            className="text-gray-300 challenge-content"
            dangerouslySetInnerHTML={{ __html: challenge.content }}
          />
        </div>

        <div className="space-y-6">
          {/* Answer Input */}
          <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">إجابتك</h3>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="اكتب إجابتك هنا..."
              className="w-full h-32 bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
            />
            <button
              onClick={handleSubmit}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-lg font-semibold transition-all duration-200"
            >
              إرسال الإجابة
            </button>
          </div>

          {/* Hints */}
          <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">التلميحات</h3>
            
            {!showHint ? (
              <button
                onClick={handleShowHint}
                className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-400 py-3 rounded-lg transition-colors"
              >
                إظهار تلميح (-10 نقاط)
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-300">
                    💡 {challenge.hints[currentHintIndex]}
                  </p>
                </div>
                
                {currentHintIndex < challenge.hints.length - 1 && (
                  <button
                    onClick={handleNextHint}
                    className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-400 py-2 rounded-lg transition-colors text-sm"
                  >
                    تلميح آخر (-10 نقاط)
                  </button>
                )}
                
                <p className="text-gray-400 text-sm text-center">
                  استخدمت {hintsUsed} تلميح
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
          {"userAttempts" in challenge && challenge.userAttempts > 0 && (
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">إحصائياتك</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">المحاولات:</span>
                  <span className="text-white">{"userAttempts" in challenge ? challenge.userAttempts : 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">أفضل نتيجة:</span>
                  <span className="text-yellow-400">{"userBestScore" in challenge ? challenge.userBestScore : 0} نقطة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">الحالة:</span>
                  <span className={"isCompleted" in challenge && challenge.isCompleted ? "text-green-400" : "text-orange-400"}>
                    {"isCompleted" in challenge && challenge.isCompleted ? "مكتمل" : "غير مكتمل"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
