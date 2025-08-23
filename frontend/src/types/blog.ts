export interface Blog {
  id: string;
  name: string;
  description: string;
  authorHandle: string;
  authorAvatarUrl?: string;
  postCount: number;
  createdAt: string;
}

export interface PostItem {
  id: number;
  title: string;
  createdAt: string;
  excerpt: string;
}

export interface Post {
  id: string;
  blogId: string;
  blogName: string;
  title: string;
  author: string;
  authorAvatarUrl?: string;
  date: string;
  category: string;
  imageUrl: string;
  content: string[];
}
