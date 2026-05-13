export interface Phase {
  name: string;
  deadline: string; // ISO 8601
}

export interface Hackathon {
  id: string;
  title: string;
  platform: string;
  url: string;
  location: string;
  isOnline: boolean;
  isHybrid: boolean;
  themes: string[];
  prizePool: string;
  currency: string;
  prizeValue: number; // numeric for sorting
  phases: Phase[];
  sponsors: string[];
  eligibility: string;
  status: "upcoming" | "ongoing" | "ended";
  dateRange: string;
  description?: string;
}

export const hackathons: Hackathon[] = [
  {
    id: "hack-the-north-2026",
    title: "Hack the North 2026",
    platform: "Devpost",
    url: "https://hackthenorth.devpost.com",
    location: "Waterloo, Canada",
    isOnline: false,
    isHybrid: true,
    themes: ["AI/ML", "Open Innovation"],
    prizePool: "$50,000+",
    currency: "USD",
    prizeValue: 50000,
    phases: [
      { name: "Registration Opens", deadline: "2026-07-01T00:00:00" },
      { name: "Registration Closes", deadline: "2026-08-31T23:59:59" },
      { name: "Hacking Starts", deadline: "2026-09-18T09:00:00" },
      { name: "Project Submission", deadline: "2026-09-20T12:00:00" },
      { name: "Demo Day", deadline: "2026-09-20T15:00:00" },
    ],
    sponsors: ["Google", "Meta", "Shopify", "Stripe"],
    eligibility: "University students worldwide",
    status: "upcoming",
    dateRange: "September 18-20, 2026",
  },
  {
    id: "ethglobal-new-york-2026",
    title: "ETHGlobal New York 2026",
    platform: "DoraHacks",
    url: "https://dorahacks.io/hackathon/ethglobal-ny-2026",
    location: "New York, USA",
    isOnline: false,
    isHybrid: true,
    themes: ["Web3", "DeFi"],
    prizePool: "$150,000+",
    currency: "USD",
    prizeValue: 150000,
    phases: [
      { name: "Registration Opens", deadline: "2026-08-01T00:00:00" },
      { name: "Registration Closes", deadline: "2026-09-30T23:59:59" },
      { name: "Hacking Starts", deadline: "2026-10-10T09:00:00" },
      { name: "Project Submission", deadline: "2026-10-12T09:00:00" },
      { name: "Demo Day", deadline: "2026-10-12T14:00:00" },
    ],
    sponsors: ["Ethereum Foundation", "Aave", "Uniswap", "Chainlink"],
    eligibility: "Open to all",
    status: "upcoming",
    dateRange: "October 10-12, 2026",
  },
  {
    id: "mlh-global-hack-week-2026",
    title: "MLH Global Hack Week 2026",
    platform: "MLH",
    url: "https://ghw.mlh.io",
    location: "Online",
    isOnline: true,
    isHybrid: false,
    themes: ["Open Source", "Beginner Friendly"],
    prizePool: "$25,000+",
    currency: "USD",
    prizeValue: 25000,
    phases: [
      { name: "Registration Opens", deadline: "2026-10-01T00:00:00" },
      { name: "Registration Closes", deadline: "2026-10-31T23:59:59" },
      { name: "Hacking Starts", deadline: "2026-11-01T00:00:00" },
      { name: "Project Submission", deadline: "2026-11-07T23:59:59" },
      { name: "Demo Day", deadline: "2026-11-08T18:00:00" },
    ],
    sponsors: ["GitHub", "DigitalOcean", "Twilio", "MongoDB"],
    eligibility: "Students and beginners",
    status: "upcoming",
    dateRange: "November 1-7, 2026",
  },
  {
    id: "cal-hacks-2026",
    title: "Cal Hacks 2026",
    platform: "Devpost",
    url: "https://calhacks.devpost.com",
    location: "Berkeley, CA, USA",
    isOnline: false,
    isHybrid: false,
    themes: ["AI/ML", "Healthcare"],
    prizePool: "$30,000+",
    currency: "USD",
    prizeValue: 30000,
    phases: [
      { name: "Registration Opens", deadline: "2026-08-15T00:00:00" },
      { name: "Registration Closes", deadline: "2026-10-10T23:59:59" },
      { name: "Hacking Starts", deadline: "2026-10-24T10:00:00" },
      { name: "Project Submission", deadline: "2026-10-26T10:00:00" },
      { name: "Demo Day", deadline: "2026-10-26T14:00:00" },
    ],
    sponsors: ["Microsoft", "OpenAI", "NVIDIA", "Berkeley Engineering"],
    eligibility: "University students",
    status: "upcoming",
    dateRange: "October 24-26, 2026",
  },
  {
    id: "hackmit-2026",
    title: "HackMIT 2026",
    platform: "MLH",
    url: "https://hackmit.org",
    location: "Cambridge, MA, USA",
    isOnline: false,
    isHybrid: true,
    themes: ["AI/ML", "EdTech"],
    prizePool: "$40,000+",
    currency: "USD",
    prizeValue: 40000,
    phases: [
      { name: "Registration Opens", deadline: "2026-07-15T00:00:00" },
      { name: "Registration Closes", deadline: "2026-09-15T23:59:59" },
      { name: "Hacking Starts", deadline: "2026-09-27T08:00:00" },
      { name: "Project Submission", deadline: "2026-09-28T08:00:00" },
      { name: "Demo Day", deadline: "2026-09-28T13:00:00" },
    ],
    sponsors: ["MIT", "Palantir", "Databricks", "Scale AI"],
    eligibility: "MIT students + invited schools",
    status: "upcoming",
    dateRange: "September 27-28, 2026",
  },
  {
    id: "treehacks-2026",
    title: "TreeHacks 2026",
    platform: "Devpost",
    url: "https://treehacks.devpost.com",
    location: "Stanford, CA, USA",
    isOnline: false,
    isHybrid: false,
    themes: ["AI/ML", "Climate"],
    prizePool: "$35,000+",
    currency: "USD",
    prizeValue: 35000,
    phases: [
      { name: "Registration Opens", deadline: "2026-09-01T00:00:00" },
      { name: "Registration Closes", deadline: "2026-11-15T23:59:59" },
      { name: "Hacking Starts", deadline: "2026-11-20T18:00:00" },
      { name: "Project Submission", deadline: "2026-11-22T08:00:00" },
      { name: "Demo Day", deadline: "2026-11-22T12:00:00" },
    ],
    sponsors: ["Stanford", "Google", "Notion", "Figma"],
    eligibility: "University students worldwide",
    status: "upcoming",
    dateRange: "November 20-22, 2026",
  },
  {
    id: "junction-2026",
    title: "Junction 2026",
    platform: "DoraHacks",
    url: "https://dorahacks.io/hackathon/junction-2026",
    location: "Helsinki, Finland",
    isOnline: false,
    isHybrid: true,
    themes: ["IoT", "Open Innovation"],
    prizePool: "$45,000+",
    currency: "USD",
    prizeValue: 45000,
    phases: [
      { name: "Registration Opens", deadline: "2026-09-15T00:00:00" },
      { name: "Registration Closes", deadline: "2026-11-10T23:59:59" },
      { name: "Hacking Starts", deadline: "2026-11-21T17:00:00" },
      { name: "Project Submission", deadline: "2026-11-23T09:00:00" },
      { name: "Demo Day", deadline: "2026-11-23T14:00:00" },
    ],
    sponsors: ["Slush", "Nokia", "Aalto University", "Kone"],
    eligibility: "Open to all",
    status: "upcoming",
    dateRange: "November 21-23, 2026",
  },
  {
    id: "hackgt-2026",
    title: "HackGT 2026",
    platform: "MLH",
    url: "https://hack.gt",
    location: "Atlanta, GA, USA",
    isOnline: false,
    isHybrid: false,
    themes: ["FinTech", "Blockchain"],
    prizePool: "$20,000+",
    currency: "USD",
    prizeValue: 20000,
    phases: [
      { name: "Registration Opens", deadline: "2026-08-01T00:00:00" },
      { name: "Registration Closes", deadline: "2026-09-20T23:59:59" },
      { name: "Hacking Starts", deadline: "2026-10-03T18:00:00" },
      { name: "Project Submission", deadline: "2026-10-05T08:00:00" },
      { name: "Demo Day", deadline: "2026-10-05T13:00:00" },
    ],
    sponsors: ["Georgia Tech", "BlackRock", "NCR", "Coca-Cola"],
    eligibility: "University students",
    status: "upcoming",
    dateRange: "October 3-5, 2026",
  },
  {
    id: "nwhacks-2026",
    title: "nwHacks 2026",
    platform: "Devpost",
    url: "https://nwhacks.devpost.com",
    location: "Vancouver, Canada",
    isOnline: false,
    isHybrid: true,
    themes: ["AI/ML", "Healthcare"],
    prizePool: "$28,000+",
    currency: "USD",
    prizeValue: 28000,
    phases: [
      { name: "Registration Opens", deadline: "2026-10-01T00:00:00" },
      { name: "Registration Closes", deadline: "2026-12-10T23:59:59" },
      { name: "Hacking Starts", deadline: "2027-01-09T09:00:00" },
      { name: "Project Submission", deadline: "2027-01-11T09:00:00" },
      { name: "Demo Day", deadline: "2027-01-11T14:00:00" },
    ],
    sponsors: ["UBC", "Amazon", "Mozilla", "IBM"],
    eligibility: "University students",
    status: "upcoming",
    dateRange: "January 9-11, 2027",
  },
  {
    id: "pennapps-2026",
    title: "PennApps 2026",
    platform: "MLH",
    url: "https://pennapps.com",
    location: "Philadelphia, PA, USA",
    isOnline: false,
    isHybrid: false,
    themes: ["AI/ML", "Healthcare"],
    prizePool: "$32,000+",
    currency: "USD",
    prizeValue: 32000,
    phases: [
      { name: "Registration Opens", deadline: "2026-07-01T00:00:00" },
      { name: "Registration Closes", deadline: "2026-08-25T23:59:59" },
      { name: "Hacking Starts", deadline: "2026-09-05T17:00:00" },
      { name: "Project Submission", deadline: "2026-09-07T08:00:00" },
      { name: "Demo Day", deadline: "2026-09-07T13:00:00" },
    ],
    sponsors: ["Penn Engineering", "Goldman Sachs", "Bloomberg", "JPMorgan"],
    eligibility: "University students worldwide",
    status: "upcoming",
    dateRange: "September 5-7, 2026",
  },
];

