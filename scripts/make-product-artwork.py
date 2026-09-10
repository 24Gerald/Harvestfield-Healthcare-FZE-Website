"""
Rebuilds the Synera DuoForte pack artwork (front + back) as flat textures for the
3D pack in The Net section, traced from the product photographs supplied by the
client. Stand-in only: drop the real print files in as public/product/front.png
and back.png (same 1200x1500 proportion) and this script becomes irrelevant.

Run: python3 scripts/make-product-artwork.py
"""
import math
import os
import random

from PIL import Image, ImageDraw, ImageFilter

W, H = 1200, 1500
GREEN = (13, 105, 74)          # pack green
GREEN_DEEP = (9, 82, 58)
FILM = (250, 250, 247)         # unprinted poly film
WHITE = (255, 255, 255)
LIB = '/usr/share/fonts/truetype/liberation/'

_font_cache = {}


def font(size, bold=False):
    key = (size, bold)
    if key not in _font_cache:
        from PIL import ImageFont
        name = 'LiberationSans-Bold.ttf' if bold else 'LiberationSans-Regular.ttf'
        _font_cache[key] = ImageFont.truetype(LIB + name, size)
    return _font_cache[key]


def text_w(d, s, f):
    return d.textlength(s, font=f)


def centre(d, cx, y, s, f, fill):
    d.text((cx - text_w(d, s, f) / 2, y), s, font=f, fill=fill)


def film_base():
    """Bright poly film with a faint, soft crinkle so it is not dead flat."""
    im = Image.new('RGB', (W, H), FILM)
    shade = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(shade)
    rnd = random.Random(11)
    for _ in range(44):
        x, y = rnd.randint(0, W), rnd.randint(0, H)
        r = rnd.randint(120, 340)
        d.ellipse((x - r, y - r, x + r, y + r), fill=rnd.randint(4, 11))
    shade = shade.filter(ImageFilter.GaussianBlur(90))
    return Image.composite(Image.new('RGB', (W, H), (236, 237, 233)), im, shade)


# ---------------------------------------------------------------- front


AFRICA = [
    (0.30, 0.05), (0.52, 0.01), (0.72, 0.04), (0.86, 0.11), (0.94, 0.20),
    (0.90, 0.29), (0.79, 0.33), (0.77, 0.40), (0.87, 0.44), (0.91, 0.52),
    (0.84, 0.60), (0.73, 0.67), (0.65, 0.75), (0.59, 0.85), (0.51, 0.94),
    (0.43, 0.99), (0.37, 0.93), (0.35, 0.84), (0.29, 0.76), (0.23, 0.68),
    (0.19, 0.60), (0.13, 0.52), (0.09, 0.43), (0.05, 0.35), (0.07, 0.25),
    (0.15, 0.15), (0.22, 0.09),
]


def africa_mesh(box_w, box_h, step=15, line=(168, 184, 174)):
    """Africa silhouette filled with a fine net grid — the mark on the pack."""
    ss = 3  # supersample for clean edges
    w, h = box_w * ss, box_h * ss
    poly = [(x * w, y * h) for x, y in AFRICA]

    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).polygon(poly, fill=255)

    grid = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    g = ImageDraw.Draw(grid)
    s = step * ss
    for x in range(0, w, s):
        g.line((x, 0, x, h), fill=line + (255,), width=max(1, ss - 1))
    for y in range(0, h, s):
        g.line((0, y, w, y), fill=line + (255,), width=max(1, ss - 1))
    grid.putalpha(Image.composite(grid.getchannel('A'), Image.new('L', (w, h), 0), mask))
    g.polygon(poly, outline=line + (255,), width=ss)
    return grid.resize((box_w, box_h), Image.LANCZOS)


def gdm_mark(height):
    """Client GDM wordmark, recoloured to the pack green."""
    src = Image.open('src/assets/gdm-logo-white.png').convert('RGBA')
    w = int(src.width * height / src.height)
    src = src.resize((w, height), Image.LANCZOS)
    solid = Image.new('RGBA', src.size, GREEN + (255,))
    solid.putalpha(src.getchannel('A'))
    return solid


