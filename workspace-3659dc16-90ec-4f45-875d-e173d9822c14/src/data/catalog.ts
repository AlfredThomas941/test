/**
 * Lingoland catalog data — achievements, quests, shop items, AI scenarios.
 * Original content; not derived from any proprietary source.
 */

export interface AchievementSpec {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  tier: "bronze" | "silver" | "gold" | "platinum";
  category: "streak" | "xp" | "lesson" | "skill" | "social" | "special";
  requirement: number;
  requirementLabel: string;
  xp: number;
}

export const ACHIEVEMENTS: AchievementSpec[] = [
  // Streak
  { id: "streak-3", title: "Wildfire", description: "Reach a 3-day streak.", icon: "🔥", tier: "bronze", category: "streak", requirement: 3, requirementLabel: "3-day streak", xp: 25 },
  { id: "streak-7", title: "Rising Phoenix", description: "Reach a 7-day streak.", icon: "🔥", tier: "silver", category: "streak", requirement: 7, requirementLabel: "7-day streak", xp: 50 },
  { id: "streak-30", title: "Inferno", description: "Reach a 30-day streak.", icon: "🌋", tier: "gold", category: "streak", requirement: 30, requirementLabel: "30-day streak", xp: 200 },
  { id: "streak-100", title: "Eternal Flame", description: "Reach a 100-day streak.", icon: "🌟", tier: "platinum", category: "streak", requirement: 100, requirementLabel: "100-day streak", xp: 1000 },
  // XP
  { id: "xp-100", title: "Spark", description: "Earn 100 XP total.", icon: "✨", tier: "bronze", category: "xp", requirement: 100, requirementLabel: "100 XP", xp: 10 },
  { id: "xp-1000", title: "Blaze", description: "Earn 1,000 XP total.", icon: "⚡", tier: "silver", category: "xp", requirement: 1000, requirementLabel: "1,000 XP", xp: 100 },
  { id: "xp-10000", title: "Supernova", description: "Earn 10,000 XP total.", icon: "💫", tier: "gold", category: "xp", requirement: 10000, requirementLabel: "10,000 XP", xp: 500 },
  // Lessons
  { id: "lesson-1", title: "First Steps", description: "Complete your first lesson.", icon: "👣", tier: "bronze", category: "lesson", requirement: 1, requirementLabel: "1 lesson", xp: 10 },
  { id: "lesson-10", title: "Explorer", description: "Complete 10 lessons.", icon: "🧭", tier: "silver", category: "lesson", requirement: 10, requirementLabel: "10 lessons", xp: 50 },
  { id: "lesson-50", title: "Trailblazer", description: "Complete 50 lessons.", icon: "🚀", tier: "gold", category: "lesson", requirement: 50, requirementLabel: "50 lessons", xp: 250 },
  { id: "perfect-1", title: "Flawless", description: "Get a perfect lesson (no mistakes).", icon: "💎", tier: "silver", category: "lesson", requirement: 1, requirementLabel: "1 perfect lesson", xp: 75 },
  { id: "perfect-10", title: "Untouchable", description: "Get 10 perfect lessons.", icon: "🏆", tier: "gold", category: "lesson", requirement: 10, requirementLabel: "10 perfect lessons", xp: 300 },
  // Skill
  { id: "vocab-100", title: "Word Hoarder", description: "Learn 100 vocabulary words.", icon: "📚", tier: "silver", category: "skill", requirement: 100, requirementLabel: "100 words", xp: 100 },
  { id: "vocab-500", title: "Lexicon Master", description: "Learn 500 vocabulary words.", icon: "🎓", tier: "gold", category: "skill", requirement: 500, requirementLabel: "500 words", xp: 400 },
  { id: "review-50", title: "Memory Keeper", description: "Complete 50 spaced-repetition reviews.", icon: "🧠", tier: "silver", category: "skill", requirement: 50, requirementLabel: "50 reviews", xp: 75 },
  // Social
  { id: "friend-1", title: "Friendly Fox", description: "Add your first friend.", icon: "🦊", tier: "bronze", category: "social", requirement: 1, requirementLabel: "1 friend", xp: 25 },
  { id: "friend-5", title: "Social Butterfly", description: "Add 5 friends.", icon: "🦋", tier: "silver", category: "social", requirement: 5, requirementLabel: "5 friends", xp: 75 },
  { id: "leaderboard-1", title: "League Champion", description: "Win a weekly league.", icon: "👑", tier: "gold", category: "social", requirement: 1, requirementLabel: "1 league win", xp: 300 },
  // Special
  { id: "ai-1", title: "Conversationalist", description: "Complete your first AI conversation.", icon: "💬", tier: "bronze", category: "special", requirement: 1, requirementLabel: "1 AI chat", xp: 30 },
  { id: "ai-10", title: "Chatterbox", description: "Complete 10 AI conversations.", icon: "🎤", tier: "silver", category: "special", requirement: 10, requirementLabel: "10 AI chats", xp: 150 },
  { id: "quest-1", title: "Quest Taker", description: "Complete your first quest.", icon: "📜", tier: "bronze", category: "special", requirement: 1, requirementLabel: "1 quest", xp: 20 },
];

