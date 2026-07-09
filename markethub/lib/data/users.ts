import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

export interface StoredUser {
  id: string
  name: string
  email: string
  passwordHash: string
  role: 'admin' | 'customer'
  createdAt: string
}

export type PublicUser = Omit<StoredUser, 'passwordHash'>

function seedUsers(): StoredUser[] {
  // Default admin account for the manager portal
  return [
    {
      id: 'usr_admin',
      name: 'Store Manager',
      email: 'admin@markethub.com',
      passwordHash: bcrypt.hashSync('Admin123', 10),
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
  ]
}

function readUsers(): StoredUser[] {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    const seeded = seedUsers()
    writeUsers(seeded)
    return seeded
  }
}

function writeUsers(users: StoredUser[]): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

function toPublic(user: StoredUser): PublicUser {
  const pub: Partial<StoredUser> = { ...user }
  delete pub.passwordHash
  return pub as PublicUser
}

export function getAllUsers(): PublicUser[] {
  return readUsers().map(toPublic)
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return readUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  )
}

export function createUser(data: {
  name: string
  email: string
  password: string
}): PublicUser {
  const users = readUsers()
  if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error('An account with this email already exists.')
  }

  const user: StoredUser = {
    id: `usr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    passwordHash: bcrypt.hashSync(data.password, 10),
    role: 'customer',
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  writeUsers(users)

  return toPublic(user)
}

export function updatePassword(
  email: string,
  currentPassword: string,
  newPassword: string
): void {
  const users = readUsers()
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  )
  if (!user) {
    throw new Error('No account found for this email. (Demo accounts cannot change passwords.)')
  }
  if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
    throw new Error('Current password is incorrect.')
  }
  user.passwordHash = bcrypt.hashSync(newPassword, 10)
  writeUsers(users)
}

export function verifyCredentials(
  email: string,
  password: string
): PublicUser | null {
  const user = findUserByEmail(email)
  if (!user) return null
  if (!bcrypt.compareSync(password, user.passwordHash)) return null
  return toPublic(user)
}
