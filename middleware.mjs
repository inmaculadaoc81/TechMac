// middleware.mjs
//
// TechMac pasó de ser un sitio multipágina (con /servicios/... y
// /modelos/..., eliminados en commits anteriores) a una sola página
// (one-page). Cualquier URL antigua que ya no forme parte del sitemap
// actual (que solo tiene "/") debe redirigir a la home en vez de dar
// un 404.
//
// El matcher de abajo excluye /api/* y cualquier ruta con extensión
// (archivos estáticos: .css, .js, .svg, etc.), así que esta función
// solo se ejecuta para rutas "de página". Si esa ruta no es la home,
// se redirige (301) a "/".

import { next } from '@vercel/functions'

function normalize(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

export default function middleware(request) {
  const url = new URL(request.url)
  const normalized = normalize(url.pathname)

  if (normalized === '' || normalized === '/') {
    return next()
  }

  return Response.redirect(new URL('/', url.origin), 301)
}

export const config = {
  matcher: ['/((?!api/|.*\\..*).*)'],
}
