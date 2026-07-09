import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getAllUsers } from '@/lib/data/users'

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return NextResponse.json(getAllUsers())
}
