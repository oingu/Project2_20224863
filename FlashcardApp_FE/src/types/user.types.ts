export interface UserTypes {
  email: string;
  password: string;
  token: string;
  username: string;
  address: string;
  phone: string;
}

export interface RegisterRequestTypes {
  email: string;
  password: string;
  token: string;
  fullName: string;
  address: string;
  phone: string;
}

export interface LoginRequestTypes {
  email: string;
  password: string;
}

export interface AuthResponseTypes {
  status: string;
  accessToken: string;
}