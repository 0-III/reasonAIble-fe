import type { Excuse } from "@/types/excuse";

// This is a mock function that would be replaced with an actual API call
// to a service like OpenAI in a real application
export async function generateExcuse(situation: string): Promise<Excuse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate a random excuse based on the situation
  const excuses = [
    `I couldn't complete that because my computer crashed right as I was about to finish, and the IT department is still trying to recover my files.`,
    `I'm sorry for the delay, but I've been dealing with an unexpected family emergency that required my immediate attention.`,
    `I was actually on track to finish, but there was a critical issue with the previous work that I had to fix first, which took longer than expected.`,
    `I would have been there, but my car wouldn't start this morning, and I had to wait for roadside assistance.`,
    `I apologize for missing that, but I came down with a sudden illness and have been recovering.`,
    `The deadline slipped my mind because I've been overwhelmed with other high-priority tasks that came in at the last minute.`,
    `I was actually waiting on crucial information from another department, and they just got back to me.`,
    `My internet service provider had an outage in my area, and I couldn't access the necessary resources.`,
    `I had already completed it, but there must have been a technical glitch because I can't find the submission anywhere.`,
    `I misunderstood the timeline and thought it was due next week. I'll have it done immediately.`,
  ];

  // Pick a random excuse
  const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];

  return {
    id: generateId(),
    situation,
    excuse: randomExcuse,
    createdAt: new Date().toISOString(),
    usageCount: 0,
  };
}

function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
