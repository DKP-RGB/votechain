// Frontend-only mode: no backend required
export const isFaceRecognitionEnable = true;

// Parties
export const PARTIES = {
  BJP: {
    id: "bjp",
    name: "Bharatiya Janata Party",
    shortName: "BJP",
    logo: "/bjp_logo.png",
    color: "#FF6B00",
    lightColor: "#FF8C3A",
    symbol: "Lotus",
    leader: "Narendra Modi",
    founded: "1980",
    ideology: "Hindu nationalism, Conservatism",
    slogan: "Sabka Saath, Sabka Vikas",
  },
  CONGRESS: {
    id: "congress",
    name: "Indian National Congress",
    shortName: "INC",
    logo: "/congress_logo.png",
    color: "#1565C0",
    lightColor: "#1976D2",
    symbol: "Hand",
    leader: "Mallikarjun Kharge",
    founded: "1885",
    ideology: "Liberalism, Social democracy",
    slogan: "Jai Hind, Jai Congress",
  },
};

// Single election data (frontend-only)
export const ELECTION_DATA = {
  id: "ge2024",
  name: "General Election 2024",
  phase: "voting", // "init" | "voting" | "result"
  startDate: "2024-04-19",
  endDate: "2024-06-01",
  totalSeats: 543,
  description: "18th Lok Sabha General Elections of India",
  candidates: [
    {
      id: "bjp_candidate",
      partyId: "bjp",
      name: "Arun Kumar Sharma",
      constituency: "New Delhi",
      age: 54,
      education: "MBA, Delhi University",
      experience: "Former MP, 15 years in public service",
    },
    {
      id: "congress_candidate",
      partyId: "congress",
      name: "Priya Mehta",
      constituency: "New Delhi",
      age: 48,
      education: "LLB, Jawaharlal Nehru University",
      experience: "Senior Advocate, Social Activist for 20 years",
    },
  ],
};
