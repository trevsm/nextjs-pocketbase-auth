export interface User {
  id: string;
  avatar: string;
  email: string;
  username: string;
  hashed_password: string;
  name: string;
  created: string;
  updated: string;
  _type: "User";
}

export interface PublicUser {
  id: string;
  avatar: string;
  email: string;
  username: string;
  name: string;
  _type: "PublicUser";
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    _type: "PublicUser",
  };
}

export interface AuthPayload {
  token: string;
  user_id: string;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
}
