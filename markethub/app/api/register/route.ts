import { NextResponse } from 'next/server'
import { createUser } from '@/lib/data/users'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body || {}

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
    }
    if (
      !password ||
      typeof password !== 'string' ||
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with an uppercase letter and a number.' },
        { status: 400 }
      )
    }

    const user = createUser({ name, email, password })
    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed.'
    const status = message.includes('already exists') ? 409 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
