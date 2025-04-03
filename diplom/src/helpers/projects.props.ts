export interface RolesGroupProps {
  id: number;
  name: string;
  description: string;
  specialization: string;
  role?: string;
  budget?: string;
  experience?: string;
}
export interface ProductProps {
  id: number;
  title: string;
  tagline: string;
  investment: string;
  role?: string;
  category: string;
  budget?: string;
  experience?: string;
  description?: string;
  skills?: string;
}
export interface ProductByIdProps {
  title: string;
  description: string;
  tagline?: string;
  category?: string;
  stage?: string;
  investment?: string;
  equity?: string;
  investmentType?: string;
  team?: string;
  links?: string;
  revenue?: string;
  goals?: string;
  problem?: string;
  solution?: string;
  targetAudience?: string;
  risks?: string;
  mentorExperience?: string;
  mentorSkills?: string;
  mentorWorkFormat?: string;
  mentorCollaborationGoals?: string;
  mentorCollaborationTerms?: string;
  typeOfMentoring?: string;
  experience?: string;
  role?: string;
  achievements?: string;
  skills?: string;
  typeOfInvestment?: string;
  budget?: string;
  results?: string;
  user_id?: number;
}
