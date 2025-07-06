import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // User progress and profiles
  userProfiles: defineTable({
    userId: v.id("users"),
    username: v.string(),
    level: v.number(),
    totalPoints: v.number(),
    completedChallenges: v.array(v.id("challenges")),
    achievements: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Cybersecurity challenges/levels
  challenges: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // "web", "network", "cryptography", "forensics", "reverse-engineering"
    difficulty: v.string(), // "beginner", "intermediate", "advanced", "expert"
    points: v.number(),
    content: v.string(), // HTML/instructions for the challenge
    solution: v.string(),
    hints: v.array(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_difficulty", ["difficulty"])
    .index("by_category", ["category"]),

  // User attempts and submissions
  submissions: defineTable({
    userId: v.id("users"),
    challengeId: v.id("challenges"),
    answer: v.string(),
    isCorrect: v.boolean(),
    pointsEarned: v.number(),
    timeSpent: v.number(), // in seconds
    hintsUsed: v.number(),
    submittedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_challenge", ["challengeId"])
    .index("by_user_challenge", ["userId", "challengeId"]),

  // Leaderboard
  leaderboard: defineTable({
    userId: v.id("users"),
    username: v.string(),
    totalPoints: v.number(),
    challengesCompleted: v.number(),
    rank: v.number(),
    updatedAt: v.number(),
  }).index("by_points", ["totalPoints"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
