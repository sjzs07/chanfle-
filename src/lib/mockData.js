export const mockVideos = [
  {
    id: "1",
    title: "Cat tries to fit in tiny box 📦",
    description: "This absolute legend of a cat refuses to accept that physics applies to him.",
    thumbnailUrl: "https://picsum.photos/seed/cat1/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "0:42",
    views: 248300,
    likes: 18700,
    tags: ["cats", "funny", "animals"],
    author: { name: "FunnyPets", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=FunnyPets" },
    createdAt: "2025-06-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Dad jokes compilation that will ruin your day 😂",
    description: "I warned you. You can't say I didn't warn you.",
    thumbnailUrl: "https://picsum.photos/seed/dad2/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "1:00",
    views: 1200000,
    likes: 95400,
    tags: ["dad-jokes", "comedy", "puns"],
    author: { name: "DadJokeDave", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=DadJokeDave" },
    createdAt: "2025-06-09T14:30:00Z",
  },
  {
    id: "3",
    title: "Dog discovers mirrors for the first time 🐶",
    description: "The existential crisis was real. He will never be the same.",
    thumbnailUrl: "https://picsum.photos/seed/dog3/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "0:38",
    views: 534000,
    likes: 41200,
    tags: ["dogs", "funny", "animals"],
    author: { name: "WoofWorld", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=WoofWorld" },
    createdAt: "2025-06-08T09:00:00Z",
  },
  {
    id: "4",
    title: "Office prank compilation 🏢",
    description: "HR has entered the chat.",
    thumbnailUrl: "https://picsum.photos/seed/office4/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "0:57",
    views: 876000,
    likes: 62100,
    tags: ["pranks", "office", "comedy"],
    author: { name: "PrankStation", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=PrankStation" },
    createdAt: "2025-06-07T16:00:00Z",
  },
  {
    id: "5",
    title: "Baby's first laugh challenge 👶",
    description: "Scientists confirm this is the best sound in the universe.",
    thumbnailUrl: "https://picsum.photos/seed/baby5/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "0:28",
    views: 2100000,
    likes: 189000,
    tags: ["baby", "cute", "funny"],
    author: { name: "CuteOverload", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=CuteOverload" },
    createdAt: "2025-06-06T12:00:00Z",
  },
  {
    id: "6",
    title: "Grandma discovers TikTok 👴📱",
    description: "She now has more followers than me and I'm not okay.",
    thumbnailUrl: "https://picsum.photos/seed/grandma6/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "0:55",
    views: 3400000,
    likes: 310000,
    tags: ["grandma", "viral", "comedy"],
    author: { name: "FamilyFunny", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=FamilyFunny" },
    createdAt: "2025-06-05T08:00:00Z",
  },
  {
    id: "7",
    title: "Seagull steals GoPro at the beach 🐦",
    description: "The cinematography is genuinely better than most Hollywood films.",
    thumbnailUrl: "https://picsum.photos/seed/seagull7/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "0:47",
    views: 5600000,
    likes: 498000,
    tags: ["animals", "beach", "viral"],
    author: { name: "NatureFails", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=NatureFails" },
    createdAt: "2025-06-04T11:00:00Z",
  },
  {
    id: "8",
    title: "When autocorrect attacks 🔤💀",
    description: "A tragedy in 60 seconds. Sent this to my boss. I no longer work there.",
    thumbnailUrl: "https://picsum.photos/seed/autocorrect8/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "1:00",
    views: 921000,
    likes: 84300,
    tags: ["texting", "fail", "comedy"],
    author: { name: "TechFails", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=TechFails" },
    createdAt: "2025-06-03T15:00:00Z",
  },
];

export const mockComments = [
  { id: "c1", videoId: "1", author: "LaughingLarry", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=LaughingLarry", text: "I've watched this 47 times and it gets funnier every single time 💀", createdAt: "2025-06-10T11:00:00Z" },
  { id: "c2", videoId: "1", author: "CatMom99", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=CatMom99", text: "My cat does the EXACT same thing. They are all delusional.", createdAt: "2025-06-10T12:00:00Z" },
  { id: "c3", videoId: "1", author: "ScienceGuy", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ScienceGuy", text: "According to physics, this shouldn't be possible. Yet here we are.", createdAt: "2025-06-10T13:00:00Z" },
];

export function formatViews(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}
