<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") { http_response_code(405); exit("Método no permitido"); }
function c($v){return trim(strip_tags((string)$v));}
$n=c($_POST["nombre"]??""); $t=c($_POST["telefono"]??""); $e=filter_var($_POST["email"]??"",FILTER_SANITIZE_EMAIL); $eq=c($_POST["equipo"]??""); $m=c($_POST["mensaje"]??"");
if(!$n||!$t||!filter_var($e,FILTER_VALIDATE_EMAIL)||!$eq||!$m||empty($_POST["privacidad"])){http_response_code(400);exit("Faltan datos obligatorios.");}
$body="Nombre: $n\nTeléfono: $t\nEmail: $e\nEquipo: $eq\n\nConsulta:\n$m";
$headers="From: AppleTechMac <soporte@kelatos.com>\r\nReply-To: $e\r\nContent-Type: text/plain; charset=UTF-8";
if(mail("soporte@kelatos.com","Nueva consulta AppleTechMac",$body,$headers)){header("Location: gracias.html");exit;}
http_response_code(500);echo "No se pudo enviar. Contacta con soporte@kelatos.com.";
?>