export interface Filters {
  categories: string[];
  investment: string[];
  mentorExperience: string[];
  stages: string[];
}

export interface ProductsProps {
  filters?: Filters;
}
