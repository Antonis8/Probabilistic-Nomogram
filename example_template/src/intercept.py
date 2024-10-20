import pyx
import pyx.path, pyx.canvas
from add import main as generate_addition_nomo

# Save the original pyx.path.line method
original_line = pyx.path.line
original_circle= pyx.path.circle

lines= []
circles= []

def patched_line(x1, y1, x2, y2):
    print(f"Line from ({x1}, {y1}) to ({x2}, {y2})")
    c.stroke(original_line(x1, y1, x2, y2))
    #lines.append([x1, y1, x2, y2])
    return original_line(x1, y1, x2, y2)

def patched_circle(x, y ,r):
    print(f"Circle with center ({x}, {y}) and radius {r}")
    c.stroke(original_circle(x,y,r))
    circles.append([x,y, r])
    return original_circle(x , y, r)

#monkey patch
pyx.path.line = patched_line
pyx.path.circle = patched_circle

# CANVAS.CANVAS CREATES FRESH PDF
c = pyx.canvas.canvas()
#line = pyx.path.line(0, 0, 3, 1)
#circle = pyx.path.circle(2, 2, 1)

#c.stroke(circle)
#c.stroke(line)

generate_addition_nomo()

print("Lines")
print(lines)
print("Circles:" )
print(circles)

def draw():
    for line in lines:
        c.stroke(line)

    for circle in circles:
        c.stroke(circle)
#draw()
c.writePDFfile("example")