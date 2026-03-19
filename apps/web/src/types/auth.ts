export type AuthRole = "admin" | "moderator" | "user";

export type AuthMe = {
  id: string;
  role: AuthRole;
};

export type AuthStatus = "loading" | "authenticated" | "guest" | "signed_out";

export type AuthResponse = {
  token: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: AuthRole;
  suspended: boolean;
  verified: boolean;
  createdAt: number | string;
};

export type PasswordResetToken = {
  resetToken: string;
};
