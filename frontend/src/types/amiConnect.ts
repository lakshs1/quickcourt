export interface Profile {
  id: string;
  name: string;
  avatar: string;
  degree: string;
  year: string;
  university: string;
  location: string;
  availability: string;
  lookingFor: string;
  lookingForCategory?: 'Project Collaborator' | 'Hackathon Teammate' | 'Research Partner' | 'Open Source Contributor' | 'Frontend Developer' | 'Backend Developer';
  about: string;
  skills: string[];
  interests: string[];
  commonGround: {
    skills?: string[];
    interests?: string[];
    general?: string[];
  };
  projects?: {
    title: string;
    description: string;
  }[];
  achievements?: string[];
  socials?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  connectionStatus?: 'none' | 'pending' | 'connected';
  isBookmarked?: boolean;
}

export interface FilterState {
  degree: string;
  academicYear: string;
  skills: string[];
  interests: string[];
  lookingFor: string[];
}
