// Shared client-side store using localStorage
// In production this becomes API calls

export interface PendingMother {
  id: string;
  name: string;
  nameEn: string;
  age: number;
  zilla: string;
  phone: string;
  philosophy: string;
  story: string;
  specialties: string[];
  motivation: "legacy" | "income" | "recognition";
  status: "pending" | "approved" | "rejected" | "suspended";
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface PendingRecipe {
  id: string;
  motherId: string;
  motherName: string;
  name: string;
  nameEn: string;
  difficulty: number;
  timeMinutes: number;
  servings: number;
  tags: string[];
  ingredients: Array<{
    name: string;
    nameEn: string;
    amount: string;
    unit: string;
    importance: "must" | "medium" | "optional";
  }>;
  motherVoiceText: string;
  motherVoiceNote: string;
  steps: Array<{ instruction: string; timeMinutes: number }>;
  aiBridgeText: string;
  tips: string[];
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewNote?: string;
}

export interface Review {
  id: string;
  recipeId: string;
  motherId: string;
  recipeRating: number;
  motherRating: number;
  comment: string;
  cookedAt: string;
}

const KEYS = {
  pendingMothers: "mhr_pending_mothers",
  pendingRecipes: "mhr_pending_recipes",
  reviews: "mhr_reviews",
  currentMotherId: "mhr_current_mother_id",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  // Pending mothers
  getPendingMothers: (): PendingMother[] => read(KEYS.pendingMothers, []),
  savePendingMother: (m: PendingMother) => {
    const all = read<PendingMother[]>(KEYS.pendingMothers, []);
    const idx = all.findIndex((x) => x.id === m.id);
    if (idx >= 0) all[idx] = m;
    else all.push(m);
    write(KEYS.pendingMothers, all);
  },
  updateMotherStatus: (id: string, status: PendingMother["status"], note?: string) => {
    const all = read<PendingMother[]>(KEYS.pendingMothers, []);
    const idx = all.findIndex((x) => x.id === id);
    if (idx >= 0) {
      all[idx].status = status;
      all[idx].reviewedAt = new Date().toISOString();
      if (note) all[idx].reviewNote = note;
      write(KEYS.pendingMothers, all);
    }
  },

  // Pending recipes
  getPendingRecipes: (): PendingRecipe[] => read(KEYS.pendingRecipes, []),
  savePendingRecipe: (r: PendingRecipe) => {
    const all = read<PendingRecipe[]>(KEYS.pendingRecipes, []);
    const idx = all.findIndex((x) => x.id === r.id);
    if (idx >= 0) all[idx] = r;
    else all.push(r);
    write(KEYS.pendingRecipes, all);
  },
  updateRecipeStatus: (id: string, status: PendingRecipe["status"], note?: string) => {
    const all = read<PendingRecipe[]>(KEYS.pendingRecipes, []);
    const idx = all.findIndex((x) => x.id === id);
    if (idx >= 0) {
      all[idx].status = status;
      if (note) all[idx].reviewNote = note;
      write(KEYS.pendingRecipes, all);
    }
  },
  getMotherRecipes: (motherId: string): PendingRecipe[] =>
    read<PendingRecipe[]>(KEYS.pendingRecipes, []).filter((r) => r.motherId === motherId),

  // Reviews
  getReviews: (): Review[] => read(KEYS.reviews, []),
  saveReview: (r: Review) => {
    const all = read<Review[]>(KEYS.reviews, []);
    all.push(r);
    write(KEYS.reviews, all);
  },

  // Current logged-in mother session
  getCurrentMotherId: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(KEYS.currentMotherId);
  },
  setCurrentMotherId: (id: string | null) => {
    if (typeof window === "undefined") return;
    if (id) localStorage.setItem(KEYS.currentMotherId, id);
    else localStorage.removeItem(KEYS.currentMotherId);
  },