export interface QuestSpec {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly";
  goalType: "xp" | "lessons" | "perfect" | "minutes" | "streak";
  goalAmount: number;
  xp: number;
  gems: number;
  icon: string;
  color: string;
}

export const QUESTS: QuestSpec[] = [
  { id: "d1", title: "Earn 30 XP today", description: "Complete a few lessons to hit 30 XP.", type: "daily", goalType: "xp", goalAmount: 30, xp: 15, gems: 5, icon: "⚡", color: "#ffc93c" },
  { id: "d2", title: "Complete 3 lessons", description: "Three lessons today keeps the forgetting curve away.", type: "daily", goalType: "lessons", goalAmount: 3, xp: 20, gems: 5, icon: "📚", color: "#58cc8d" },
  { id: "d3", title: "Get 1 perfect lesson", description: "Make no mistakes in any lesson.", type: "daily", goalType: "perfect", goalAmount: 1, xp: 25, gems: 10, icon: "💎", color: "#4d96ff" },
  { id: "d4", title: "Review 5 words", description: "Practice your spaced-repetition queue.", type: "daily", goalType: "minutes", goalAmount: 5, xp: 10, gems: 5, icon: "🧠", color: "#a06bd6" },
  { id: "w1", title: "Earn 200 XP this week", description: "Climb the leaderboard with 200 XP.", type: "weekly", goalType: "xp", goalAmount: 200, xp: 75, gems: 25, icon: "🔥", color: "#ff6b6b" },
  { id: "w2", title: "Complete 15 lessons", description: "Fifteen lessons this week.", type: "weekly", goalType: "lessons", goalAmount: 15, xp: 100, gems: 30, icon: "🚀", color: "#4d96ff" },
  { id: "w3", title: "5-day streak", description: "Practice 5 days in a row.", type: "weekly", goalType: "streak", goalAmount: 5, xp: 80, gems: 30, icon: "🔥", color: "#ffc93c" },
  { id: "m1", title: "Earn 800 XP this month", description: "Big monthly goal: 800 XP.", type: "monthly", goalType: "xp", goalAmount: 800, xp: 300, gems: 100, icon: "🌋", color: "#ff6b6b" },
];

