AppleTechMac - versión corregida para Vercel

POR QUÉ SALÍA HTTP 405:
Vercel no ejecuta archivos PHP como contacto.php en un proyecto estático.
El formulario anterior apuntaba a contacto.php, por eso no podía funcionar en Vercel.

FORMULARIO NUEVO:
contacto.html -> JavaScript -> /api/contact -> SMTP de Webempresa -> soporte@kelatos.com

Variables necesarias en Vercel:
SMTP_HOST       = servidor SMTP que te indique Webempresa
SMTP_PORT       = normalmente 465 (SSL) o 587 (STARTTLS)
SMTP_SECURE     = true para 465 / false para 587
SMTP_USER       = soporte@kelatos.com
SMTP_PASS       = contraseña del buzón soporte@kelatos.com
CONTACT_EMAIL   = soporte@kelatos.com (opcional; si no existe usa soporte@kelatos.com)

Después de añadir/cambiar variables: hacer Redeploy.

PRUEBA:
Abrir /api/contact
Debe mostrar SMTP_HOST, SMTP_PORT, SMTP_USER y SMTP_PASS en true.

SEO:
Se han mejorado títulos, descripciones y canonical de home, servicios, modelos y páginas individuales.

PRECIOS:
Se añadió la sección general de familias:
iMac, Mac mini, Mac Pro, MacBook, MacBook Air, MacBook Pro y MacBook Retina.
Cada familia enlaza a su página; la página de precios no enumera los modelos exactos.

Google Analytics:
G-HSL4TYWB2J


Ahora solo hay 7 páginas de modelos: iMac, Mac mini, Mac Pro, MacBook, MacBook Air, MacBook Pro y MacBook Retina. El menú incluye reparaciones frecuentes por familia.
