import { NextRequest, NextResponse } from "next/server";
 
const locales = ['en-US', 'jp'];
const defaultLocale = 'en-US';

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return
 
  // Redirect if there is no locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
}