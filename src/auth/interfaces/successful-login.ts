import { UserInfo } from 'src/users/interface/user-info';

export interface SuccessfulLogin {
  message: string;
  user: UserInfo;
  token: string;
  expiration: number;
}
