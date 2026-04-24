// FIX: Added mock data for academic streams.
import { StreamData } from '../types';

export const streamData: StreamData[] = [
  {
    id: 'science',
    title: 'Science (PCM/PCB)',
    description: 'Focuses on the study of natural and physical phenomena through observation and experimentation. Ideal for students with strong analytical and problem-solving skills.',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English'],
    careers: [
        'Engineer (Software, Mechanical, Civil, etc.)', 
        'Doctor', 
        'Defense Services (NDA, CDS)',
        'ISRO/DRDO Scientist',
        'AI/ML Engineer',
        'Data Scientist', 
        'Architect', 
        'Pilot',
        'PSU Engineer (IOCL, NTPC)',
        'Biotechnologist',
        'Pharmacist',
        'SSC CGL Officer'
    ],
  },
  {
    id: 'commerce',
    title: 'Commerce',
    description: 'Centered around business, finance, and economics. This stream is perfect for students interested in how markets work and who have a knack for numbers and management.',
    subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English', 'Informatics Practices'],
    careers: [
        'Chartered Accountant (CA)', 
        'RBI Grade B Officer',
        'Government Bank PO (IBPS)',
        'Company Secretary (CS)', 
        'Financial Analyst', 
        'Investment Banker', 
        'Product Manager',
        'Data Analyst',
        'Management Consultant',
        'PSU (Finance Roles)',
        'Entrepreneur',
        'SSC CGL Officer'
    ],
  },
  {
    id: 'arts',
    title: 'Arts / Humanities',
    description: 'Explores human culture, society, and creativity. It is suited for students who are curious, expressive, and interested in understanding human behavior and history.',
    subjects: ['History', 'Political Science', 'Sociology', 'Psychology', 'Economics', 'Literature'],
    careers: [
        'Civil Servant (IAS/IPS/IFS)', 
        'State PSC Officer',
        'Defense Services (Officer)',
        'Lawyer', 
        'Journalist', 
        'UI/UX Designer',
        'Digital Marketer',
        'Musician',
        'Fine Artist (Painter, Sculptor)',
        'Dancer / Choreographer',
        'Actor',
        'Filmmaker',
        'Psychologist',
        'Government Professor',
        'SSC CGL Officer'
    ],
  },
];
