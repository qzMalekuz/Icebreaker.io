import { MCQQuestion } from '../types/index.js';

export const questionBank: MCQQuestion[] = [
  {
    id: 'q1',
    question: "It's 2am and you're hungry. What do you actually do?",
    options: [
      { id: 'a', text: 'Raid the fridge shamelessly' },
      { id: 'b', text: 'Order delivery without guilt' },
      { id: 'c', text: 'Suffer in silence and scroll' },
      { id: 'd', text: "Drink water and convince yourself it's fine" },
    ],
  },
  {
    id: 'q2',
    question: 'Your love language is closest to:',
    options: [
      { id: 'a', text: 'Acts of service — just do the thing' },
      { id: 'b', text: 'Quality time — put the phone down' },
      { id: 'c', text: 'Words of affirmation — say it out loud' },
      { id: 'd', text: 'Physical touch — hug, always' },
    ],
  },
  {
    id: 'q3',
    question: 'Which energy matches yours on a random Tuesday?',
    options: [
      { id: 'a', text: 'Productive hermit — tasks, silence, headphones' },
      { id: 'b', text: 'Social butterfly — texting everyone at once' },
      { id: 'c', text: 'Chaotic neutral — started 5 things, finished 0' },
      { id: 'd', text: 'Dead inside — existing is enough today' },
    ],
  },
  {
    id: 'q4',
    question: "Pick the chaos you'd actually enjoy:",
    options: [
      { id: 'a', text: 'Spontaneous road trip with no plan' },
      { id: 'b', text: 'Hosting a dinner party last-minute' },
      { id: 'c', text: 'Moving to a new city on a whim' },
      { id: 'd', text: 'Deleting all social media for a month' },
    ],
  },
  {
    id: 'q5',
    question: 'Your biggest green flag in a person is:',
    options: [
      { id: 'a', text: 'They remember tiny things you said' },
      { id: 'b', text: 'They can sit in comfortable silence' },
      { id: 'c', text: 'They make you laugh without trying' },
      { id: 'd', text: "They're honest even when it's awkward" },
    ],
  },
  {
    id: 'q6',
    question: 'How do you deal with conflict?',
    options: [
      { id: 'a', text: "Address it immediately — can't let it sit" },
      { id: 'b', text: 'Cool down first, then talk' },
      { id: 'c', text: "Avoid it until it resolves itself (or doesn't)" },
      { id: 'd', text: 'Passive-aggressive until they notice' },
    ],
  },
  {
    id: 'q7',
    question: 'Your ideal weekend looks like:',
    options: [
      { id: 'a', text: 'Fully booked — events, people, movement' },
      { id: 'b', text: 'One good plan, rest unscheduled' },
      { id: 'c', text: 'Completely spontaneous, no agenda' },
      { id: 'd', text: 'Horizontal. Recharging. Do not disturb.' },
    ],
  },
  {
    id: 'q8',
    question: 'Your biggest fear is:',
    options: [
      { id: 'a', text: 'Being forgotten' },
      { id: 'b', text: 'Being misunderstood' },
      { id: 'c', text: 'Wasting time on the wrong things' },
      { id: 'd', text: 'Losing people I care about' },
    ],
  },
  {
    id: 'q9',
    question: 'The trait you secretly judge in others:',
    options: [
      { id: 'a', text: 'Chronic lateness' },
      { id: 'b', text: 'One-upping every story' },
      { id: 'c', text: 'Never admitting when wrong' },
      { id: 'd', text: 'Ghosting texts for days with no reason' },
    ],
  },
  {
    id: 'q10',
    question: 'Pick the energy you bring to a group project:',
    options: [
      { id: 'a', text: "Organiser — Notion doc ready in 10 minutes" },
      { id: 'b', text: 'Ideas person — great vision, zero execution' },
      { id: 'c', text: 'Workhorse — just tell me what to do' },
      { id: 'd', text: 'Vibe — keeps morale up, does just enough' },
    ],
  },
  {
    id: 'q11',
    question: 'Music playing in your head right now is probably:',
    options: [
      { id: 'a', text: 'Something emotional and cinematic' },
      { id: 'b', text: "Upbeat, chaotic, probably has a drop" },
      { id: 'c', text: "Chill lo-fi you've had on repeat all week" },
      { id: 'd', text: 'Nothing — my brain is blessedly quiet' },
    ],
  },
  {
    id: 'q12',
    question: 'You find out a close friend talked behind your back. You:',
    options: [
      { id: 'a', text: 'Confront them directly and calmly' },
      { id: 'b', text: 'Distance yourself without saying why' },
      { id: 'c', text: 'Forgive quickly — people make mistakes' },
      { id: 'd', text: 'Reassess the friendship slowly and quietly' },
    ],
  },
];

/** Pick 3 unique random questions for a session */
export function getSessionQuestions(): MCQQuestion[] {
  const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// Keep allPrompts for the REST /api/prompts endpoint (returns question texts)
export const allPrompts = questionBank.map((q) => q.question);
