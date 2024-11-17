import pyx
import pyx.path, pyx.canvas
from example_template.src.sample_generators.add import main as generate_addition_nomo

# Save the original pyx.path.line method
original_line = pyx.path.line
original_circle= pyx.path.circle
original_moveto = pyx.path.moveto
original_lineto = pyx.path.lineto

lines= []
circles= []

def patched_line(x1, y1, x2, y2):
    print(f"Line from ({x1}, {y1}) to ({x2}, {y2})")
    c.stroke(original_line(x1, y1, x2, y2))
    lines.append([x1, y1, x2, y2])
    return original_line(x1, y1, x2, y2)

def patched_circle(x, y ,r):
    #print(f"Circle with center ({x}, {y}) and radius {r}")
    c.stroke(original_circle(x,y,r))
    circles.append([x,y, r])
    return original_circle(x , y, r)

def patched_moveto(x, y):
    moveto = original_moveto(x, y)
    #c.stroke(moveto)
    print(f"moveto called with coordinates: ({x}, {y})")
    return original_moveto(x, y)

def patched_lineto(x, y):
    lineto = original_lineto(x, y)
    c.stroke(lineto)
    return original_lineto(x, y)



#monkey patch
pyx.path.line = patched_line
pyx.path.circle = patched_circle
#pyx.path.moveto = patched_moveto
pyx.path.lineto = patched_lineto

# CANVAS.CANVAS CREATES FRESH PDF
c = pyx.canvas.canvas()

#generate_addition_nomo()

def draw():
    for line in lines:
        c.stroke(line)

    for circle in circles:
        c.stroke(circle)
#draw()

def print_stuff():
    print("Lines")
    print(lines)
    print("Circles:" )
    print(circles)

def draw_moveto_lineto():
    path = pyx.path.path(
        pyx.path.moveto(0, 0),
        pyx.path.lineto(1, 1),
        pyx.path.lineto(2, 0)
    )
    c.stroke(path)

#draw_moveto_lineto()
thin_line = pyx.path.path(
    pyx.path.moveto(0, 0),   # Move the cursor to the starting point (x1, y1)
    pyx.path.lineto(5, 5)    # Draw a line from (x1, y1) to (x2, y2)
)
#c.writePDFfile("example")