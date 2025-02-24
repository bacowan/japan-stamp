import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Extend NextRequest to include `geo`
interface NextRequestWithGeo extends NextRequest {
  geo?: {
    country?: string;
  };
}

export function middleware(request: NextRequestWithGeo) {
  const country = request.geo?.country;
  const response = NextResponse.next();

  if (country) {
    response.headers.set('x-country', country); // Pass country as a custom header
  }

  return response;
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/',
}