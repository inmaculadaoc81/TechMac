const nodemailer = require("nodemailer");
const clean=(v,m=3000)=>String(v??"").replace(/[<>]/g,"").trim().slice(0,m);

module.exports=async function(req,res){
  const env=["SMTP_HOST","SMTP_PORT","SMTP_USER","SMTP_PASS"];
  if(req.method==="GET"){
    return res.status(200).json({
      ok:true,
      service:"AppleTechMac Webempresa SMTP API",
      node:process.version,
      environment:Object.fromEntries(env.concat(["CONTACT_EMAIL"]).map(k=>[k,!!process.env[k]]))
    });
  }
  if(req.method!=="POST") return res.status(405).json({ok:false,code:"METHOD_NOT_ALLOWED"});
  try{
    const missing=env.filter(k=>!process.env[k]);
    if(missing.length) return res.status(500).json({ok:false,code:"MISSING_SMTP_ENV",missing});
    const d=req.body||{};
    const nombre=clean(d.nombre,120), telefono=clean(d.telefono,50), email=clean(d.email,160), equipo=clean(d.equipo,180), mensaje=clean(d.mensaje);
    if(!nombre||!telefono||!email||!equipo||!mensaje) return res.status(400).json({ok:false,code:"INVALID_FORM_DATA"});
    const port=Number(process.env.SMTP_PORT||465);
    const secure=String(process.env.SMTP_SECURE||(port===465?"true":"false"))==="true";
    const transporter=nodemailer.createTransport({host:process.env.SMTP_HOST,port,secure,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
    await transporter.verify();
    await transporter.sendMail({
      from:`"AppleTechMac" <${process.env.SMTP_USER}>`,
      to:process.env.CONTACT_EMAIL||"soporte@kelatos.com",
      replyTo:email,
      subject:"Nueva consulta AppleTechMac - comorepararmimac.es",
      text:`Nombre: ${nombre}\nTeléfono: ${telefono}\nEmail: ${email}\nEquipo: ${equipo}\n\nConsulta:\n${mensaje}`
    });
    return res.status(200).json({ok:true});
  }catch(e){
    console.error("AppleTechMac SMTP:",e);
    return res.status(500).json({ok:false,code:"SMTP_SEND_FAILED",detail:e.code||"UNKNOWN"});
  }
};