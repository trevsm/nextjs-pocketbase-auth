export const Tokens = {
  accessTokenId: "accessToken",
  accessTokenExpiresIn: 60 * 20, // 30 minutes
  refreshTokenId: "refreshToken",
  refreshTokenExpiresIn: 60 * 60 * 24 * 7, // 7 days
  verificationCodeExpiresIn: 60 * 5, // 5 minutes
};

export const Routes = {
  home: "/",
  dashboard: "/dashboard",
  login: "/auth/login",
  register: "/auth/register",
  forgotPassword: "/auth/forgot-password",
};
