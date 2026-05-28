from datetime import date
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "Manual_Usuario_Lucy_Tejada.pdf"

BLUE = colors.HexColor("#2E74B5")
DARK_BLUE = colors.HexColor("#1F4D78")
LIGHT_BLUE = colors.HexColor("#E8EEF5")
LIGHT_GRAY = colors.HexColor("#F2F4F7")
BORDER = colors.HexColor("#D9E2EC")
TEXT = colors.HexColor("#1F2937")
MUTED = colors.HexColor("#64748B")


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "ManualTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=25,
            leading=30,
            alignment=TA_CENTER,
            textColor=DARK_BLUE,
            spaceAfter=12,
        ),
        "subtitle": ParagraphStyle(
            "ManualSubtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=12,
            leading=16,
            alignment=TA_CENTER,
            textColor=MUTED,
            spaceAfter=18,
        ),
        "h1": ParagraphStyle(
            "ManualH1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=BLUE,
            spaceBefore=12,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "ManualH2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            textColor=DARK_BLUE,
            spaceBefore=8,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "ManualBody",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=14,
            textColor=TEXT,
            spaceAfter=6,
            alignment=TA_LEFT,
        ),
        "small": ParagraphStyle(
            "ManualSmall",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=MUTED,
            spaceAfter=4,
        ),
        "table": ParagraphStyle(
            "ManualTable",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.8,
            leading=11.5,
            textColor=TEXT,
        ),
        "table_bold": ParagraphStyle(
            "ManualTableBold",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8.8,
            leading=11.5,
            textColor=TEXT,
        ),
    }


S = styles()


def p(text, style="body"):
    return Paragraph(text, S[style])


def bullets(items):
    return ListFlowable(
        [ListItem(p(item), leftIndent=12) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=18,
        bulletFontName="Helvetica",
        bulletFontSize=8,
        spaceAfter=8,
    )


def numbers(items):
    return ListFlowable(
        [ListItem(p(item), leftIndent=12) for item in items],
        bulletType="1",
        leftIndent=18,
        bulletFontName="Helvetica",
        bulletFontSize=9,
        spaceAfter=8,
    )


def table(headers, rows, widths):
    data = [[p(h, "table_bold") for h in headers]]
    for row in rows:
        data.append([p(str(cell), "table") for cell in row])

    t = Table(data, colWidths=[w * inch for w in widths], hAlign="CENTER", repeatRows=1)
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), LIGHT_GRAY),
                ("TEXTCOLOR", (0, 0), (-1, 0), TEXT),
                ("GRID", (0, 0), (-1, -1), 0.45, BORDER),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return [t, Spacer(1, 9)]


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(inch, 0.55 * inch, "Manual de Usuario - Sistema Centro Cultural Lucy Tejada")
    canvas.drawRightString(7.5 * inch, 0.55 * inch, f"Página {doc.page}")
    canvas.restoreState()


