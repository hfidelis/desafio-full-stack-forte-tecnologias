import { User } from "./user.interfaces";

export interface LoginResponse {
  access_token: string;
  user: User;
}