export interface ShopItemSpec {
  id: string;
  name: string;
  description: string;
  category: "cosmetic" | "boost" | "heart" | "streak" | "bundle";
  priceGems: number;
  icon: string;
  color: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const SHOP_ITEMS: ShopItemSpec[] = [
  // Hearts
  { id: "heart-refill", name: "Heart Refill", description: "Instantly refill all hearts.", category: "heart", priceGems: 30, icon: "❤️", color: "#ff4757", rarity: "common" },
  { id: "heart-1", name: "Single Heart", description: "Add one heart (max 5).", category: "heart", priceGems: 15, icon: "❤️", color: "#ff4757", rarity: "common" },
  // Streak
  { id: "streak-freeze", name: "Streak Freeze", description: "Protects your streak for one inactive day.", category: "streak", priceGems: 50, icon: "🧊", color: "#4d96ff", rarity: "rare" },
  { id: "streak-restore", name: "Streak Restore", description: "Restore a broken streak (within 48h).", category: "streak", priceGems: 200, icon: "🔄", color: "#a06bd6", rarity: "epic" },
  // Boosts
  { id: "boost-2x-15", name: "2× XP Boost (15 min)", description: "Double your XP for 15 minutes.", category: "boost", priceGems: 60, icon: "⚡", color: "#ffc93c", rarity: "rare" },
  { id: "boost-perfect-1", name: "Perfect Lesson Booster", description: "Next lesson counts double.", category: "boost", priceGems: 40, icon: "💎", color: "#58cc8d", rarity: "rare" },
  // Cosmetics — mascot outfits
  { id: "cos-scarf", name: "Lumo's Cozy Scarf", description: "Dress Lumo in a warm winter scarf.", category: "cosmetic", priceGems: 80, icon: "🧣", color: "#ff6b6b", rarity: "rare" },
  { id: "cos-crown", name: "Royal Crown", description: "Lumo the King of Languages.", category: "cosmetic", priceGems: 250, icon: "👑", color: "#ffc93c", rarity: "legendary" },
  { id: "cos-sunglasses", name: "Cool Shades", description: "Stay cool while you study.", category: "cosmetic", priceGems: 100, icon: "🕶️", color: "#2c2334", rarity: "rare" },
  { id: "cos-santa", name: "Holiday Hat", description: "Festive cheer all year round.", category: "cosmetic", priceGems: 120, icon: "🎅", color: "#ff4757", rarity: "epic" },
  { id: "cos-wizard", name: "Wizard Hat", description: "Lumo learns spells in many tongues.", category: "cosmetic", priceGems: 150, icon: "🧙", color: "#a06bd6", rarity: "epic" },
  // Bundles
  { id: "bundle-starter", name: "Starter Bundle", description: "3 heart refills + 1 streak freeze + 1 booster.", category: "bundle", priceGems: 150, icon: "🎁", color: "#58cc8d", rarity: "epic" },
  { id: "bundle-pro", name: "Pro Bundle", description: "5 streak freezes + 5 boosters + Royal Crown.", category: "bundle", priceGems: 500, icon: "💼", color: "#ffc93c", rarity: "legendary" },
];

export interface AIScenarioSpec {
  id: string;
  name: string;
  emoji: string;
  description: string;
  difficulty: "A1" | "A2" | "B1" | "B2";
  color: string;
  systemPrompt: string;
  openingLine: { source: string; translation: string };
}

export const AI_SCENARIOS: AIScenarioSpec[] = [
  {
    id: "restaurant",
    name: "At the Restaurant",
    emoji: "🍽️",
    description: "Order food, ask about the menu, pay the bill.",
    difficulty: "A2",
    color: "#ff6b6b",
    systemPrompt:
      "You are a friendly waiter at a small family-run restaurant. Help the learner practice ordering food in the target language. Keep your replies short (1-3 sentences). When the learner makes a grammar or vocab mistake, gently correct it using this format: '💡 Correction: you said X → better: Y → because: Z. Example: ...' Then continue the conversation naturally. If the learner writes in English, encourage them to switch to the target language.",
    openingLine: { source: "¡Hola! ¿Qué le gustaría pedir hoy?", translation: "Hi! What would you like to order today?" },
  },
  {
    id: "airport",
    name: "At the Airport",
    emoji: "✈️",
    description: "Check in, ask for directions, deal with delays.",
    difficulty: "B1",
    color: "#4d96ff",
    systemPrompt:
      "You are an airport check-in agent. The learner is a traveler trying to check in for a flight. Reply in the target language, short sentences. When they make a mistake, correct gently: '💡 Correction: ... → better: ... → because: ...'. Encourage them to ask follow-up questions.",
    openingLine: { source: "Buenos días. ¿Su pasaporte, por favor?", translation: "Good morning. Your passport, please?" },
  },
  {
    id: "hotel",
    name: "Checking In at a Hotel",
    emoji: "🏨",
    description: "Reserve a room, ask about amenities, handle issues.",
    difficulty: "A2",
    color: "#a06bd6",
    systemPrompt:
      "You are a hotel receptionist. The learner is checking in. Be warm and helpful. Reply in the target language, 1-2 sentences. Correct mistakes gently with the 💡 format. Ask clarifying questions to keep the dialogue going.",
    openingLine: { source: "¡Bienvenido! ¿Tiene reserva?", translation: "Welcome! Do you have a reservation?" },
  },
  {
    id: "shopping",
    name: "Shopping for Clothes",
    emoji: "👕",
    description: "Ask for sizes, colors, negotiate the price.",
    difficulty: "A2",
    color: "#ffc93c",
    systemPrompt:
      "You are a shop assistant in a clothing store. The learner is browsing. Reply in the target language. Help with sizes, colors, prices. Correct mistakes using the 💡 format. Stay encouraging.",
    openingLine: { source: "Hola, ¿busca algo en especial?", translation: "Hi, are you looking for anything special?" },
  },
  {
    id: "casual",
    name: "Casual Chat with a New Friend",
    emoji: "💬",
    description: "Small talk, hobbies, where you're from.",
    difficulty: "A1",
    color: "#58cc8d",
    systemPrompt:
      "You are a friendly local the learner just met at a park. Have a casual conversation in the target language. Short replies. Correct mistakes gently with the 💡 format. Ask follow-up questions to keep it going.",
    openingLine: { source: "¡Hola! Hace un día precioso, ¿verdad?", translation: "Hi! It's a beautiful day, isn't it?" },
  },
  {
    id: "interview",
    name: "Job Interview",
    emoji: "💼",
    description: "Practice professional conversation.",
    difficulty: "B2",
    color: "#2c2334",
    systemPrompt:
      "You are a hiring manager conducting a job interview in the target language. Be professional but warm. Ask about experience, strengths, why the learner wants the role. Correct mistakes with the 💡 format.",
    openingLine: { source: "Gracias por venir. Cuénteme un poco sobre usted.", translation: "Thanks for coming. Tell me a bit about yourself." },
  },
];

export interface LeagueSpec {
  name: string;
  color: string;
  emoji: string;
  membersNeeded: number;
}

export const LEAGUES: LeagueSpec[] = [
  { name: "Bronze", color: "#cd7f32", emoji: "🥉", membersNeeded: 5 },
  { name: "Silver", color: "#c0c0c0", emoji: "🥈", membersNeeded: 5 },
  { name: "Gold", color: "#ffd700", emoji: "🥇", membersNeeded: 5 },
  { name: "Sapphire", color: "#4d96ff", emoji: "💠", membersNeeded: 5 },
  { name: "Ruby", color: "#ff4757", emoji: "❤️‍🔥", membersNeeded: 5 },
  { name: "Diamond", color: "#a06bd6", emoji: "💎", membersNeeded: 5 },
];

/** Synthetic friend/leaderboard roster */
export const BOT_LEARNERS = [
  { name: "María", avatar: "👩", country: "🇪🇸", baseXP: 280 },
  { name: "Yuki", avatar: "🧑", country: "🇯🇵", baseXP: 410 },
  { name: "Léa", avatar: "👱‍♀️", country: "🇫🇷", baseXP: 195 },
  { name: "Akin", avatar: "🧔", country: "🇳🇬", baseXP: 340 },
  { name: "Sofia", avatar: "👧", country: "🇮🇹", baseXP: 250 },
  { name: "Chen", avatar: "👨", country: "🇨🇳", baseXP: 380 },
  { name: "Oliver", avatar: "👦", country: "🇬🇧", baseXP: 165 },
  { name: "Anika", avatar: "👩‍🦰", country: "🇮🇳", baseXP: 305 },
  { name: "Lars", avatar: "🧓", country: "🇩🇪", baseXP: 220 },
  { name: "Noor", avatar: "🧕", country: "🇪🇬", baseXP: 365 },
];
