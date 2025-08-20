export interface Profile {
  id: string
  userId: string
  username: string
  avatarUrl?: string
  bio?: string
  location?: string
  status?: 'online' | 'offline'
  lastSeen?: string
}
