import { NextResponse } from 'next/server'

export async function POST(req: Request){
  const { email, password } = await req.json()
  if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_token', process.env.ADMIN_TOKEN!, { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV==='production', maxAge: 60*60*8 })
    return res
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
