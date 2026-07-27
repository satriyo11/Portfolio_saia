from PIL import Image, ImageDraw, ImageFont
import os

BG = (11, 17, 32)
PRIMARY = (59, 130, 246)
SECONDARY = (139, 92, 246)
ACCENT = (6, 182, 212)
WHITE = (255,255,255)
SUBTLE = (203,213,225)

def font(size):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def gradient(w, h, c1, c2, diag=True):
    img = Image.new("RGB", (w, h), c1)
    px = img.load()
    for y in range(h):
        for x in range(w):
            t = ((x/w) + (y/h)) / 2 if diag else (y/h)
            r = int(c1[0] + (c2[0]-c1[0])*t)
            g = int(c1[1] + (c2[1]-c1[1])*t)
            b = int(c1[2] + (c2[2]-c1[2])*t)
            px[x,y] = (r,g,b)
    return img

def placeholder(path, w, h, label, sub="", c1=BG, c2=(23,32,55)):
    img = gradient(w, h, c1, c2)
    draw = ImageDraw.Draw(img, "RGBA")
    # subtle grid dots
    for gx in range(0, w, 40):
        for gy in range(0, h, 40):
            draw.ellipse([gx-1,gy-1,gx+1,gy+1], fill=(255,255,255,15))
    # accent border
    draw.rectangle([0,0,w-1,h-1], outline=(*PRIMARY, 120), width=3)
    f1 = font(max(18, w//14))
    f2 = font(max(12, w//28))
    bbox = draw.textbbox((0,0), label, font=f1)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    draw.text(((w-tw)/2, (h-th)/2 - (10 if sub else 0)), label, font=f1, fill=WHITE)
    if sub:
        bbox2 = draw.textbbox((0,0), sub, font=f2)
        tw2, th2 = bbox2[2]-bbox2[0], bbox2[3]-bbox2[1]
        draw.text(((w-tw2)/2, (h-th)/2 + th + 6), sub, font=f2, fill=SUBTLE)
    img.save(path, quality=88)

os.makedirs("assets/img", exist_ok=True)
os.makedirs("assets/ppt", exist_ok=True)
os.makedirs("assets/organization", exist_ok=True)
os.makedirs("assets/activity", exist_ok=True)

# PPT thumbnails
titles = ["Company Profile Deck", "Marketing Strategy PPT", "Annual Report Design"]
for i in range(1,4):
    placeholder(f"assets/ppt/thumbnail-{i}.jpg", 800, 500, f"PPT Preview {i}", titles[i-1])

# Organization photos
for i in range(1,5):
    placeholder(f"assets/organization/osis-{i}.jpg", 700, 500, f"OSIS {i}", "Ganti dengan foto asli")
for i in range(1,5):
    placeholder(f"assets/organization/mcc-{i}.jpg", 700, 500, f"MCC {i}", "Ganti dengan foto asli")

# Activity photos
capts = ["Seminar","Workshop","Kepanitiaan","Pelatihan","Kompetisi","Bakti Sosial","Kegiatan Kampus","Dokumentasi Lainnya"]
for i in range(1,9):
    placeholder(f"assets/activity/activity-{i}.jpg", 700, 900 if i%2==0 else 700, capts[i-1], f"Activity {i}")

# Portfolio images
port_titles = ["Website Portfolio", "PowerPoint Presentation", "UI Design Project", "Landing Page"]
for i,t in enumerate(port_titles, start=1):
    placeholder(f"assets/img/portfolio-{i}.jpg", 800, 600, t, "Klik untuk preview")

# Favicon
placeholder("assets/img/favicon.png", 64, 64, "S", "")

# OG image
placeholder("assets/img/og-image.jpg", 1200, 630, "Satriyo Priyo Widjaksono", "UI/UX & Presentation Designer")

print("done")
