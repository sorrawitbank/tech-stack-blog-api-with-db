export interface CategoryBody {
  name: string;
}

export interface PostBody {
  imageAlt?: string;
  categoryIds: number[];
  title: string;
  description: string;
  content: string;
  statusId: number;
}

export interface CommentBody {
  comment: string;
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

export interface UserBody {
  name: string;
  username: string;
}

export interface AdminUserBody extends UserBody {
  bio: string;
}
