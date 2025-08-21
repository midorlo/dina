import type { Blog, Post, PostItem } from '@/types'
import {
  mockBlogPostsData as blogPosts,
  blogPostsDetails,
  mockBlogsData as blogsData,
} from '@/data/mock-data.ts'
import { apiFetch } from '@/services/api'
import { delay, useMocks } from '@/utils/mock.ts'

export async function fetchBlogs(): Promise<Blog[]> {
  if (!useMocks) {
    const res = await apiFetch('/api/blogs')
    return res.json()
  }
  return delay(blogsData, 500)
}

export async function fetchBlog(id: string): Promise<Blog | undefined> {
  if (!useMocks) {
    const res = await apiFetch(`/api/blogs/${id}`)
    return res.json()
  }
  return delay(
    blogsData.find((b) => b.id === id),
    500
  )
}

export async function fetchBlogPosts(blogId: string): Promise<PostItem[]> {
  if (!useMocks) {
    const res = await apiFetch(`/api/blogs/${blogId}/posts`)
    return res.json()
  }
  return delay(mockBlogPostsData[blogId] || [], 500)
}

export async function fetchBlogPost(blogId: string, postId: string): Promise<Post | undefined> {
  if (!useMocks) {
    const res = await apiFetch(`/api/blogs/${blogId}/posts/${postId}`)
    return res.json()
  }
  return delay(blogPostsDetails[`${blogId}:${postId}`], 500)
}
