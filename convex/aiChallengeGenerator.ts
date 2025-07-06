import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

// Generate new challenges using AI
export const generateChallenges = action({
  args: {
    category: v.string(),
    difficulty: v.string(),
    count: v.number(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; challengeIds: any[]; count: number }> => {
    const prompt = `
أنشئ ${args.count} تحديات أمن سيبراني في فئة "${args.category}" بمستوى صعوبة "${args.difficulty}".

المتطلبات:
- كل تحدي يجب أن يكون عملي وواقعي
- يجب أن يحتوي على سيناريو واضح
- الحل يجب أن يكون محدد ودقيق
- 3 تلميحات تدريجية لكل تحدي
- النقاط حسب الصعوبة: مبتدئ (50-150)، متوسط (150-300)، متقدم (300-500)، خبير (500-800)

أرجع النتيجة بصيغة JSON array مع هذا التنسيق:
[
  {
    "title": "عنوان التحدي",
    "description": "وصف مختصر للتحدي",
    "content": "محتوى التحدي بصيغة HTML مع السيناريو والتفاصيل",
    "solution": "الحل الصحيح",
    "hints": ["تلميح 1", "تلميح 2", "تلميح 3"],
    "points": 200
  }
]

الفئات المتاحة: web, network, cryptography, forensics, reverse-engineering
المستويات: beginner, intermediate, advanced, expert
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error("No content generated");

      // Parse the JSON response
      const challenges = JSON.parse(content);
      
      // Add the challenges to database
      const challengeIds: any[] = [];
      for (const challenge of challenges) {
        const challengeId: any = await ctx.runMutation(internal.aiChallengeGenerator.addGeneratedChallenge, {
          title: challenge.title,
          description: challenge.description,
          category: args.category,
          difficulty: args.difficulty,
          points: challenge.points,
          content: challenge.content,
          solution: challenge.solution,
          hints: challenge.hints,
        });
        challengeIds.push(challengeId);
      }

      return { success: true, challengeIds, count: challenges.length };
    } catch (error) {
      console.error("Error generating challenges:", error);
      throw new Error("فشل في إنشاء التحديات. يرجى المحاولة مرة أخرى.");
    }
  },
});

// Add generated challenge to database
export const addGeneratedChallenge = internalMutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    difficulty: v.string(),
    points: v.number(),
    content: v.string(),
    solution: v.string(),
    hints: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("challenges", {
      title: args.title,
      description: args.description,
      category: args.category,
      difficulty: args.difficulty,
      points: args.points,
      content: args.content,
      solution: args.solution,
      hints: args.hints,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

// Generate random challenge suggestions
export const getChallengeSuggestions = action({
  args: {},
  handler: async (ctx) => {
    const categories = ["web", "network", "cryptography", "forensics", "reverse-engineering"];
    const difficulties = ["beginner", "intermediate", "advanced", "expert"];
    
    const suggestions = [];
    for (let i = 0; i < 5; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      suggestions.push({ category, difficulty });
    }
    
    return suggestions;
  },
});
