import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator';
import { supportedLocales } from './localization/localization';

// Extend NextRequest to include `geo`
interface NextRequestWithGeo extends NextRequest {
  geo?: {
    country?: string;
  };
}

function setCountry(request: NextRequestWithGeo, response: NextResponse) {
  const country = request.headers.get("x-vercel-ip-country");
  if (country) {
    response.headers.set('x-country', country);
  }
}

function getLocale(request: NextRequestWithGeo) {
  let languages = new Negotiator({ headers: {
    'accept-language': request.headers.get("accept-language") ?? undefined
  }}).languages();
  let defaultLocale = 'en-US'
   
  return match(languages, supportedLocales, defaultLocale)
}

export function middleware(request: NextRequestWithGeo) {
  const response = NextResponse.next();
  setCountry(request, response);

  const url = request.nextUrl.pathname;
  const pathnameHasLocale = supportedLocales.some(
    (locale) => url.startsWith(`/${locale}/`) || url === `/${locale}`
  );
  if (pathnameHasLocale) return response;
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${url}`
  return NextResponse.redirect(request.nextUrl);
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
}