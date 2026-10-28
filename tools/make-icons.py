"""Generates icons/icon-{16,48,128}.png: a blue shield with a white check mark.
Run: python3 tools/make-icons.py"""
import math, os, struct, zlib

SS = 4  # supersampling per axis for smooth edges

def in_shield(u, v):
    if not (0.10 <= v <= 0.94):
        return False
    if v <= 0.52:
        # flat top with slightly rounded shoulders
        half = 0.36
        if v < 0.18:
            half -= (0.18 - v) * 1.2
        return abs(u - 0.5) <= half
    t = (v - 0.52) / (0.94 - 0.52)
    return abs(u - 0.5) <= 0.36 * (1 - t ** 1.6)

def seg_dist(px, py, ax, ay, bx, by):
    dx, dy = bx - ax, by - ay
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))

def in_check(u, v):
    w = 0.055
    return (seg_dist(u, v, 0.32, 0.50, 0.45, 0.63) <= w or
            seg_dist(u, v, 0.45, 0.63, 0.69, 0.35) <= w)

def pixel(x, y, size):
    r = g = b = a = 0.0
    for sy in range(SS):
        for sx in range(SS):
            u, v = (x + (sx + .5) / SS) / size, (y + (sy + .5) / SS) / size
            if not in_shield(u, v):
                continue
            # vertical gradient light-to-dark blue; white check on top
            if in_check(u, v):
                c = (255, 255, 255)
            else:
                k = (v - 0.1) / 0.84
                c = (int(66 - 40 * k), int(133 - 30 * k), int(244 - 20 * k))
            r += c[0]; g += c[1]; b += c[2]; a += 1
    n = SS * SS
    if a == 0:
        return (0, 0, 0, 0)
    return (round(r / a), round(g / a), round(b / a), round(255 * a / n))

def png(size):
    raw = b''.join(
        b'\x00' + b''.join(bytes(pixel(x, y, size)) for x in range(size)) for y in range(size)
    )
    def chunk(t, d):
        c = struct.pack('>I', len(d)) + t + d
        return c + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'icons')
os.makedirs(out, exist_ok=True)
for s in (16, 48, 128):
    with open(os.path.join(out, f'icon-{s}.png'), 'wb') as f:
        f.write(png(s))
