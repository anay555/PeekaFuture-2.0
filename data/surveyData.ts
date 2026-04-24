// FIX: Implemented mock data for the career guidance survey.
import { SurveyQuestion } from '../types';

export const surveyData: SurveyQuestion[] = [
  {
    id: 'subjects',
    text: 'Which of these subject areas do you enjoy the most?',
    options: ['Math & Physics', 'Biology & Chemistry', 'History & Literature', 'Business & Economics'],
    explanation: "This helps us match you with academic streams you'll naturally excel in.",
  },
  {
    id: 'activities',
    text: 'In your free time, you prefer to...',
    options: ['Build things or solve puzzles', 'Understand how things work', 'Create art or write stories', 'Organize events or lead a team'],
    explanation: 'Your hobbies often reveal your underlying passions and skills.',
  },
  {
    id: 'workStyle',
    text: 'What kind of work environment sounds best to you?',
    options: ['A collaborative team in an office', 'Working independently on my own schedule', 'A hands-on, practical setting', 'A dynamic, fast-paced environment'],
    explanation: 'This question helps determine if you thrive in structured, independent, or social settings.',
  },
  {
    id: 'goal',
    text: 'What is your primary long-term goal?',
    options: ['Achieve financial success and stability', 'Innovate and create something new', 'Help people and make a social impact', 'Gain knowledge and become an expert'],
    explanation: 'Understanding your core motivation helps us suggest fulfilling career paths.',
  },
  {
    id: 'problemSolving',
    text: 'When faced with a complex problem, you are more likely to...',
    options: ['Break it down logically', 'Experiment with creative ideas', 'Discuss it with others', 'Empathize with those affected'],
    explanation: 'Your problem-solving approach points to your analytical or creative strengths.',
  },
  {
    id: 'learningStyle',
    text: 'How do you learn best?',
    options: ['Through structured lectures', 'By doing hands-on projects', 'Through group discussions', 'By observing and imitating experts'],
    explanation: 'This helps align your career path with environments where you can learn and grow effectively.',
  },
  {
    id: 'riskTolerance',
    text: 'Which statement best describes your attitude towards risk?',
    options: ['I prefer a stable and predictable path.', 'I take calculated risks for higher rewards.', 'I enjoy high-risk, high-reward ventures.', 'I avoid risk as much as possible.'],
    explanation: 'This helps gauge your suitability for roles in stable industries versus entrepreneurship.',
  },
  {
    id: 'impact',
    text: 'What kind of impact do you want to make?',
    options: ['Build innovative technology', 'Create beautiful, thought-provoking work', 'Lead a successful business', 'Help individuals or communities directly'],
    explanation: 'This question helps us understand what motivates you beyond just a salary.',
  },
  {
    id: 'workPace',
    text: 'You thrive in an environment that is...',
    options: ['Steady and methodical with clear deadlines', 'Fast-paced and constantly changing', 'Flexible and self-directed', 'Social and team-oriented'],
    explanation: 'Matching your preferred work pace is key to long-term job satisfaction.',
  },
  {
    id: 'jobPriority',
    text: "When choosing a job, what's most important to you?",
    options: ['High salary and benefits', 'Work-life balance and flexibility', 'A strong, positive company culture', 'Opportunities for continuous learning'],
    explanation: 'Your priorities help us identify careers that align with your personal values.',
  },
  {
    id: 'leadership',
    text: 'In a group project, you are usually the one...',
    options: ['Leading and delegating tasks', 'Contributing ideas and analysis', 'Ensuring harmony and cooperation', 'Focusing on my assigned part'],
    explanation: 'This helps identify your natural inclination towards leadership or specialist roles.',
  },
  {
    id: 'rules',
    text: 'How do you feel about working within a system of established rules and procedures?',
    options: ['I thrive with clear structure', 'I prefer flexibility but can adapt', 'I find rules restrictive and prefer to innovate', 'I like to challenge and improve existing systems'],
    explanation: 'This insight is key for suggesting structured careers like civil services versus creative fields.',
  },
  {
    id: 'longTermFocus',
    text: 'Which goal sounds more appealing to you?',
    options: ['Achieving success through a series of short-term projects', 'Committing to a single, long-term, high-impact goal for many years', 'Mastering a specific, complex skill', 'Building a broad network of influential people'],
    explanation: 'This helps distinguish between project-based work and long-term commitments like public service.',
  },
  {
    id: 'governanceInterest',
    text: 'How interested are you in topics like public policy, law, and social justice?',
    options: ['Very interested, I follow them closely', 'Somewhat interested, I know the basics', 'Neutral, I focus on other areas', 'Not very interested'],
    explanation: 'Your interest in these areas is a strong indicator for careers in governance and law.',
  },
  {
    id: 'pressureHandling',
    text: 'How do you typically handle high-pressure situations?',
    options: ['I remain calm and work methodically', 'I get energized and work faster', 'I find it stressful and prefer a calm environment', 'I seek support and collaborate with others'],
    explanation: 'This helps us match you with roles that have a pressure level you are comfortable with.',
  },
];