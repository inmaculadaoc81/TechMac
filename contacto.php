<?php
// Archivo legado: Vercel no ejecuta PHP.
// El formulario actual usa /api/contact (Node.js) y SMTP de Webempresa.
http_response_code(410);
echo "Este formulario ya utiliza /api/contact mediante SMTP de Webempresa.";
?>