import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user profile
export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    let profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      const user = await ctx.db.get(userId);
      return {
        userId,
        username: user?.email?.split('@')[0] || "Anonymous",
        level: 1,
        totalPoints: 0,
        completedChallenges: [],
        achievements: [],
        createdAt: Date.now(),
      };
    }

    return profile;
  },
});

// Get leaderboard
export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("userProfiles")
      .collect();

    return profiles
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, args.limit || 10)
      .map((profile, index) => ({
        ...profile,
        rank: index + 1,
      }));
  },
});

// Get user statistics
export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const correctSubmissions = submissions.filter(s => s.isCorrect);
    const totalAttempts = submissions.length;
    const successRate = totalAttempts > 0 ? (correctSubmissions.length / totalAttempts) * 100 : 0;

    // Category breakdown
    const challenges = await ctx.db.query("challenges").collect();
    const categoryStats: Record<string, { total: number; completed: number }> = {};
    
    for (const challenge of challenges) {
      if (!categoryStats[challenge.category]) {
        categoryStats[challenge.category] = { total: 0, completed: 0 };
      }
      categoryStats[challenge.category].total++;
      if (profile?.completedChallenges.includes(challenge._id)) {
        categoryStats[challenge.category].completed++;
      }
    }

    return {
      profile,
      totalAttempts,
      successRate: Math.round(successRate),
      categoryStats,
      recentSubmissions: submissions
        .sort((a, b) => b.submittedAt - a.submittedAt)
        .slice(0, 5),
    };
  },
});

// Create or update user profile
export const createUserProfile = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        username: args.username,
      });
      return existingProfile._id;
    }

    return await ctx.db.insert("userProfiles", {
      userId,
      username: args.username,
      level: 1,
      totalPoints: 0,
      completedChallenges: [],
      achievements: [],
      createdAt: Date.now(),
    });
  },
});
