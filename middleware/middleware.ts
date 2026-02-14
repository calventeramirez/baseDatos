// middleware.ts - Middleware para redirigir automáticamente al setup si es necesario

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas que no necesitan verificación de setup
  const publicPaths = ["/registro", "/api"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  try {
    // Verificar estado del setup
    const setupResponse = await fetch(
      `${request.nextUrl.origin.replace(":3000", ":8000")}/estado/`,
    );

    if (setupResponse.ok) {
      const setupData = await setupResponse.json();

      if (setupData.necesita_setup) {
        // Si necesita setup y no está en /registro, redirigir
        if (pathname !== "/registro") {
          return NextResponse.redirect(new URL("/registro", request.url));
        }
      } else {
        // Si el setup está completo y está en /registro, redirigir a login
        if (pathname === "/registro") {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      }
    }
  } catch (error) {
    console.error("Error en middleware setup check:", error);
    // En caso de error, permitir continuar
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
