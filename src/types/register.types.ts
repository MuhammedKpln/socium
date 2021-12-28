import {IUser} from './login.types';

export interface IRegisterData {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface GoogleUser {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  name: string;
  photo: string;
}

export interface IGoogle {
  idToken: string;
  scopes?: string[];
  serverAuthCode: string;
  user: GoogleUser;
}
export interface IGoogleRegisterParams {
  username: string;
  email: string;
  idToken: string;
}

export type IRegisterResponse = IUser;
