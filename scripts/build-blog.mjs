// Genera el blog de TechMac (comorepararmimac.es) a partir de los artículos Markdown de content/blog/.
//
//   content/blog/<slug>.md  ->  blog/<slug>.html      (artículo)
//                               blog.html             (portada del blog)
//                               sitemap.xml           (home + blog + artículos)
//
// Se ejecuta en cada despliegue de Vercel (npm run build). Los artículos los crea el agente SEO de Kelatos (o cualquiera a mano):
// basta con añadir un .md con este encabezado y la web se actualiza sola al desplegar.
//
//   ---
//   title: "Título del artículo"
//   description: "Resumen para Google (150-160 caracteres)"
//   date: 2026-10-27            (si es una fecha futura, el artículo no se publica hasta ese día)
//   slug: "titulo-del-articulo"
//   keyword: "palabra clave"
//   category: "Diagnóstico"
//   tags: ["mac", "no enciende"]            (opcional)
//   image: "/blog-img/archivo.jpg"          (opcional)
//   imageAlt: "Texto alternativo"           (opcional)
//   draft: true                             (opcional: no se publica)
//   ---
//   Texto en Markdown (sin HTML: se descarta).
//
// La cabecera, el pie, el banner de cookies y Google Analytics se copian de index.html, así que cualquier cambio en la home se
// refleja aquí. Si no se pueden extraer, se usa una versión mínima y el despliegue no falla.

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITIO = "https://comorepararmimac.es";
const NOMBRE = "TechMac";
const CARPETA_CONTENIDO = join(RAIZ, "content", "blog");
const CARPETA_SALIDA = join(RAIZ, "blog");
const TELEFONO_WHATSAPP = "https://api.whatsapp.com/send?phone=34649970128&text=%C2%A1Hola%20TechMac!";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const hoy = new Date().toISOString().slice(0, 10);
const fechaLarga = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

// ── Markdown → HTML (el HTML en bruto se descarta: los artículos son solo texto y Markdown) ──
const marked = new Marked({ gfm: true, breaks: false, renderer: { html: () => "" } });
const aHtml = (md) => marked.parse(md)
  .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a rel="noopener" target="_blank" href="$1"')
  .replace(/<h1>/g, "<h2>").replace(/<\/h1>/g, "</h2>");

// ── Encabezado (frontmatter) ──
function leerArticulo(archivo) {
  const crudo = readFileSync(join(CARPETA_CONTENIDO, archivo), "utf8").replace(/\r\n/g, "\n");
  const m = crudo.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const meta = {};
  for (const linea of m[1].split("\n")) {
    const kv = linea.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('"') || v.startsWith("[")) { try { v = JSON.parse(v); } catch { v = v.replace(/^"|"$/g, ""); } }
    else if (v === "true" || v === "false") v = v === "true";
    meta[kv[1]] = v;
  }
  const slug = String(meta.slug || archivo.replace(/\.md$/, "")).toLowerCase();
  if (!meta.title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const date = /^\d{4}-\d{2}-\d{2}/.test(String(meta.date)) ? String(meta.date).slice(0, 10) : hoy;
  return {
    slug, date, title: String(meta.title), description: String(meta.description || "").trim(),
    category: String(meta.category || "Guías"), tags: Array.isArray(meta.tags) ? meta.tags.map(String) : [],
    image: typeof meta.image === "string" && meta.image.startsWith("/") ? meta.image : "", imageAlt: String(meta.imageAlt || meta.title),
    draft: meta.draft === true, cuerpo: m[2].trim(),
  };
}

