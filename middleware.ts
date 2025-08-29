import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest){
  const { pathname } = req.nextUrl
  if(pathname.startsWith('/admin/dashboard')){
    const token = req.cookies.get('admin_token')?.value
    if(!token || token !== process.env.ADMIN_TOKEN){
      const url = new URL('/admin/login', req.url)
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/dashboard/:path*'] }
