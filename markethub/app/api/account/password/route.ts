import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updatePassword } from '@/lib/data/users'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both current and new password are required.' }, { status: 400 })
    }
    if (
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    ) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters with an uppercase letter and a number.' },
        { status: 400 }
      )
    }

    updatePassword(session.user.email, currentPassword, newPassword)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update password.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
