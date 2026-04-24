import { EntrepreneurshipData } from '../types';

export const entrepreneurshipData: EntrepreneurshipData[] = [
  {
    id: 'btech',
    degree: 'Bachelor of Technology (B.Tech)',
    description: 'Leverage technical skills to build innovative products and platforms.',
    opportunities: [
      {
        sector: 'SaaS (Software as a Service)',
        profitMargin: 80,
        examples: ['Project management tools', 'CRM platforms', 'AI-powered analytics'],
        keySkills: ['Software Development', 'Cloud Computing', 'UX/UI Design'],
        marketTrend: 'Growing',
      },
      {
        sector: 'Robotics & Automation',
        profitMargin: 45,
        examples: ['Warehouse automation', 'Agricultural drones', 'Consumer robots'],
        keySkills: ['Mechanical Eng.', 'AI/ML', 'Circuit Design'],
        marketTrend: 'Growing',
      },
      {
        sector: 'EdTech',
        profitMargin: 65,
        examples: ['Online learning platforms', 'Virtual labs', 'Personalized tutoring apps'],
        keySkills: ['Web Development', 'Instructional Design', 'Mobile App Dev'],
        marketTrend: 'Growing',
      },
    ],
  },
  {
    id: 'bcom',
    degree: 'Bachelor of Commerce (B.Com)',
    description: 'Apply business acumen to create ventures in finance, retail, and services.',
    opportunities: [
      {
        sector: 'FinTech',
        profitMargin: 55,
        examples: ['Digital payment solutions', 'Personal finance apps', 'Robo-advisors'],
        keySkills: ['Financial Modeling', 'Data Analysis', 'Cybersecurity Basics'],
        marketTrend: 'Growing',
      },
      {
        sector: 'E-commerce & Retail',
        profitMargin: 30,
        examples: ['Niche online stores', 'Subscription box services', 'Dropshipping businesses'],
        keySkills: ['Digital Marketing', 'Supply Chain Mgmt.', 'Customer Analytics'],
        marketTrend: 'Stable',
      },
      {
        sector: 'Consulting Services',
        profitMargin: 70,
        examples: ['Small business accounting', 'Marketing strategy', 'Financial planning'],
        keySkills: ['Business Strategy', 'Communication', 'Problem-Solving'],
        marketTrend: 'Stable',
      },
    ],
  },
  {
    id: 'barts',
    degree: 'Bachelor of Arts (B.A.)',
    description: 'Utilize creativity and communication skills to build brands and communities.',
    opportunities: [
       {
        sector: 'Digital Marketing Agency',
        profitMargin: 60,
        examples: ['Content creation', 'Social media management', 'SEO services'],
        keySkills: ['Content Writing', 'SEO/SEM', 'Social Media Strategy'],
        marketTrend: 'Growing',
      },
      {
        sector: 'Creative Content Creation',
        profitMargin: 75,
        examples: ['YouTube channels', 'Podcasting', 'Niche blogging/newsletters'],
        keySkills: ['Video Production', 'Storytelling', 'Audience Engagement'],
        marketTrend: 'Growing',
      },
      {
        sector: 'Event Management',
        profitMargin: 25,
        examples: ['Corporate events', 'Weddings', 'Virtual conferences'],
        keySkills: ['Project Management', 'Vendor Negotiation', 'Creativity'],
        marketTrend: 'Stable',
      },
    ],
  },
];
