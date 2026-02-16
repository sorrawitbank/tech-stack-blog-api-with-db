export interface UserIdBody {
  userId: string;
}

export interface PostBody {
  image: string;
  imageAlt?: string;
  categories: string[];
  title: string;
  description: string;
  content: string;
  status: string;
}

export type CreatePostBody = UserIdBody & PostBody;

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody extends LoginBody {
  name: string;
  username: string;
}

export interface ResetPasswordBody {
  oldPassword: string;
  newPassword: string;
}
