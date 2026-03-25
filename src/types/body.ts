export interface UserBody {
  name: string;
  username: string;
}

export interface AdminUserBody extends UserBody {
  bio: string;
}

export interface PostBody {
  imageAlt?: string;
  categories: string[];
  title: string;
  description: string;
  content: string;
  status: string;
}

export interface CategoryBody {
  name: string;
}

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
