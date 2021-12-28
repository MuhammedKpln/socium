import {IUser} from '@/Types/login.types';

export interface IFollowers {
  created_at: Date;
  updated_at: Date;
  user: IUser;
  actor: IUser;
}