function cargarArticulos() {
  if (!existsSync(CARPETA_CONTENIDO)) return [];
  return readdirSync(CARPETA_CONTENIDO)
    .filter((f) => f.endsWith(".md") && !/^readme/i.test(f))
    .map((f) => { try { return leerArticulo(f); } catch (e) { console.warn(`[blog] no se pudo leer ${f}: ${e.message}`); return null; } })
    .filter((a) => a && !a.draft && a.date <= hoy)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

// ── Piezas copiadas de la home ──
const index = readFileSync(join(RAIZ, "index.html"), "utf8");
const pieza = (re, respaldo = "") => { const m = index.match(re); if (!m) console.warn(`[blog] no se encontró ${re} en index.html: se usa la versión mínima`); return m ? m[0] : respaldo; };
const arreglarEnlaces = (html) => html.replace(/href="#/g, 'href="/#');

const analytics = pieza(/<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]+"><\/script>\s*<script>[\s\S]*?<\/script>/);
const cabecera = arreglarEnlaces(pieza(/<header class="header">[\s\S]*?<\/header>/, `<header class="header"><div class="wrap nav"><a href="/"><img class="logo" src="/assets/logo.png" alt="${NOMBRE}"></a></div></header>`));
const avisoIndependiente = pieza(/<div class="disclaimer-bar">[\s\S]*?<\/div>/);
const pie = arreglarEnlaces(pieza(/<footer class="footer">[\s\S]*?<\/footer>/));
const whatsappFlotante = pieza(/<a class="floatwa"[\s\S]*?<\/a>/);
const iCookies = index.indexOf('<div id="cookie-banner"');
const cookies = iCookies >= 0 ? index.slice(iCookies, index.lastIndexOf("</body>")) : "";

function pagina({ titulo, descripcion, canonical, imagen, tipoOg = "website", jsonld = [], cuerpo }) {
  const og = imagen ? `<meta property="og:image" content="${esc(imagen.startsWith("http") ? imagen : SITIO + imagen)}">` : `<meta property="og:image" content="${SITIO}/assets/logo.png">`;
  return `<!doctype html><html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
<link rel="canonical" href="${esc(canonical)}"><meta property="og:title" content="${esc(titulo)}"><meta property="og:description" content="${esc(descripcion)}"><meta property="og:type" content="${tipoOg}"><meta property="og:url" content="${esc(canonical)}">${og}
<link rel="icon" href="/assets/logo.png"><link rel="stylesheet" href="/assets/styles.css"><link rel="stylesheet" href="/assets/blog.css">
<meta name="robots" content="index,follow">
${analytics}
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`).join("\n")}
</head><body>
${cabecera}${avisoIndependiente}
<main>
${cuerpo}
</main>
${pie}
${whatsappFlotante}
${cookies}
</body></html>
`;
}

const botonesContacto = `<div class="post-cta-actions"><a class="btn btn-wa" href="${TELEFONO_WHATSAPP}">Escríbenos por WhatsApp</a><a class="btn btn-line" href="/#cita">Pedir cita de 30 minutos</a></div>`;

function tarjeta(a) {
  return `<article class="blog-card"><a class="blog-card-link" href="/blog/${a.slug}">
${a.image ? `<img class="blog-card-img" src="${esc(a.image)}" alt="${esc(a.imageAlt)}" loading="lazy">` : ""}
<div class="blog-card-body"><div class="kicker">${esc(a.category)}</div><h2>${esc(a.title)}</h2><p>${esc(a.description)}</p><span class="blog-card-meta">${fechaLarga(a.date)} · Leer →</span></div></a></article>`;
}

function portada(articulos) {
  const lista = articulos.length
    ? `<div class="blog-grid">${articulos.map(tarjeta).join("\n")}</div>`
    : `<div class="blog-empty"><h2>Estamos preparando las primeras guías</h2><p>Mientras tanto, cuéntanos qué le pasa a tu Mac y te ayudamos: el diagnóstico es gratuito.</p>${botonesContacto}</div>`;
  const cuerpo = `<section class="soft blog-hero"><div class="wrap"><div class="kicker">Blog de ${NOMBRE}</div><h1>Guías para cuando tu Mac falla</h1><p class="blog-lead">Qué hacer (y qué evitar) cuando tu Mac no enciende, no arranca o va lento, cómo proteger tus archivos y cuándo merece la pena repararlo. Explicado sin tecnicismos.</p></div></section>
<section><div class="wrap">${lista}</div></section>`;
  return pagina({
    titulo: `Blog de reparación de Mac en Madrid | ${NOMBRE}`,
    descripcion: "Guías claras sobre averías de Mac, cómo proteger tus archivos y cuándo reparar tu MacBook, iMac o Mac mini. Servicio técnico Mac en Madrid.",
    canonical: `${SITIO}/blog`,
    jsonld: [{ "@context": "https://schema.org", "@type": "Blog", name: `Blog de ${NOMBRE}`, url: `${SITIO}/blog`, inLanguage: "es" }],
    cuerpo,
  });
}

function articulo(a, todos) {
  const url = `${SITIO}/blog/${a.slug}`;
  const relacionados = todos.filter((x) => x.slug !== a.slug).slice(0, 3);
  const cuerpo = `<article class="post"><div class="wrap post-wrap">
<nav class="crumbs" aria-label="Migas de pan"><a href="/">Inicio</a> › <a href="/blog">Blog</a> › <span>${esc(a.title)}</span></nav>
<div class="kicker">${esc(a.category)}</div>
<h1>${esc(a.title)}</h1>
<p class="post-meta">Publicado el ${fechaLarga(a.date)} · ${NOMBRE}, servicio técnico Mac en Madrid</p>
${a.image ? `<img class="post-img" src="${esc(a.image)}" alt="${esc(a.imageAlt)}">` : ""}
<div class="post-body">${aHtml(a.cuerpo)}</div>
<aside class="post-cta"><h2>¿Tu Mac tiene este problema?</h2><p>Cuéntanos qué hace. El diagnóstico es gratuito y no te comprometes a nada: primero entendemos qué ocurre, después decides tú.</p>${botonesContacto}</aside>
</div>
${relacionados.length ? `<div class="wrap post-related"><h2>Sigue leyendo</h2><div class="blog-grid">${relacionados.map(tarjeta).join("\n")}</div></div>` : ""}
</article>`;
  return pagina({
    titulo: `${a.title} | ${NOMBRE}`,
    descripcion: a.description || a.title,
    canonical: url, imagen: a.image, tipoOg: "article",
    jsonld: [
      { "@context": "https://schema.org", "@type": "BlogPosting", headline: a.title, description: a.description, datePublished: a.date, dateModified: a.date, inLanguage: "es", mainEntityOfPage: url,
        ...(a.image ? { image: a.image.startsWith("http") ? a.image : SITIO + a.image } : {}),
        author: { "@type": "Organization", name: NOMBRE, url: SITIO }, publisher: { "@type": "Organization", name: NOMBRE, url: SITIO, logo: { "@type": "ImageObject", url: `${SITIO}/assets/logo.png` } } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITIO}/` }, { "@type": "ListItem", position: 2, name: "Blog", item: `${SITIO}/blog` }, { "@type": "ListItem", position: 3, name: a.title, item: url } ] },
    ],
    cuerpo,
  });
}

function sitemap(articulos) {
  const urls = [`<url><loc>${SITIO}/</loc></url>`, `<url><loc>${SITIO}/blog</loc>${articulos[0] ? `<lastmod>${articulos[0].date}</lastmod>` : ""}</url>`,
    ...articulos.map((a) => `<url><loc>${SITIO}/blog/${a.slug}</loc><lastmod>${a.date}</lastmod></url>`)];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
}

// ── Generar ──
const articulos = cargarArticulos();
rmSync(CARPETA_SALIDA, { recursive: true, force: true });
mkdirSync(CARPETA_SALIDA, { recursive: true });
writeFileSync(join(RAIZ, "blog.html"), portada(articulos));
for (const a of articulos) writeFileSync(join(CARPETA_SALIDA, `${a.slug}.html`), articulo(a, articulos));
writeFileSync(join(RAIZ, "sitemap.xml"), sitemap(articulos));
console.log(`[blog] ${articulos.length} artículo(s) publicado(s)`);
