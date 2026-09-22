<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Trámite - DRTC</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f7; padding: 20px 0;">
        <tr>
            <td align="center">
                <!-- Contenedor principal adaptable -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

                    <!-- Cabecera Institucional -->
                    <tr>
                        <td style="background-color: #1e3a8a; padding: 24px; text-align: center; color: #ffffff;">
                            <h2 style="margin: 0; font-size: 20px; font-weight: bold;">DRTC - Huancavelica</h2>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #93c5fd;">Mesa de Partes Virtual</p>
                        </td>
                    </tr>

                    <!-- Cuerpo del Mensaje -->
                    <tr>
                        <td style="padding: 30px 24px; color: #374151; font-size: 15px; line-height: 1.6;">
                            <p style="margin-top: 0;">
                                Estimado(a) Señor(a): <strong>{{ $expedient->sender_name }}</strong>, identificado(a) con DNI/RUC: <strong>{{ $expedient->document_number }}</strong> y correo electrónico: <strong>{{ $expedient->email }}</strong>.
                            </p>

                            <p style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px; margin: 20px 0; font-size: 14px; color: #4b5563;">
                                La información registrada en el formulario de solicitud de trámite es confidencial y será validada para su respectiva trazabilidad.
                            </p>

                            <p style="margin-bottom: 8px;">Puede ingresar al siguiente enlace para visualizar el avance de su expediente:</p>

                            <!-- Bloque de Código y Enlace Destacado -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; border-radius: 6px; padding: 16px; margin: 20px 0;">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 8px 0; font-size: 14px;">
                                            <strong>CÓDIGO DE TRÁMITE:</strong><br>
                                            <span style="font-size: 18px; color: #1e3a8a; font-weight: bold; letter-spacing: 1px;">{{ $expedient->tracking_number }}</span>
                                        </p>
                                        <p style="margin: 12px 0 0 0; font-size: 14px; word-break: break-all;">
                                            <strong>ENLACE DE SEGUIMIENTO:</strong><br>
                                            <a href="{{ config('app.frontend_url') }}/mesa-de-partes/seguimiento" target="_blank" style="color: #2563eb; text-decoration: underline;">{{ config('app.frontend_url') }}/tramites/seguimiento</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin-bottom: 0; font-size: 13px; color: #6b7280;">
                                Este es un mensaje automático generado por el sistema de la Dirección Regional de Transportes y Comunicaciones. Por favor, no responda a este correo.
                            </p>
                        </td>
                    </tr>

                    <!-- Pie de página -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
                            &copy; 2026 DRTC Huancavelica. Todos los derechos reservados.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
