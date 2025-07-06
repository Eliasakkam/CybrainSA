import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all challenges with user progress
export const getAllChallenges = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const challenges = await ctx.db.query("challenges")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    if (!userId) {
      return challenges.map(challenge => ({
        ...challenge,
        isCompleted: false,
        userBestScore: 0,
      }));
    }

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return challenges.map(challenge => ({
      ...challenge,
      isCompleted: userProfile?.completedChallenges.includes(challenge._id) || false,
      userBestScore: 0, // We'll calculate this from submissions
    }));
  },
});

// Get challenges by category
export const getChallengesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("challenges")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get challenges by difficulty
export const getChallengesByDifficulty = query({
  args: { difficulty: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("challenges")
      .withIndex("by_difficulty", (q) => q.eq("difficulty", args.difficulty))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get single challenge details
export const getChallenge = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, args) => {
    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) return null;

    const userId = await getAuthUserId(ctx);
    if (!userId) return challenge;

    // Get user's previous attempts
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_user_challenge", (q) => 
        q.eq("userId", userId).eq("challengeId", args.challengeId)
      )
      .collect();

    const bestSubmission = submissions
      .filter(s => s.isCorrect)
      .sort((a, b) => b.pointsEarned - a.pointsEarned)[0];

    return {
      ...challenge,
      userAttempts: submissions.length,
      userBestScore: bestSubmission?.pointsEarned || 0,
      isCompleted: !!bestSubmission,
    };
  },
});

// Submit challenge answer
export const submitAnswer = mutation({
  args: {
    challengeId: v.id("challenges"),
    answer: v.string(),
    timeSpent: v.number(),
    hintsUsed: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) throw new Error("Challenge not found");

    const isCorrect = args.answer.toLowerCase().trim() === challenge.solution.toLowerCase().trim();
    
    // Calculate points (reduce points for hints used and time taken)
    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned = challenge.points;
      pointsEarned -= (args.hintsUsed * 10); // -10 points per hint
      pointsEarned = Math.max(pointsEarned, challenge.points * 0.3); // Minimum 30% of points
    }

    // Record submission
    const submissionId = await ctx.db.insert("submissions", {
      userId,
      challengeId: args.challengeId,
      answer: args.answer,
      isCorrect,
      pointsEarned,
      timeSpent: args.timeSpent,
      hintsUsed: args.hintsUsed,
      submittedAt: Date.now(),
    });

    if (isCorrect) {
      // Update user profile
      let userProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();

      if (!userProfile) {
        // Create new profile
        const user = await ctx.db.get(userId);
        const newProfile = {
          userId,
          username: user?.email?.split('@')[0] || "Anonymous",
          level: 1,
          totalPoints: 0,
          completedChallenges: [],
          achievements: [],
          createdAt: Date.now(),
        };
        const profileId = await ctx.db.insert("userProfiles", newProfile);
        userProfile = await ctx.db.get(profileId);
      }

      // Update profile if this is first completion
      if (userProfile && !userProfile.completedChallenges.includes(args.challengeId)) {
        await ctx.db.patch(userProfile._id, {
          totalPoints: userProfile.totalPoints + pointsEarned,
          completedChallenges: [...userProfile.completedChallenges, args.challengeId],
          level: Math.floor((userProfile.totalPoints + pointsEarned) / 100) + 1,
        });
      }
    }

    return {
      isCorrect,
      pointsEarned,
      correctAnswer: isCorrect ? undefined : challenge.solution,
    };
  },
});

// Initialize default challenges
export const initializeChallenges = mutation({
  args: {},
  handler: async (ctx) => {
    const existingChallenges = await ctx.db.query("challenges").collect();
    if (existingChallenges.length > 0) return;

    const defaultChallenges = [
      {
        title: "SQL Injection Basics",
        description: "اكتشف ثغرة SQL Injection في نموذج تسجيل الدخول",
        category: "web",
        difficulty: "beginner",
        points: 100,
        content: `
          <div class="challenge-content">
            <h3>تحدي SQL Injection</h3>
            <p>لديك نموذج تسجيل دخول يستخدم الاستعلام التالي:</p>
            <code>SELECT * FROM users WHERE username='$username' AND password='$password'</code>
            <p>كيف يمكنك تجاوز المصادقة؟</p>
            <div class="mock-login">
              <input type="text" placeholder="اسم المستخدم" />
              <input type="password" placeholder="كلمة المرور" />
              <button>تسجيل الدخول</button>
            </div>
          </div>
        `,
        solution: "admin' OR '1'='1",
        hints: [
          "فكر في كيفية إنهاء الاستعلام مبكراً",
          "استخدم OR للحصول على شرط صحيح دائماً",
          "جرب: admin' OR '1'='1"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "XSS Attack",
        description: "اكتشف ثغرة Cross-Site Scripting",
        category: "web",
        difficulty: "beginner",
        points: 120,
        content: `
          <div class="challenge-content">
            <h3>تحدي XSS</h3>
            <p>يوجد حقل تعليق في الموقع لا يتم تنظيفه بشكل صحيح</p>
            <p>اكتب كود JavaScript لإظهار رسالة تنبيه</p>
            <textarea placeholder="اكتب تعليقك هنا..."></textarea>
            <button>إرسال التعليق</button>
          </div>
        `,
        solution: "<script>alert('XSS')</script>",
        hints: [
          "استخدم علامة script",
          "جرب إظهار رسالة تنبيه",
          "الحل: <script>alert('XSS')</script>"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "Password Cracking",
        description: "فك تشفير كلمة مرور مشفرة بـ MD5",
        category: "cryptography",
        difficulty: "intermediate",
        points: 200,
        content: `
          <div class="challenge-content">
            <h3>تحدي فك التشفير</h3>
            <p>لديك hash MD5 التالي:</p>
            <code>5d41402abc4b2a76b9719d911017c592</code>
            <p>ما هي كلمة المرور الأصلية؟</p>
          </div>
        `,
        solution: "hello",
        hints: [
          "جرب كلمات مرور شائعة",
          "استخدم أدوات فك تشفير MD5 أونلاين",
          "الكلمة بسيطة جداً"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "Network Port Scanning",
        description: "حدد الخدمات المفتوحة على الخادم",
        category: "network",
        difficulty: "intermediate",
        points: 180,
        content: `
          <div class="challenge-content">
            <h3>تحدي فحص المنافذ</h3>
            <p>نتائج فحص nmap للخادم 192.168.1.100:</p>
            <pre>
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql
            </pre>
            <p>أي منفذ يمثل أكبر خطر أمني؟</p>
          </div>
        `,
        solution: "3306",
        hints: [
          "فكر في قواعد البيانات",
          "أي خدمة لا يجب أن تكون مكشوفة للإنترنت؟",
          "MySQL port هو الأخطر"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
    ];

    for (const challenge of defaultChallenges) {
      await ctx.db.insert("challenges", challenge);
    }
  },
});
