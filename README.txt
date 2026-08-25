TechMac ONE PAGE - versión de prueba

FORMULARIO:
Configura en Vercel estas variables para usar el correo general:
SMTP_HOST=cp7124.webempresa.eu
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=soporte@kelatos.com
SMTP_PASS=[contraseña del buzón, SOLO en Vercel]
CONTACT_EMAIL=soporte@kelatos.com

La contraseña NO está incluida en el proyecto.

GOOGLE ANALYTICS:
No se ha proporcionado un ID específico para TechMac en este turno.
Por seguridad no se ha reutilizado el ID de AppleTechMac ni inventado uno.
Añadir el ID correcto antes de producción.

DISEÑO:
One Page, distinto del anterior, centrado en puntos de dolor y preocupaciones reales.
H1 basado en tiempo sin equipo + información.
Caja de información a la derecha con dirección, horario, teléfono, metro y aparcamiento.
Cal.com embebido en tema blanco.
Google Business + YouTube visibles.
Chatbot n8n incluido.

REVISIÓN (fixes aplicados):
- Menú móvil: no existía botón de menú en móvil (.navlinks se ocultaba
  a partir de 900px sin ninguna alternativa) — por eso no se veía ningún
  desplegable en móvil. Añadido botón .menu-btn + desplegable
  #mobileMenu con los mismos enlaces.
- Quitado un <div class="pain-pills"></div> vacío en el hero: existía
  el CSS para esas etiquetas pero nunca se llegó a rellenar con
  contenido, así que no hacía nada visible.
- Quitada la línea "Email de prueba: info@surface-reparacion-servicio-
  tecnico.info" en la sección de contacto — era un email de prueba de
  un dominio ajeno (ni siquiera de Mac) que se había quedado en el
  contenido de producción.
- Añadido borde blanco al botón del chatbot y reposicionado por encima
  del WhatsApp (antes el WhatsApp estaba en bottom:92px sin ningún CSS
  que posicionara el chat, así que este usaba su posición por defecto;
  ahora WhatsApp vuelve a bottom:24px y el chat va en bottom:96px).
- Añadida sección de contenido SEO propio (#guia), enlazada en el menú
  de escritorio y en el móvil.
- Añadidos datos schema.org LocalBusiness (no existían), con el
  teléfono realmente usado en los botones (+34 914 46 85 03, distinto
  del que solo aparece como texto informativo en la caja de contacto).

PENDIENTE DE REVISAR:
- El iframe de Google Maps (sección "Dónde estamos") apunta a una ficha
  llamada "AppleTechMac" en la URL, no "TechMac". Puede ser la misma
  ubicación física con otro nombre de ficha, o un enlace heredado de
  otra marca de la familia. No se ha tocado el src (según la norma de
  mantener los enlaces), pero conviene confirmarlo.
