const form = document.querySelector("#contact-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.querySelector("#form-status");
    const btn = form.querySelector('button[type="submit"]');
    status.textContent = "Enviando consulta...";
    status.className = "form-status";
    btn.disabled = true;

    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.code || "SEND_FAILED");

      status.textContent = "Consulta enviada correctamente. Te responderemos lo antes posible.";
      status.className = "form-status ok";
      form.reset();
    } catch (err) {
      console.error(err);
      status.textContent = "No se pudo enviar la consulta. Revisa la configuración SMTP de Webempresa en Vercel.";
      status.className = "form-status error";
    } finally {
      btn.disabled = false;
    }
  });
}
