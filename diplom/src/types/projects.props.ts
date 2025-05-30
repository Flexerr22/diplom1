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
  mentorExperience?: string;
  stage?: string;
  user_id: number;
}
export interface CreateProjectRequest {
  title: string;
  description: string;
  tagline?: string;
  category?: string;
  stage?: string;
  investment?: string;
  equity?: string;
  investmentType?: string;
  links?: string;
  revenue?: string;
  mentorExperience?: string;
  mentorSkills?: string;
  mentorWorkFormat?: string;
  typeOfMentoring?: string;
  experience?: string;
  role?: string;
  achievements?: string;
  skills?: string;
  budget?: string;
  results?: string;
  user_id: number;
}
