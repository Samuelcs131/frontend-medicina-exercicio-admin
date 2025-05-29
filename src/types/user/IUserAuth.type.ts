import type { Roles } from 'src/enums/Roles.enum';

export interface IUserAuth {
  name: string;
  email: string;
  roles: Roles[];
  token: string;
}