def front():
    im = film_base()
    d = ImageDraw.Draw(im)

    # --- brand block: the mesh-filled Africa mark with SYNERA across it
    mesh = africa_mesh(300, 400)
    im.paste(mesh, (285, 205), mesh)

    f_syn = font(94, True)
    syn_w = text_w(d, 'SYNERA', f_syn)
    syn_x = 430 - syn_w / 2
    d.text((syn_x, 395), 'SYNERA', font=f_syn, fill=GREEN_DEEP)
    f_duo = font(27, True)
    d.text((syn_x + syn_w - text_w(d, 'DuoForte', f_duo), 486), 'DuoForte', font=f_duo, fill=GREEN_DEEP)
    centre(d, 430, 585, 'Synera DuoForte®', font(32, True), GREEN_DEEP)

    logo = gdm_mark(124)
    im.paste(logo, (735, 372), logo)

    # --- LLIN pill
    pill = (215, 780, 985, 950)
    d.rounded_rectangle(pill, radius=(pill[3] - pill[1]) // 2, fill=GREEN)
    cx = (pill[0] + pill[2]) // 2
    centre(d, cx, 808, 'Long Lasting Insecticidal Net (LLIN)', font(29), WHITE)
    centre(d, cx, 851, 'Moustiquaire insecticide longue durée (LLIN)', font(29), WHITE)
    centre(d, cx, 894, 'Mosquiteiro inseticida de longa duração (MILD)', font(29), WHITE)

    # --- claim lines
    centre(d, W // 2, 1035, 'Dual Active Protection', font(39, True), GREEN)
    centre(d, W // 2, 1087, 'Double Protection Active', font(39, True), GREEN)
    centre(d, W // 2, 1139, 'Dupla proteção ativa', font(39, True), GREEN)

    # --- Made in Nigeria oval
    d.ellipse((828, 1318, 1096, 1390), fill=GREEN)
    centre(d, 962, 1339, 'Made in Nigeria', font(27, True), WHITE)
    return im


# ---------------------------------------------------------------- back


def use_panel(size, which):
    """One of the five line-art 'directions for use' vignettes."""
    w, h = size
    ss = 2
    im = Image.new('RGBA', (w * ss, h * ss), (255, 255, 255, 236))
    d = ImageDraw.Draw(im)
    ink = (70, 78, 74, 255)
    lw = 2 * ss

    def box(x0, y0, x1, y1):
        d.rectangle((x0 * ss, y0 * ss, x1 * ss, y1 * ss), outline=ink, width=lw)

    def line(x0, y0, x1, y1, width=lw):
        d.line((x0 * ss, y0 * ss, x1 * ss, y1 * ss), fill=ink, width=width)

    def net(x0, y0, x1, y1, step=9):
        """Draped net: box outline plus a light mesh."""
        box(x0, y0, x1, y1)
        for x in range(x0 + step, x1, step):
            line(x, y0, x, y1, width=ss)
        for y in range(y0 + step, y1, step):
            line(x0, y, x1, y, width=ss)

    if which == 0:      # hang the net over the sleeping area
        line(20, 18, 120, 18)                     # ceiling line
        line(70, 18, 70, 30)
        net(28, 30, 112, 96)
        line(24, 100, 116, 100)                   # bed
        d.arc((84 * ss, 40 * ss, 108 * ss, 88 * ss), 250, 340, fill=ink, width=lw)
    elif which == 1:    # tuck the edges under the mattress
        net(24, 26, 116, 78)
        d.rounded_rectangle((22 * ss, 78 * ss, 118 * ss, 100 * ss), radius=5 * ss, outline=ink, width=lw)
        for x in (40, 60, 80, 100):               # tucked folds
            line(x, 78, x - 6, 92, width=ss)
        d.ellipse((30 * ss, 58 * ss, 46 * ss, 74 * ss), outline=ink, width=lw)  # person
    elif which == 2:    # repair holes
        net(26, 24, 114, 88)
        d.ellipse((62 * ss, 46 * ss, 82 * ss, 64 * ss), fill=(255, 255, 255, 255), outline=ink, width=lw)
        line(66, 50, 78, 60, width=ss)
        line(78, 50, 66, 60, width=ss)
        line(30, 92, 110, 92)
    elif which == 3:    # wash gently, dry in shade
        d.arc((30 * ss, 60 * ss, 78 * ss, 104 * ss), 0, 180, fill=ink, width=lw)   # bucket
        line(30, 82, 78, 82)
        d.arc((86 * ss, 26 * ss, 126 * ss, 66 * ss), 150, 390, fill=ink, width=lw)  # tree
        line(106, 60, 106, 100)
        line(24, 34, 92, 34)                       # washing line
        for x in range(30, 88, 12):
            line(x, 34, x, 52, width=ss)
    else:               # sleep under it every night
        net(22, 22, 118, 84)
        line(70, 14, 70, 22)
        d.rounded_rectangle((30 * ss, 84 * ss, 110 * ss, 100 * ss), radius=4 * ss, outline=ink, width=lw)
        d.ellipse((40 * ss, 74 * ss, 54 * ss, 88 * ss), outline=ink, width=lw)
        line(54, 86, 96, 86, width=ss)

    return im.resize((w, h), Image.LANCZOS)


def care_icon(d, x, y, kind, s=34, ink=WHITE):
    """Care symbols: wash 30, no bleach, no iron, no dry clean, no tumble."""
    lw = 2

    def cross():
        d.line((x, y, x + s, y + s), fill=ink, width=lw)
        d.line((x + s, y, x, y + s), fill=ink, width=lw)

    if kind == 'wash':
        d.line((x, y + s * 0.32, x + s * 0.16, y + s * 0.16), fill=ink, width=lw)
        d.line((x + s * 0.84, y + s * 0.16, x + s, y + s * 0.32), fill=ink, width=lw)
        d.line((x, y + s * 0.32, x + s, y + s * 0.32), fill=ink, width=lw)
        d.arc((x, y + s * 0.12, x + s, y + s), 0, 180, fill=ink, width=lw)
        d.text((x + s * 0.24, y + s * 0.42), '30', font=font(15, True), fill=ink)
    elif kind == 'bleach':
        d.polygon([(x + s / 2, y), (x + s, y + s), (x, y + s)], outline=ink)
        cross()
    elif kind == 'iron':
        d.polygon([(x + s * 0.1, y + s * 0.75), (x + s * 0.9, y + s * 0.75),
                   (x + s * 0.7, y + s * 0.3), (x + s * 0.3, y + s * 0.3)], outline=ink)
        cross()
    elif kind == 'dryclean':
        d.ellipse((x, y, x + s, y + s), outline=ink, width=lw)
        cross()
    else:  # tumble
        d.rectangle((x, y, x + s, y + s), outline=ink, width=lw)
        d.ellipse((x + s * 0.16, y + s * 0.16, x + s * 0.84, y + s * 0.84), outline=ink, width=lw)
        cross()


SPECS = [
    ('Product:', ['Synera DuoForte ®']),
    ('Description:', ['Long lasting Insecticidal Net (LLIN)']),
    ('Material:', ['100% Polyester']),
    ('Mesh Size:', ['23 cm2']),
    ('Fabric Weight:', ['40 g/m2']),
    ('Denier:', ['100D']),
    ('Active Ingredients:', ['Chlorfenapyr 5.6 g/kg (+20%)',
                            'Alpha-cypermethrin 3.75 g/kg (+15%/-25%)']),
    ('Shape:', ['Rectangular']),
    ('Shelf Life:', ['2 years from the date of manufacture']),
    ('Lifespan:', ['20 washes and /or 3 years (whichever comes',
                   'first from first Opening)']),
    ('Storage:', ['Store in a cool, dry place away from direct sunlight.']),
]

USE_CAPTIONS = [
    'Hang the net over the sleeping area using the loops.',
    'Tuck the edges securely under the mattress or mat.',
    'Repair any holes immediately to maintain protection.',
    'Wash gently with soap. No bleach. Dry in the shade.',
    'Use the net every night for the best protection.',
]


def wrap(d, text, f, max_w):
    """Greedy wrap to a pixel width — captions must stay inside their card."""
    lines, line = [], ''
    for word in text.split():
        trial = f'{line} {word}'.strip()
        if line and text_w(d, trial, f) > max_w:
            lines.append(line)
            line = word
        else:
            line = trial
    if line:
        lines.append(line)
    return lines


def back():
    im = film_base()
    d = ImageDraw.Draw(im)

    # dark green printed panel, inset in the film like the real pack
    P = (70, 90, W - 70, H - 120)
    d.rounded_rectangle(P, radius=18, fill=GREEN)
    px0, py0, px1, py1 = P
    inner_cx = (px0 + px1) // 2

    centre(d, inner_cx, py0 + 26, 'Directions for Safe and Effective Use', font(31, True), WHITE)

    # five vignettes: three across, then two centred
    pw, ph = 148, 118
    row1_y, row2_y = py0 + 76, py0 + 250
    xs1 = [px0 + 118, inner_cx - pw // 2, px1 - 118 - pw]
    xs2 = [inner_cx - pw - 40, inner_cx + 40]
    slots = [(xs1[0], row1_y), (xs1[1], row1_y), (xs1[2], row1_y), (xs2[0], row2_y), (xs2[1], row2_y)]
    for i, (x, y) in enumerate(slots):
        card = use_panel((pw, ph), i)
        im.paste(card, (x, y), card)
        d.ellipse((x - 12, y - 12, x + 18, y + 18), fill=WHITE, outline=GREEN_DEEP, width=2)
        centre(d, x + 3, y - 8, str(i + 1), font(21, True), GREEN_DEEP)
        cap_f = font(13)
        for j, ln in enumerate(wrap(d, USE_CAPTIONS[i], cap_f, pw + 16)):
            centre(d, x + pw // 2, y + ph + 8 + j * 17, ln, cap_f, (216, 234, 225))

    rule_y = row2_y + ph + 84
    d.line((px0 + 40, rule_y, px1 - 40, rule_y), fill=(255, 255, 255, 90), width=1)

    # spec list
    y = rule_y + 22
    for label, values in SPECS:
        d.text((px0 + 40, y), label, font=font(19, True), fill=WHITE)
        y += 24
        for v in values:
            d.text((px0 + 40, y), v, font=font(18), fill=(226, 240, 233))
            y += 22
        y += 8

    # white variable-data box
    B = (px0 + 640, rule_y + 190, px1 - 40, rule_y + 430)
    d.rectangle(B, fill=WHITE)
    by = B[1] + 18
    rows = [('Dimensions: ', '190(L)x180(W)x150(H)cm'), ('Color: ', 'White'),
            ('NAFDAC Reg.: ', ''), ('Batch No: ', 'LLOLWT2209004'),
            ('Manufacturing Date: ', 'June 2026'), ('Expiry Date : ', '')]
    for label, value in rows:
        d.text((B[0] + 18, by), label, font=font(17, True), fill=(20, 20, 20))
        d.text((B[0] + 18 + text_w(d, label, font(17, True)), by), value, font=font(17), fill=(30, 30, 30))
        by += 36

    # care instructions
    cy = py1 - 132
    d.text((px0 + 40, cy - 24), 'Care Instructions', font=font(15, True), fill=WHITE)
    icons = [('wash', 'Gentle Wash'), ('bleach', 'No Bleaching'), ('iron', 'No Ironing'),
             ('dryclean', 'No Dry Cleaning'), ('tumble', 'No Tumbling')]
    for i, (kind, caption) in enumerate(icons):
        x = px0 + 44 + i * 96
        care_icon(d, x, cy, kind)
        d.text((x - 6, cy + 42), caption, font=font(11), fill=(214, 232, 222))

    # manufacturer / licence — laid out upwards from the panel edge so the last
    # line always clears it
    mx = px0 + 640
    my = py1 - 182
    d.text((mx, my), 'Manufactured in Nigeria by:', font=font(17, True), fill=WHITE)
    for i, ln in enumerate(['Harvestfield HealthCare FZE', 'Harvestfield Free Trade Zone, OPIC',
                            'Industrials Layout, Makun City', 'Lagos - Ibadan Expressway, Ogun state']):
        d.text((mx, my + 24 + i * 19), ln, font=font(15), fill=(226, 240, 233))
    d.text((mx, my + 112), 'Licenced under:', font=font(17, True), fill=WHITE)
    for i, ln in enumerate(['Guandong Medicine & Health Products', '(GDM Health Products)']):
        d.text((mx, my + 136 + i * 19), ln, font=font(15), fill=(226, 240, 233))
    return im


def net_bundle():
    """The folded net seen faintly through the film."""
    im = Image.new('RGB', (W, H), (243, 244, 241))
    d = ImageDraw.Draw(im)
    rnd = random.Random(5)
    for _ in range(26):
        y = rnd.randint(0, H)
        d.line((0, y, W, y + rnd.randint(-40, 40)), fill=(228, 230, 226), width=rnd.randint(6, 26))
    for x in range(0, W, 7):
        d.line((x, 0, x, H), fill=(233, 235, 231), width=1)
    for y in range(0, H, 7):
        d.line((0, y, W, y), fill=(233, 235, 231), width=1)
    return im.filter(ImageFilter.GaussianBlur(1.2))


def wrinkles():
    """Greyscale bump for the film surface."""
    im = Image.new('L', (768, 768), 128)
    d = ImageDraw.Draw(im)
    rnd = random.Random(3)
    for _ in range(150):
        x0, y0 = rnd.randint(0, 768), rnd.randint(0, 768)
        pts = [(x0, y0)]
        for _ in range(5):
            x0 += rnd.randint(-140, 140)
            y0 += rnd.randint(-140, 140)
            pts.append((x0, y0))
        d.line(pts, fill=rnd.randint(112, 150), width=rnd.randint(2, 7), joint='curve')
    return im.filter(ImageFilter.GaussianBlur(2.4))


if __name__ == '__main__':
    os.makedirs('public/product', exist_ok=True)
    front().save('public/product/front.png', optimize=True)
    back().save('public/product/back.png', optimize=True)
    net_bundle().save('public/product/net-bundle.png', optimize=True)
    wrinkles().save('public/product/wrinkles.png', optimize=True)
    for f in ('front', 'back', 'net-bundle', 'wrinkles'):
        p = f'public/product/{f}.png'
        print(p, Image.open(p).size, f'{os.path.getsize(p) // 1024}KB')
