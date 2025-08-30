import type { Blog, Post, PostItem } from '@/types';
import { useQuery } from '@tanstack/vue-query';
import { db } from '@/data/normalized-mock-data';
import { apiFetch } from '@/services/api';
import { delay, useMocks } from '@/utils/mock.ts';

// =================================================================
// Data Assembly Helpers
// =================================================================

function assembleBlog(blogData: (typeof db.blogs)[0]): Blog {
  const author = db.users.find(u => u.id === blogData.authorId);
  const posts = db.posts.filter(p => p.blogId === blogData.id);
  const postCount = posts.length;
  const lastPostAt = posts.reduce<string | undefined>(
    (latest, p) => (!latest || p.createdAt > latest ? p.createdAt : latest),
    undefined
  );
  return {
    id: blogData.id,
    name: blogData.name,
    description: blogData.description,
    authorId: blogData.authorId,
    authorHandle: author?.name ?? 'Unknown',
    authorAvatarUrl: author?.avatarUrl,
    postCount,
    lastPostAt,
    createdAt: blogData.createdAt
  };
}

function assemblePost(postData: (typeof db.posts)[0]): Post {
  const blog = db.blogs.find(b => b.id === postData.blogId);
  const author = db.users.find(u => u.id === blog?.authorId);
  return {
    id: postData.id,
    blogId: postData.blogId,
    blogName: blog?.name ?? 'Unknown Blog',
    title: postData.title,
    author: author?.name ?? 'Unknown Author',
    authorAvatarUrl: author?.avatarUrl,
    date: postData.createdAt,
    category: postData.category,
    imageUrl: postData.imageUrl,
    content: postData.content
  };
}

// =================================================================
// Vue Query Composables
// =================================================================

// --- MOCK IMPLEMENTATIONS ---

function mockFetchBlogs() {
  return delay(
    db.blogs.map(blog => assembleBlog(blog)),
    500
  );
}
function mockFetchBlog(id: string) {
  const blogData = db.blogs.find(b => b.id === id);
  if (!blogData) return delay(undefined, 500);
  return delay(assembleBlog(blogData), 500);
}
function mockFetchBlogPosts(blogId: string) {
  const posts = db.posts
    .filter(p => p.blogId === blogId)
    .map(p => ({ id: p.id, title: p.title, createdAt: p.createdAt, excerpt: p.excerpt }));
  return delay(posts, 500);
}
function mockFetchBlogPost(blogId: string, postId: string) {
  const postData = db.posts.find(p => p.id === postId && p.blogId === blogId);
  if (!postData) return delay(undefined, 500);
  return delay(assemblePost(postData), 500);
}

// --- API IMPLEMENTATIONS ---

const apiFetchBlogs = () => apiFetch('/api/v1/blogs').then(res => res.json());
const apiFetchBlog = (id: string) => apiFetch(`/api/v1/blogs/${id}`).then(res => res.json());
const apiFetchBlogPosts = (blogId: string) => apiFetch(`/api/v1/blogs/${blogId}/posts`).then(res => res.json());
function apiFetchBlogPost(blogId: string, postId: string) {
  return apiFetch(`/api/v1/blogs/${blogId}/posts/${postId}`).then(res => res.json());
}

// --- COMPOSABLES ---

export function useBlogs() {
  return useQuery<Blog[]>({
    queryKey: ['blogs'],
    queryFn: useMocks ? mockFetchBlogs : apiFetchBlogs
  });
}

export function useBlog(id: string) {
  return useQuery<Blog | undefined>({
    queryKey: ['blogs', id],
    queryFn: () => (useMocks ? mockFetchBlog(id) : apiFetchBlog(id))
  });
}

export function useBlogPosts(blogId: string) {
  return useQuery<PostItem[]>({
    queryKey: ['blogs', blogId, 'posts'],
    queryFn: () => (useMocks ? mockFetchBlogPosts(blogId) : apiFetchBlogPosts(blogId))
  });
}

export function useBlogPost(blogId: string, postId: string) {
  return useQuery<Post | undefined>({
    queryKey: ['blogs', blogId, 'posts', postId],
    queryFn: () => (useMocks ? mockFetchBlogPost(blogId, postId) : apiFetchBlogPost(blogId, postId))
  });
}
