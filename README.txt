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
G-HSL4TYWB2J

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
- Añadidos datos schema.org LocalBusiness (no existían). En esa
  primera pasada se usó por error el teléfono de los botones
  (+34 914 46 85 03, número de un bot de llamadas usado a propósito en
  botones de varias webs de la familia) en vez del de la caja de
  información. CORREGIDO en una pasada posterior: el cliente confirmó
  la norma general — el schema.org debe usar siempre el teléfono de la
  caja de información, no el de los botones. Ahora el schema usa
  +34 919 29 80 50 (el de "Teléfono de información"); los botones
  siguen apuntando a +34 914 46 85 03 sin cambios, tal como debe ser.

PENDIENTE DE REVISAR:
- El iframe de Google Maps (sección "Dónde estamos") apunta a una ficha
  llamada "AppleTechMac" en la URL, no "TechMac". Puede ser la misma
  ubicación física con otro nombre de ficha, o un enlace heredado de
  otra marca de la familia. No se ha tocado el src (según la norma de
  mantener los enlaces), pero conviene confirmarlo.

HISTORIAL: el repositorio era multipágina (7 páginas /modelos/ de
equipos Mac y varias páginas /servicios/) y se convirtió a one-page;
esas páginas fueron eliminadas en commits anteriores. Como ya no
existen en el sitemap actual, se ha añadido middleware.mjs para
redirigir (301) cualquier URL antigua a la home, evitando 404 en
enlaces indexados o backlinks antiguos. Excluye /api/* y cualquier
ruta con extensión de archivo. Se añadió "@vercel/functions": "^2.0.3"
a package.json como dependencia de esta función.

REVISIÓN ADICIONAL (esta pasada):
- .navcall: el texto largo ("Atención Telefónica 24 horas 365 días")
  deformaba la píldora del menú de escritorio (el menú móvil ya tenía
  solo el número). Acortado a solo el número (mismo número,
  +34 914 46 85 03); no se ha tocado el teléfono informativo distinto
  (+34 919 29 80 50) que aparece solo como texto en la caja de
  contacto, tal como está documentado arriba.
- H1 de portada reescrito, corto, directo y totalmente afirmativo (sin
  interrogación ni condicionales), incluye "Mac": "Tu Mac no enciende.
  Lo reparamos y cuidamos tus archivos."
- CSS del H1: se encontraron dos bloques de estilos que fijaban el
  tamaño del H1 en móvil de forma contradictoria (un bloque "Ajustes
  solicitados" que lo reducía a clamp(28-50px) en escritorio y a un
  flat 28px en móvil, pisando la regla base de clamp(38-60px) y la
  regla de 38px en el mismo breakpoint 580px). No estaba documentado
  en este README como una decisión deliberada de tamaño, así que se ha
  tratado como una regla duplicada/con bug y se ha consolidado en una
  sola regla, ahora con el tamaño estándar de la familia: clamp(46-
  74px) en escritorio, 48px en móvil.

REVISIÓN ADICIONAL (checklist unificado de la familia, a petición del cliente):
- H1 ya era razonablemente distinto ("no enciende..." vs "no funciona"
  usado en otros repos); verificado, sin cambios.
- Verificado: sin elemento .hero-chip/.hero-tag decorativo (no aplica
  la regla de quitarlo); sin textos decorativos gigantes que se
  corten en móvil; schema.org ya usaba correctamente el teléfono de
  la caja de información; formulario correctamente conectado a
  /api/contact (nombre distinto al habitual "contacto", verificado
  que coincide exactamente). Sin cambios en ninguno de estos.
- Añadida franja de aviso de servicio técnico independiente debajo
  del menú (no existía en ningún sitio del repo).
- Añadido "Sábados, domingos y días festivos estamos cerrados" debajo
  del horario.
- Enlace de política de privacidad: la casilla existía pero sin
  enlace. Añadido a https://kelatos.com/privacy-policy/, en azul y
  subrayado.
- Botón "Atención Telefónica..." sin icono, a diferencia del de
  WhatsApp. Añadido.

REVISIÓN ADICIONAL — BUG REAL introducido por mí (a petición del cliente, tras ver captura en vivo):
- Al añadir el icono al botón "Atención Telefónica..." en el commit
  anterior, se me olvidó cerrar la etiqueta </a> del botón. Ese HTML
  mal formado hacía que el navegador interpretara mal el resto del
  marcado del hero, y la caja de información (.info) dejaba de
  aparecer en su columna junto al texto — se veía vacío ese lado del
  hero. Corregido añadiendo el </a> que faltaba. Verificado el
  balance de etiquetas <a>/</a> en todo el archivo (32/32).
