import type { Profile } from '../types/amiConnect';

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'rohan-verma',
    name: 'Rohan Verma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    degree: 'BCA',
    year: '2nd Year',
    university: 'Amity University',
    location: 'Noida, India',
    availability: 'Evenings',
    lookingFor: 'Project Collaborator',
    lookingForCategory: 'Project Collaborator',
    about: 'Building AI solutions that can make legal help accessible to all.',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'LangGraph', 'SQL', 'AI/ML'],
    interests: ['Football', 'Music', 'AI/ML', 'Gaming', 'Reading'],
    commonGround: {
      skills: ['AI/ML'],
      interests: ['Football', 'Music']
    },
    projects: [
      { title: 'AI Legal Assistant', description: 'LLM based assistant for Indian law' },
      { title: 'Expense Tracker', description: 'Full stack expense manager' }
    ],
    achievements: [
      'Winner - Amity Ideathon 2025',
      'AWS Cloud Practitioner',
      'Top 10 - Smart India Hackathon (Internal Round)'
    ],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      portfolio: 'https://rohanverma.dev'
    },
    connectionStatus: 'none',
    isBookmarked: false
  },
  {
    id: 'sneha-sharma',
    name: 'Sneha Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    degree: 'BTech (CSE)',
    year: '3rd Year',
    university: 'Amity University',
    location: 'Noida, India',
    availability: 'Weekends',
    lookingFor: 'Frontend Developer',
    lookingForCategory: 'Frontend Developer',
    about: 'Love building products that solve real world problems.',
    skills: ['React', 'Node.js', 'MongoDB', 'UI/UX', 'Tailwind'],
    interests: ['Football', 'Reading', 'Traveling', 'Design', 'Startups'],
    commonGround: {
      interests: ['Football', 'Reading', 'Traveling']
    },
    projects: [
      { title: 'Campus Connect', description: 'Student discovery and events platform' },
      { title: 'Portfolio Website', description: 'Motion-rich personal developer site' }
    ],
    achievements: [
      'Top 25 - Google Solution Challenge campus round',
      'Lead Designer - Amity Tech Club'
    ],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    connectionStatus: 'none',
    isBookmarked: true
  },
  {
    id: 'aman-gupta',
    name: 'Aman Gupta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    degree: 'BCA',
    year: '1st Year',
    university: 'Amity University',
    location: 'Delhi, India',
    availability: 'Flexible',
    lookingFor: 'Backend Developer',
    lookingForCategory: 'Backend Developer',
    about: 'Passionate software enthusiast exploring backend systems and DevOps workflows.',
    skills: ['Python', 'Django', 'Linux', 'Docker', 'PostgreSQL'],
    interests: ['Football', 'Music', 'Gaming', 'Open Source'],
    commonGround: {
      skills: ['Python'],
      interests: ['Football', 'Music']
    },
    projects: [
      { title: 'API Gateway Lite', description: 'Custom lightweight rate-limiting gateway' }
    ],
    achievements: ['Hacktoberfest Contributor 2025'],
    connectionStatus: 'none',
    isBookmarked: true
  },
  {
    id: 'karan-singh',
    name: 'Karan Singh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    degree: 'BTech (IT)',
    year: '2nd Year',
    university: 'Amity University',
    location: 'Noida, India',
    availability: 'Evenings',
    lookingFor: 'Open Source Contributor',
    lookingForCategory: 'Open Source Contributor',
    about: 'System architecture geek who loves containerization and rust tooling.',
    skills: ['Python', 'FastAPI', 'Docker', 'Rust', 'Kubernetes'],
    interests: ['Gaming', 'Coding', 'Open Source', 'Sci-Fi Books'],
    commonGround: {
      skills: ['Python', 'FastAPI'],
      interests: ['Gaming']
    },
    projects: [
      { title: 'Docker Log Aggregator', description: 'CLI log streaming tool' }
    ],
    achievements: ['Amity Coding League Winner'],
    connectionStatus: 'pending',
    isBookmarked: true
  },
  {
    id: 'neha-yadav',
    name: 'Neha Yadav',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    degree: 'BTech (CSE)',
    year: '3rd Year',
    university: 'Amity University',
    location: 'Gurugram, India',
    availability: 'Afternoons',
    lookingFor: 'Research Partner',
    lookingForCategory: 'Research Partner',
    about: 'ML researcher focusing on natural language processing and computer vision.',
    skills: ['Python', 'ML', 'Data Analysis', 'PyTorch', 'TensorFlow'],
    interests: ['Photography', 'Reading', 'AI Research', 'Chess'],
    commonGround: {
      skills: ['Python', 'ML'],
      interests: ['Reading']
    },
    projects: [
      { title: 'Medical Image Segmentation', description: 'UNet architecture for MRI scans' }
    ],
    achievements: ['Published paper at IEEE Student Conference'],
    connectionStatus: 'pending',
    isBookmarked: true
  },
  {
    id: 'mawiya-manzar',
    name: 'Mawiya Manzar',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    degree: 'BCA',
    year: '3rd Year',
    university: 'Amity University',
    location: 'Noida, India',
    availability: 'Evenings',
    lookingFor: 'Project Collaborator',
    lookingForCategory: 'Project Collaborator',
    about: 'I love building products and exploring AI applications that solve real-life problems.',
    skills: ['Python', 'FastAPI', 'SQL', 'LangGraph', 'AI/ML'],
    interests: ['Football', 'Music', 'Photography', 'Gaming', 'Reading'],
    commonGround: {
      skills: ['Python', 'FastAPI'],
      interests: ['Football', 'Music']
    },
    projects: [
      { title: 'AmiConnect', description: 'Student discovery and networking platform for Amity' }
    ],
    achievements: ['Amity Hackathon Winner 2026'],
    connectionStatus: 'connected',
    isBookmarked: false
  }
];

export const PREDEFINED_SKILLS = [
  'Python', 'FastAPI', 'SQL', 'React', 'Node.js', 'MongoDB', 'UI/UX',
  'Tailwind', 'PostgreSQL', 'LangGraph', 'AI/ML', 'Django', 'Linux',
  'Docker', 'Rust', 'Kubernetes', 'ML', 'Data Analysis', 'PyTorch', 'TypeScript'
];

export const PREDEFINED_INTERESTS = [
  'Football', 'Cricket', 'Music', 'Photography', 'Gaming', 'Reading',
  'Movies', 'Traveling', 'Design', 'Startups', 'Open Source', 'Chess', 'Anime', 'Fitness'
];