  // Seed demo data for admin panel demo
  seedDemoData: () => {
    const existing = read<PendingMother[]>(KEYS.pendingMothers, []);
    if (existing.length > 0) return;
    const demo: PendingMother[] = [
      {
        id: "pending-1",
        name: "মরিয়ম বেগম",
        nameEn: "Mariam Begum",
        age: 58,
        zilla: "চট্টগ্রাম",
        phone: "01712345678",
        philosophy: "রান্না হলো ভালোবাসার ভাষা",
        story: "চট্টগ্রামের মেজবান রান্নায় আমার বিশেষত্ব। ৩০ বছর ধরে বিভিন্ন অনুষ্ঠানে রান্না করেছি।",
        specialties: ["মেজবান", "চট্টগ্রামী গরু", "কালাভুনা"],
        motivation: "recognition",
        status: "pending",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "pending-2",
        name: "আমেনা বেগম",
        nameEn: "Amena Begum",
        age: 45,
        zilla: "ময়মনসিংহ",
        phone: "01898765432",
        philosophy: "সতেজ উপকরণে সেরা রান্না",
        story: "ময়মনসিংহের গ্রামে বড় হয়েছি। মৌসুমী সবজি আর দেশি মুরগির রান্নায় আমার হাত পাকা।",
        specialties: ["দেশি মুরগি", "মৌসুমী সবজি", "পিঠা"],
        motivation: "income",
        status: "pending",
        submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "pending-3",
        name: "হাসিনা বেগম",
        nameEn: "Hasina Begum",
        age: 63,
        zilla: "খুলনা",
        phone: "01556677889",
        philosophy: "সুন্দরবনের ঘ্রাণ আমার রান্নায়",
        story: "খুলনার সুন্দরবন এলাকায় জন্ম। চিংড়ি আর ভেটকি মাছের রান্নায় জুড়ি নেই।",
        specialties: ["চিংড়ি মালাইকারি", "ভেটকি পাতুরি", "নারিকেল দিয়ে রান্না"],
        motivation: "legacy",
        status: "approved",
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    write(KEYS.pendingMothers, demo);

    const demoRecipes: PendingRecipe[] = [
      {
        id: "pr-1",
        motherId: "pending-1",
        motherName: "মরিয়ম বেগম",
        name: "কালাভুনা",
        nameEn: "Kala Bhuna",
        difficulty: 4,
        timeMinutes: 120,
        servings: 6,
        tags: ["গরুর মাংস", "চট্টগ্রাম", "উৎসব"],
        ingredients: [
          { name: "গরুর মাংস", nameEn: "beef", amount: "১ কেজি", unit: "", importance: "must" },
          { name: "পেঁয়াজ", nameEn: "onion", amount: "৪টা বড়", unit: "", importance: "must" },
          { name: "নারিকেল", nameEn: "coconut", amount: "আধা কাপ কোরানো", unit: "", importance: "must" },
        ],
        motherVoiceText: "কালাভুনা মানে কালো না, মানে গাঢ়। মশলা কষাতে কষাতে এই গাঢ় রং আসে।",
        motherVoiceNote: "ধৈর্য ধরে কষাও — এটাই কালাভুনার রহস্য।",
        steps: [
          { instruction: "মাংস ধুয়ে পানি ঝরিয়ে নাও।", timeMinutes: 5 },
          { instruction: "তেলে পেঁয়াজ গাঢ় বাদামি করো।", timeMinutes: 20 },
          { instruction: "মশলা দিয়ে কষাও তেল আলাদা হওয়া পর্যন্ত।", timeMinutes: 15 },
        ],
        aiBridgeText: "কালাভুনার রং আসে দীর্ঘক্ষণ ধরে কষানো পেঁয়াজ ও মশলা থেকে।",
        tips: ["নারিকেল দিলে স্বাদ আলাদা হয়।"],
        status: "pending",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    write(KEYS.pendingRecipes, demoRecipes);
  },
};
