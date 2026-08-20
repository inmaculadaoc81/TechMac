const nodemailer = require("nodemailer");

const clean = (v, max = 2500) =>
  String(v ?? "").replace(/[<>]/g, "").trim().slice(0, max);

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      service: "AppleTechMac Webempresa SMTP API",
      node: process.version,
      environment: {
        SMTP_HOST: !!process.env.SMTP_HOST,
        SMTP_PORT: !!process.env.SMTP_PORT,
        SMTP_USER: !!process.env.SMTP_USER,
        SMTP_PASS: !!process.env.SMTP_PASS,
        CONTACT_EMAIL: !!process.env.CONTACT_EMAIL
      }
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, code: "METHOD_NOT_ALLOWED" });
  }

  try {
    const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
    const missing = required.filter(k => !process.env[k]);
    if (missing.length) {
      return res.status(500).json({ ok: false, code: "MISSING_SMTP_ENV", missing });
    }

    const d = req.body || {};
    const nombre = clean(d.nombre, 120);
    const telefono = clean(d.telefono, 50);
    const email = clean(d.email, 160);
    const equipo = clean(d.equipo, 180);
    const mensaje = clean(d.mensaje, 3000);

    if (!nombre || !telefono || !email || !equipo || !mensaje) {
      return res.status(400).json({ ok: false, code: "INVALID_FORM_DATA" });
    }

    const port = Number(process.env.SMTP_PORT || 465);
    const secure = String(process.env.SMTP_SECURE || (port === 465 ? "true" : "false")) === "true";

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"AppleTechMac" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || "soporte@kelatos.com",
      replyTo: email,
      subject: "Nueva consulta AppleTechMac - comorepararmimac.es",
      text:
`Nueva consulta AppleTechMac

Nombre: ${nombre}
Teléfono: ${telefono}
Email: ${email}
Equipo: ${equipo}

Consulta:
${mensaje}`
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("AppleTechMac SMTP error:", error);
    return res.status(500).json({
      ok: false,
      code: "SMTP_SEND_FAILED",
      detail: error && error.code ? error.code : "UNKNOWN"
    });
  }
};
