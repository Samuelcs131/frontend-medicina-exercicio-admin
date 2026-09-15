import type { Roles } from 'src/enums/Roles.enum';

export interface IUserAuth {
  name: string;
  email: string;
  role: Roles;
  token: string;
  professionalId: string | null;
}
