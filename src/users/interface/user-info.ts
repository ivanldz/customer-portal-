import { Company } from 'src/companies/entities/company.entity';

export interface UserInfo {
  id: number;
  email: string;
  company: Company;
  role: {
    id: number;
    name: string;
    permissions: {
      id: number;
      name: string;
    }[];
  };
}
