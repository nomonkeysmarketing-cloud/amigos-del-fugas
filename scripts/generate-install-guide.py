"""
Generate iOS install guide PDF for Amigos del Fugas.
Output: amigos-del-fugas-instalacion-ios.pdf
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# Brand colors
BG = HexColor("#08110d")
SURFACE = HexColor("#16201a")
PRIMARY = HexColor("#00d86b")
GOLD = HexColor("#ffc93c")
TEXT = HexColor("#f0f5f2")
MUTED = HexColor("#7a8c82")
BORDER = HexColor("#2a3830")


def draw_full_bg(c, w, h):
    c.setFillColor(BG)
    c.rect(0, 0, w, h, fill=1, stroke=0)


def draw_page_header(c, w, h, eyebrow, title_line1, title_line2_color_word, title_line2_rest=""):
    # Eyebrow
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(PRIMARY)
    c.drawString(0.6 * inch, h - 0.7 * inch, eyebrow)

    # Title big
    c.setFont("Helvetica-Bold", 38)
    c.setFillColor(TEXT)
    c.drawString(0.6 * inch, h - 1.25 * inch, title_line1)

    # Title line 2
    c.setFont("Helvetica-Bold", 38)
    c.setFillColor(PRIMARY)
    c.drawString(0.6 * inch, h - 1.65 * inch, title_line2_color_word)
    if title_line2_rest:
        # measure width of colored word
        word_w = c.stringWidth(title_line2_color_word, "Helvetica-Bold", 38)
        c.setFillColor(TEXT)
        c.drawString(0.6 * inch + word_w + 6, h - 1.65 * inch, title_line2_rest)


def draw_step(c, w, h, y, number, title, body_lines):
    """Draw a numbered step card."""
    card_h = 1.05 * inch + (len(body_lines) - 1) * 14
    card_x = 0.6 * inch
    card_w = w - 1.2 * inch

    # Card background
    c.setFillColor(SURFACE)
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.6)
    c.roundRect(card_x, y - card_h, card_w, card_h, 12, fill=1, stroke=1)

    # Number circle
    circle_x = card_x + 0.45 * inch
    circle_y = y - 0.5 * inch
    c.setFillColor(PRIMARY)
    c.circle(circle_x, circle_y, 0.27 * inch, fill=1, stroke=0)
    c.setFillColor(HexColor("#0a1f14"))
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(circle_x, circle_y - 7, str(number))

    # Title
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(card_x + 1.0 * inch, y - 0.42 * inch, title)

    # Body lines
    c.setFont("Helvetica", 11)
    c.setFillColor(MUTED)
    for i, line in enumerate(body_lines):
        c.drawString(card_x + 1.0 * inch, y - 0.65 * inch - i * 14, line)

    return y - card_h - 0.25 * inch


def draw_pin_box(c, w, h, y):
    """A highlighted PIN box at the bottom of page 1."""
    box_x = 0.6 * inch
    box_w = w - 1.2 * inch
    box_h = 0.8 * inch

    c.setFillColor(SURFACE)
    c.setStrokeColor(PRIMARY)
    c.setLineWidth(1.2)
    c.roundRect(box_x, y - box_h, box_w, box_h, 12, fill=1, stroke=1)

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(box_x + 0.4 * inch, y - 0.3 * inch, "TU PIN INICIAL")

    c.setFillColor(GOLD)
    c.setFont("Courier-Bold", 28)
    c.drawString(box_x + 0.4 * inch, y - 0.65 * inch, "4814")

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 9)
    c.drawString(box_x + 2.5 * inch, y - 0.55 * inch, "La Ciruela")


def draw_footer(c, w, h, label):
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawString(0.6 * inch, 0.4 * inch, label)
    c.drawRightString(w - 0.6 * inch, 0.4 * inch, "amigosdelfugas.vercel.app")


def page1_main_steps(c, w, h):
    draw_full_bg(c, w, h)

    # Brand mark top right
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 9)
    c.drawRightString(w - 0.6 * inch, h - 0.7 * inch, "AMIGOS DEL FUGAS")

    draw_page_header(
        c, w, h,
        "INSTALACION EN iPHONE",
        "Instala la app",
        "en 4",
        "pasos."
    )

    # Intro
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 11)
    c.drawString(
        0.6 * inch, h - 2.0 * inch,
        "Hazlo desde tu iPhone. Tienes que usar Safari, no Chrome."
    )

    y = h - 2.4 * inch

    y = draw_step(
        c, w, h, y, 1,
        "Abre Safari (no Chrome)",
        [
            "Busca esta direccion en la barra de arriba:",
            "amigosdelfugas.vercel.app",
        ],
    )

    y = draw_step(
        c, w, h, y, 2,
        "Toca el boton Compartir",
        [
            "Es el cuadrado con la flecha hacia arriba.",
            "Esta abajo en el centro de la pantalla.",
        ],
    )

    y = draw_step(
        c, w, h, y, 3,
        "Busca 'Agregar a pantalla de inicio'",
        [
            "Baja en el menu que aparecio.",
            "Es la opcion con un cuadrito y un mas (+).",
        ],
    )

    y = draw_step(
        c, w, h, y, 4,
        "Toca 'Agregar' arriba a la derecha",
        [
            "Listo. El icono verde con la F aparece en tu pantalla",
            "de inicio. Abrelo y entras como app de verdad.",
        ],
    )

    draw_footer(c, w, h, "1 / 2  ·  Instalacion en iOS")


def page2_login_help(c, w, h):
    draw_full_bg(c, w, h)

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 9)
    c.drawRightString(w - 0.6 * inch, h - 0.7 * inch, "AMIGOS DEL FUGAS")

    draw_page_header(
        c, w, h,
        "PRIMERA VEZ",
        "Crea tu PIN",
        "personal."
    )

    # Intro
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 11)
    c.drawString(
        0.6 * inch, h - 2.0 * inch,
        "Cuando entres por primera vez, la app te va a pedir un PIN nuevo."
    )

    y = h - 2.4 * inch

    y = draw_step(
        c, w, h, y, 1,
        "Entra con tu apodo + el PIN que te mande",
        [
            "Selecciona tu nombre de la lista.",
            "Mete los 4 digitos del PIN que te paso el admin.",
        ],
    )

    y = draw_step(
        c, w, h, y, 2,
        "Crea tu PIN personal (4 digitos)",
        [
            "Que solo tu sepas. Lo vas a usar cada vez que entres.",
            "No uses 0000, 1234 ni 1111.",
        ],
    )

    y = draw_step(
        c, w, h, y, 3,
        "Confirma el PIN nuevo",
        [
            "Escribelo otra vez para confirmar que no te equivocaste.",
            "Si los dos coinciden, ya estas dentro.",
        ],
    )

    y = draw_step(
        c, w, h, y, 4,
        "A jugar",
        [
            "Vas a la seccion Mis Pronosticos.",
            "Acuerdate: predicciones cierran 1 min antes del kickoff.",
        ],
    )

    # PIN highlight box (only for La Ciruela's copy)
    draw_pin_box(c, w, h, y - 0.1 * inch)

    draw_footer(c, w, h, "2 / 2  ·  Crear PIN personal")


def main():
    output = "amigos-del-fugas-instalacion-ios.pdf"
    c = canvas.Canvas(output, pagesize=letter)
    w, h = letter

    # Metadata
    c.setTitle("Instalacion en iPhone - Amigos del Fugas")
    c.setAuthor("Amigos del Fugas")
    c.setSubject("Guia rapida para instalar la PWA en iOS y crear tu PIN")

    page1_main_steps(c, w, h)
    c.showPage()

    page2_login_help(c, w, h)
    c.showPage()

    c.save()

    full_path = os.path.abspath(output)
    print(f"PDF generated: {full_path}")
    print(f"Size: {os.path.getsize(output)} bytes")


if __name__ == "__main__":
    main()
