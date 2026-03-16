import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'sochasse-admin-secret-key-2024'
const TOKEN_EXPIRY = '7d'

export interface User {
  id: number
  username: string
  email: string
  role: string
}

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10)
}

export const verifyPassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash)
}

export const createToken = (user: User): string => {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY
  })
}

export const verifyToken = (token: string): User | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User
    return decoded
  } catch {
    return null
  }
}

export const createAdminUser = () => {
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get('admin')
  
  if (!existing) {
    const hashedPassword = hashPassword('admin123')
    db.prepare(`
      INSERT INTO users (username, password, email, role)
      VALUES (?, ?, ?, ?)
    `).run('admin', hashedPassword, 'admin@sochasse.fr', 'admin')
    console.log('✅ Admin user created: admin / admin123')
  }
}

createAdminUser()

export const authenticateUser = (username: string, password: string) => {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any
  
  if (!user) {
    return null
  }
  
  if (verifyPassword(password, user.password)) {
    return { id: user.id, username: user.username, email: user.email, role: user.role }
  }
  
  return null
}