export const THEME_TAGS = [
  "AI/ML",
  "Web3",
  "IoT",
  "Climate",
  "Open Source",
  "Healthcare",
  "FinTech",
  "EdTech",
  "DeFi",
  "Blockchain",
  "Open Innovation",
  "Beginner Friendly",
] as const;

export const PLATFORMS = [
  "All Platforms",
  "Devpost",
  "MLH",
  "DoraHacks",
  "Devfolio",
  "Unstop",
  "HackerEarth",
  "Other",
] as const;

export type ThemeTag = (typeof THEME_TAGS)[number];
export type Platform = (typeof PLATFORMS)[number];

export const THEME_COLORS: Record<string, { bg: string; text: string }> = {
  "AI/ML": { bg: "bg-[#EFF6FF] dark:bg-[#172554]", text: "text-[#3B82F6]" },
  "Web3": { bg: "bg-[#F5F3FF] dark:bg-[#2E1065]", text: "text-[#8B5CF6]" },
  "DeFi": { bg: "bg-[#F5F3FF] dark:bg-[#2E1065]", text: "text-[#8B5CF6]" },
  "IoT": { bg: "bg-[#F0FDFA] dark:bg-[#042F2E]", text: "text-[#14B8A6]" },
  "Climate": { bg: "bg-[#F0FDF4] dark:bg-[#052E16]", text: "text-[#22C55E]" },
  "Open Source": { bg: "bg-[#FFF7ED] dark:bg-[#431407]", text: "text-[#F97316]" },
  "Healthcare": { bg: "bg-[#FFF1F2] dark:bg-[#4C0519]", text: "text-[#F43F5E]" },
  "FinTech": { bg: "bg-[#FEFCE8] dark:bg-[#422006]", text: "text-[#D97706]" },
  "EdTech": { bg: "bg-[#EEF2FF] dark:bg-[#1E1B4B]", text: "text-[#6366F1]" },
  "Blockchain": { bg: "bg-[#F8FAFC] dark:bg-[#0F172A]", text: "text-[#475569] dark:text-[#94A3B8]" },
  "Open Innovation": { bg: "bg-[#ECFEFF] dark:bg-[#083344]", text: "text-[#06B6D4]" },
  "Beginner Friendly": { bg: "bg-[#ECFDF5] dark:bg-[#022C22]", text: "text-[#059669]" },
};

export function getThemeTagStyle(tag: string): { bg: string; text: string } {
  return THEME_COLORS[tag] || { bg: "bg-[#F5F5F5] dark:bg-[#262626]", text: "text-[#6B7280]" };
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    Devpost: "#F97316",
    MLH: "#22C55E",
    DoraHacks: "#8B5CF6",
    Devfolio: "#3B82F6",
    Unstop: "#EF4444",
    HackerEarth: "#14B8A6",
  };
  return colors[platform] || "#9CA3AF";
}

export function getNextDeadline(hackathon: Hackathon): { phase: Phase; index: number } {
  const now = Date.now();
  for (let i = 0; i < hackathon.phases.length; i++) {
    if (new Date(hackathon.phases[i].deadline).getTime() > now) {
      return { phase: hackathon.phases[i], index: i };
    }
  }
  return { phase: hackathon.phases[hackathon.phases.length - 1], index: hackathon.phases.length - 1 };
}
