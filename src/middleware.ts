import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Extend NextRequest to include `geo`
interface NextRequestWithGeo extends NextRequest {
  geo?: {
    country?: string;
  };
}

export function middleware(request: NextRequestWithGeo) {
  const country = request.headers.get("x-vercel-ip-country");
  const response = NextResponse.next();

  if (country) {
    response.headers.set('x-country', country);
  }

  return response;
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/',
}