def build_story():
    story = []
    story.append(p("Manual de Usuario<br/>Sistema Centro Cultural Lucy Tejada", "title"))
    story.append(p("Guía para estudiantes, educadores y administradores", "subtitle"))
    story.append(p("<b>Proyecto de Ingeniería de Software III</b>", "subtitle"))
    story.extend(
        table(
            ["Dato", "Descripción"],
            [
                ("Aplicación", "Plataforma web para gestión de formación cultural."),
                ("Frontend", "React + TypeScript + Vite."),
                ("Backend", "NestJS + PostgreSQL + JWT."),
                ("Fecha del manual", date.today().strftime("%Y-%m-%d")),
            ],
            [1.7, 4.7],
        )
    )
    story.append(PageBreak())

    story.append(p("1. Propósito del sistema", "h1"))
    story.append(
        p(
            "El Sistema Centro Cultural Lucy Tejada permite consultar y administrar información relacionada con programas de formación artística, grupos, matrículas, asistencias, evaluaciones, escenarios, reservas, usuarios y notificaciones."
        )
    )
    story.append(
        p(
            "La aplicación está organizada por roles. Cada usuario ingresa con sus credenciales y el sistema lo redirige al panel que corresponde a su perfil: Estudiante, Educador o Administrador."
        )
    )
    story.extend(
        table(
            ["Rol", "Acceso principal", "Qué puede consultar"],
            [
                ("Estudiante", "/estudiante", "Cursos activos, asistencias, notas y notificaciones personales."),
                ("Educador", "/profesor", "Grupos asignados, estudiantes activos, asistencias, evaluaciones y alertas."),
                ("Administrador", "/admin", "Usuarios, programas, grupos, matrículas, escenarios, reservas y notificaciones."),
            ],
            [1.25, 1.45, 3.7],
        )
    )

    story.append(p("2. Requisitos para usar el sistema", "h1"))
    story.append(
        bullets(
            [
                "Navegador web moderno.",
                "Backend ejecutándose en http://localhost:3000.",
                "Frontend ejecutándose en http://localhost:5173.",
                "Conexión a una base de datos PostgreSQL definida en backend/.env mediante DATABASE_URL.",
                "JWT_SECRET definido en backend/.env para firmar las sesiones.",
            ]
        )
    )

    story.append(p("3. Inicio rápido del proyecto", "h1"))
    story.append(p("Estos pasos son para levantar la aplicación en ambiente local."))
    story.append(
        numbers(
            [
                "Abrir una terminal en la carpeta backend y ejecutar npm install.",
                "Crear el archivo backend/.env con DATABASE_URL y JWT_SECRET.",
                "Ejecutar npm run seed para cargar usuarios y datos de prueba.",
                "Ejecutar npm run dev en backend para iniciar la API en el puerto 3000.",
                "Abrir otra terminal en la carpeta frontend y ejecutar npm install.",
                "Ejecutar npm run dev en frontend y abrir http://localhost:5173.",
            ]
        )
    )
    story.extend(
        table(
            ["Servicio", "Comando", "Resultado esperado"],
            [
                ("Backend", "npm run dev", "API disponible en http://localhost:3000 y Swagger en /api."),
                ("Seed", "npm run seed", "Carga usuarios, programas, grupos, matrículas, asistencias y reservas de prueba."),
                ("Frontend", "npm run dev", "Interfaz disponible en http://localhost:5173."),
            ],
            [1.25, 1.45, 3.7],
        )
    )

    story.append(p("4. Credenciales de prueba", "h1"))
    story.append(p("Después de ejecutar el seed, se pueden usar las siguientes cuentas:"))
    story.extend(
        table(
            ["Perfil", "Correo", "Contraseña"],
            [
                ("Administrador", "admin@lucytejada.edu.co", "Prueba123"),
                ("Educador", "profesor@lucytejada.edu.co", "Prueba123"),
                ("Estudiante", "estudiante@lucytejada.edu.co", "Prueba123"),
            ],
            [1.4, 3.35, 1.65],
        )
    )

    story.append(p("5. Pantalla de inicio", "h1"))
    story.append(
        p(
            "La pantalla inicial presenta el Centro Cultural Lucy Tejada, los programas de formación y los accesos a Ingresar y Registrarse."
        )
    )
    story.append(
        bullets(
            [
                "Inicio: muestra el mensaje principal del sistema.",
                "Programas: permite revisar las áreas de Música, Danza y Teatro, y Artes Plásticas.",
                "Ingresar: abre el formulario de inicio de sesión.",
                "Registrarse: abre el formulario para crear una cuenta nueva.",
                "Si el usuario ya inició sesión, aparece la opción Ir a mi panel.",
            ]
        )
    )

    story.append(p("6. Registro de usuarios", "h1"))
    story.append(p("Para crear una cuenta nueva, entrar a Registrarse y completar el formulario."))
    story.append(
        numbers(
            [
                "Escribir el nombre completo.",
                "Ingresar un correo electrónico válido.",
                "Seleccionar el rol: Estudiante, Educador / Profesor o Administrativo / Admin.",
                "Completar el campo adicional si aplica: código estudiantil para estudiante o especialidad artística para educador.",
                "Definir y confirmar una contraseña de mínimo 6 caracteres.",
                "Presionar Crear Cuenta. Si el registro es exitoso, el sistema redirige al login.",
            ]
        )
    )

    story.append(p("7. Inicio de sesión", "h1"))
    story.append(p("Para entrar al sistema, abrir Ingresar y completar correo y contraseña."))
    story.append(
        bullets(
            [
                "Si las credenciales son correctas, el sistema guarda la sesión y redirige automáticamente según el rol.",
                "Si el correo o la contraseña son incorrectos, se muestra un mensaje de error.",
                "Si el usuario está inactivo, el sistema no permite el acceso.",
                "La sesión usa token JWT y las rutas privadas verifican el rol antes de mostrar cada panel.",
            ]
        )
    )

    panels = [
        (
            "8. Panel del Estudiante",
            "El panel del estudiante está pensado para consulta personal. Muestra un resumen de cursos inscritos, promedio de asistencia, nota promedio y notificaciones.",
            [
                ("Mis Matrículas", "Consultar cursos activos, programa, horario, docente asignado y estado de matrícula."),
                ("Mis Asistencias", "Revisar registros recientes de asistencia por grupo y fecha."),
                ("Mis Notas", "Consultar evaluaciones, descripción y calificación registrada."),
                ("Notificaciones", "Leer mensajes personales enviados por el sistema o administración."),
            ],
        ),
        (
            "9. Panel del Educador",
            "El panel del educador resume los grupos asignados y la información académica relacionada con sus estudiantes.",
            [
                ("Mis Grupos", "Ver nombre del grupo, programa, horario, cupo máximo y estudiantes inscritos."),
                ("Asistencias", "Consultar las últimas asistencias registradas por estudiante, grupo y fecha."),
                ("Evaluaciones", "Revisar evaluaciones asociadas a los estudiantes de sus grupos."),
                ("Alertas", "Leer notificaciones personales del educador."),
            ],
        ),
        (
            "10. Panel de Administración",
            "El panel administrativo ofrece una vista general del sistema y concentra la información de gestión institucional.",
            [
                ("Usuarios", "Consultar usuarios registrados y su rol."),
                ("Programas y Grupos", "Ver programas, grupos, horarios, cupos e instructor asignado."),
                ("Matrículas", "Consultar el volumen de matrículas activas desde los indicadores del panel."),
                ("Escenarios", "Revisar espacios, capacidad, reservas y estado: disponible, reservado o en mantenimiento."),
                ("Notificaciones", "Ver mensajes recientes asociados a usuarios o al sistema."),
            ],
        ),
    ]
    for heading, intro, rows in panels:
        story.append(p(heading, "h1"))
        story.append(p(intro))
        story.extend(table(["Sección", "Uso"], rows, [1.8, 4.6]))
    story.append(
        p(
            "Los accesos CRUD del backend para administración están protegidos por JWT y roles, por lo que requieren iniciar sesión con una cuenta autorizada."
        )
    )

    story.append(p("11. API y documentación técnica visible para usuarios avanzados", "h1"))
    story.append(
        p(
            "El backend expone documentación Swagger en http://localhost:3000/api. Desde allí se pueden revisar rutas, probar endpoints y enviar el token Bearer obtenido en el login."
        )
    )
    story.extend(
        table(
            ["Módulo", "Rutas principales"],
            [
                ("Autenticación", "POST /auth/register, POST /auth/login"),
                ("Dashboard", "GET /dashboard/admin, /dashboard/profesor, /dashboard/estudiante"),
                ("Gestión", "usuarios, programas, grupos, estudiantes, educadores, matrículas"),
                ("Académico", "asistencias, evaluaciones, notificaciones"),
                ("Escenarios", "escenarios y reservas"),
            ],
            [1.45, 4.95],
        )
    )

    story.append(p("12. Solución de problemas frecuentes", "h1"))
    story.extend(
        table(
            ["Situación", "Qué revisar"],
            [
                ("No carga el panel", "Confirmar que el backend esté activo en el puerto 3000 y que el token de sesión sea válido."),
                ("Error de conexión", "Revisar VITE_API_URL en frontend o usar el valor por defecto http://localhost:3000."),
                ("Login fallido", "Verificar correo, contraseña, usuario activo y que JWT_SECRET exista en backend/.env."),
                ("No aparecen datos", "Ejecutar npm run seed y confirmar que DATABASE_URL apunte a la base correcta."),
                ("CORS", "El backend permite origen http://localhost:5173. Usar ese puerto o ajustar la configuración."),
            ],
            [1.7, 4.7],
        )
    )

    story.append(p("13. Buenas prácticas de uso", "h1"))
    story.append(
        bullets(
            [
                "Cerrar sesión al terminar, especialmente en equipos compartidos.",
                "Usar correos reales o institucionales para identificar correctamente a cada usuario.",
                "Mantener actualizados los estados de matrícula, asistencia y evaluación desde los módulos administrativos o servicios correspondientes.",
                "Revisar Swagger solo si se tiene autorización para probar la API.",
                "No compartir contraseñas ni tokens de acceso.",
            ]
        )
    )
    return story


def main():
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        leftMargin=inch,
        rightMargin=inch,
        topMargin=inch,
        bottomMargin=0.8 * inch,
        title="Manual de Usuario - Sistema Centro Cultural Lucy Tejada",
        author="Proyecto Ingeniería de Software III",
    )
    doc.build(build_story(), onFirstPage=footer, onLaterPages=footer)
    print(OUT)


if __name__ == "__main__":
    main()
