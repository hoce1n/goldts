export interface SendOtpRequest {
    phoneNumber: string;
  }
  
export interface SendOtpResponse {
  phoneNumber: string;
  expireInSeconds: number;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  code: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  rawRefreshToken: string;
  accessTokenExpiresAt: string;
  isProfileCompleted: boolean;
}

export interface CompleteRegistrationRequest {
  firstName: string;
  lastName: string;
  nationalCode: string;
  birthDate: string;
  email: string;
}

export interface CompleteRegistrationResponse {
  accessToken: string;
  isProfileCompleted: boolean
  firstName: string;
  lastName: string;
  nationalCode: string;
  birthDate: string;
  email: string;
}

export enum Role {
  User = 1,
  Admin = 2,
  Manager = 3
}

export interface MeResponse {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: Role;
  nationalCode: string;
  birthdate: string;
  email: string;
  verificationLevel: number;
  isProfileCompleted: boolean;
}

export interface LogoutResponse {
  revokedAt: boolean;
  message: string;
}