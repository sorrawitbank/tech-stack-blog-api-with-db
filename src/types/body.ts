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
