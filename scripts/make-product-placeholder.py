"""
Reconstructs the Synera DuoForte pack artwork (front + back) as flat textures for
the 3D package in The Net section, from the pack photos supplied by the client.
Stand-in only: replace public/product/front.png and back.png with the real print
artwork (flattened to PNG/JPG, ~1000x1250) and this script becomes irrelevant.
Run: python3 scripts/make-product-placeholder.py
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

W, H = 1000, 1250
GREEN = (22, 122, 84)
DARK_GREEN = (18, 92, 66)
OFFWHITE = (246, 246, 243)
F = '/usr/share/fonts/truetype/dejavu/'
def font(size, bold=False):
    return ImageFont.truetype(F + ('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf'), size)

def base():
    im = Image.new('RGB', (W, H), OFFWHITE)
    # faint crinkle shading so the texture doesn't read as flat paper
    shade = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(shade)
    import random
    random.seed(7)
    for _ in range(60):
        x, y = random.randint(0, W), random.randint(0, H)
        r = random.randint(80, 260)
        d.ellipse((x - r, y - r, x + r, y + r), fill=random.randint(6, 18))
    shade = shade.filter(ImageFilter.GaussianBlur(70))
    im = Image.composite(Image.new('RGB', (W, H), (225, 226, 222)), im, shade)
    return im

def centered(d, y, text, f, fill):
    w = d.textlength(text, font=f)
    d.text(((W - w) / 2, y), text, font=f, fill=fill)

def gdm_logo(green=True):
    src = Image.open('src/assets/gdm-logo-white.png').convert('RGBA')
    if not green:
        return src
    a = src.getchannel('A')
    grad = Image.new('RGBA', src.size)
    gd = ImageDraw.Draw(grad)
    for y in range(src.size[1]):
        t = y / src.size[1]
        c = (int(40 + 0 * t), int(150 - 40 * t), int(100 - 30 * t), 255)
        gd.line((0, y, src.size[0], y), fill=c)
    grad.putalpha(a)
    return grad

def front():
    im = base()
    d = ImageDraw.Draw(im)
    # mesh square behind the brand (echoes the Africa-outline mesh on the pack)
    for x in range(120, 420, 16):
        d.line((x, 70, x, 330), fill=(205, 212, 208), width=1)
    for y in range(70, 330, 16):
        d.line((120, y, 420, y), fill=(205, 212, 208), width=1)
    d.text((110, 120), 'SYNERA', font=font(96, True), fill=DARK_GREEN)
    d.text((330, 232), 'DuoForte', font=font(22), fill=DARK_GREEN)
    d.text((110, 300), 'Synera DuoForte®', font=font(34, True), fill=DARK_GREEN)
    logo = gdm_logo(True)
    lw = 380
    logo = logo.resize((lw, int(logo.size[1] * lw / logo.size[0])), Image.LANCZOS)
    im.paste(logo, (560, 90), logo)
    # LLIN band
    d.rounded_rectangle((150, 560, 850, 720), radius=70, fill=GREEN)
    centered(d, 585, 'Long Lasting Insecticidal Net (LLIN)', font(30, True), (255, 255, 255))
    centered(d, 628, 'Moustiquaire insecticide longue durée (LLIN)', font(26), (255, 255, 255))
    centered(d, 666, 'Mosquiteiro inseticida de longa duração (MILD)', font(26), (255, 255, 255))
    centered(d, 800, 'Dual Active Protection', font(40, True), GREEN)
    centered(d, 852, 'Double Protection Active', font(34, True), GREEN)
    centered(d, 898, 'Dupla proteção ativa', font(34, True), GREEN)
    d.ellipse((700, 1120, 960, 1200), fill=GREEN)
    f = font(26, True)
    w = d.textlength('Made in Nigeria', font=f)
    d.text((830 - w / 2, 1145), 'Made in Nigeria', font=f, fill=(255, 255, 255))
    return im

def net_icon(d, x, y, w, h):
    d.rounded_rectangle((x, y, x + w, y + h), radius=10, outline=(255, 255, 255), width=3, fill=(30, 135, 95))
    for i in range(1, 4):
        d.line((x + i * w / 4, y + 8, x + i * w / 4, y + h - 8), fill=(255, 255, 255), width=1)
        d.line((x + 8, y + i * h / 4, x + w - 8, y + i * h / 4), fill=(255, 255, 255), width=1)

def back():
    im = base()
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((60, 60, 940, 1190), radius=30, fill=GREEN)
    d.text((100, 100), 'Directions for Safe and Effective Use', font=font(34, True), fill=(255, 255, 255))
    steps = [
        (100, 170, 'Hang the net properly over the sleeping area, using the loops.'),
        (390, 170, 'Tuck the edges securely under the mattress or sleeping mat.'),
        (680, 170, 'Repair any holes immediately to maintain protection.'),
        (200, 350, 'Wash gently with soap in a bucket. No bleach. Dry in shade.'),
        (500, 350, 'Use the net every night for best protection against mosquitoes.'),
    ]
    for i, (x, y, cap) in enumerate(steps):
        d.ellipse((x, y, x + 36, y + 36), fill=(255, 255, 255))
        d.text((x + 10, y + 5), str(i + 1), font=font(22, True), fill=GREEN)
        net_icon(d, x + 50, y, 180, 110)
        # caption wrapped
        words, line, lines = cap.split(), '', []
        for wd in words:
            t = (line + ' ' + wd).strip()
            if d.textlength(t, font=font(14)) > 230:
                lines.append(line); line = wd
            else:
                line = t
        lines.append(line)
        for j, ln in enumerate(lines):
            d.text((x, y + 120 + j * 18), ln, font=font(14), fill=(255, 255, 255))
    d.line((100, 520, 900, 520), fill=(255, 255, 255), width=1)
    specs = [
        ('Product:', 'Synera Duoforte®'), ('Description:', 'Long lasting Insecticidal Net (LLIN)'),
        ('Material:', '100% Polyester'), ('Mesh Size:', '23 cm2'), ('Fabric Weight:', '40 g/m2'),
        ('Denier:', '100D'), ('Active Ingredients:', 'Chlorfenapyr 5.6 g/kg (+20%)'),
        ('', 'Alpha-cypermethrin 3.75 g/kg (+15%/-25%)'), ('Shape:', 'Rectangular'),
        ('Shelf Life:', '2 years from the date of manufacture'),
        ('Lifespan:', '20 washes and/or 3 years (whichever comes first'), ('', 'from first opening)'),
        ('Storage:', 'Store in a cool, dry place away from direct sunlight.'),
    ]
    y = 545
    for k, v in specs:
        if k:
            d.text((100, y), k, font=font(17, True), fill=(255, 255, 255)); y += 22
        d.text((100, y), v, font=font(16), fill=(255, 255, 255)); y += 24
    # label box
    d.rounded_rectangle((560, 820, 910, 1040), radius=8, fill=(255, 255, 255))
    rows = [('Dimensions:', '190(L)x180(W)x150(H)cm'), ('Color:', 'White'), ('NAFDAC Reg.:', ''),
            ('Batch No:', 'LLOLWT2209004'), ('Manufacturing Date:', 'June 2026'), ('Expiry Date :', '')]
    y = 835
    for k, v in rows:
        d.text((575, y), k, font=font(16, True), fill=(20, 20, 20))
        d.text((575 + d.textlength(k, font=font(16, True)) + 8, y), v, font=font(16), fill=(20, 20, 20))
        y += 33
    d.text((560, 1060), 'Manufactured in Nigeria by:', font=font(16, True), fill=(255, 255, 255))
    for j, ln in enumerate(['Harvestfield HealthCare FZE', 'Harvestfield Free Trade Zone, OPIC', 'Industrials Layout, Makun City', 'Lagos - Ibadan Expressway, Ogun state']):
        d.text((560, 1082 + j * 19), ln, font=font(14), fill=(255, 255, 255))
    d.text((100, 1120), 'Licenced under:', font=font(16, True), fill=(255, 255, 255))
    d.text((100, 1142), 'Guandong Medicine & Health Products', font=font(14), fill=(255, 255, 255))
    d.text((100, 1160), '(GDM Health Products)', font=font(14), fill=(255, 255, 255))
    return im

os.makedirs('public/product', exist_ok=True)
front().save('public/product/front.png', optimize=True)
back().save('public/product/back.png', optimize=True)
print('wrote public/product/front.png and back.png')


# ---------------------------------------------------------------------------
# Folded net bundle (what shows through the translucent film) + wrinkle bump map
# ---------------------------------------------------------------------------
def net_bundle():
    import random
    random.seed(11)
    im = Image.new('RGB', (W, H), (236, 238, 236))
    d = ImageDraw.Draw(im)
    # soft folds: broad diagonal bands of light and shade
    shade = Image.new('L', (W, H), 128)
    sd = ImageDraw.Draw(shade)
    for i in range(14):
        x = random.randint(-200, W)
        y = random.randint(-200, H)
        ang = random.uniform(-0.6, 0.6)
        length = random.randint(600, 1400)
        wdt = random.randint(40, 140)
        tone = random.choice([90, 100, 150, 165])
        import math
        dx, dy = math.cos(ang) * length, math.sin(ang) * length
        sd.line((x, y, x + dx, y + dy), fill=tone, width=wdt)
    shade = shade.filter(ImageFilter.GaussianBlur(45))
    base = Image.composite(Image.new('RGB', (W, H), (255, 255, 255)), Image.new('RGB', (W, H), (205, 208, 204)), shade)
    im = Image.blend(im, base, 0.85)
    d = ImageDraw.Draw(im)
    # fine mesh
    for x in range(0, W, 6):
        d.line((x, 0, x, H), fill=(214, 218, 214), width=1)
    for y in range(0, H, 6):
        d.line((0, y, W, y), fill=(214, 218, 214), width=1)
    # fold creases: crisp light lines
    for i in range(9):
        x = random.randint(0, W); y = random.randint(0, H); ang = random.uniform(-0.5, 0.5); ln = random.randint(300, 900)
        import math
        d.line((x, y, x + math.cos(ang) * ln, y + math.sin(ang) * ln), fill=(250, 250, 250), width=3)
    return im

def wrinkle_bump():
    import random, math
    random.seed(5)
    S = 512
    im = Image.new('L', (S, S), 128)
    d = ImageDraw.Draw(im)
    for i in range(140):
        x = random.randint(0, S); y = random.randint(0, S); ang = random.uniform(0, math.pi); ln = random.randint(30, 220)
        tone = random.choice([96, 108, 148, 160])
        d.line((x, y, x + math.cos(ang) * ln, y + math.sin(ang) * ln), fill=tone, width=random.randint(2, 7))
    im = im.filter(ImageFilter.GaussianBlur(3))
    # fine grain
    px = im.load()
    for y in range(S):
        for x in range(S):
            px[x, y] = max(0, min(255, px[x, y] + random.randint(-6, 6)))
    return im

net_bundle().save('public/product/net-bundle.png', optimize=True)
wrinkle_bump().save('public/product/wrinkles.png', optimize=True)
print('wrote net-bundle.png and wrinkles.png')
