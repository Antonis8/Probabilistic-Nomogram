import pyx
import pyx.path, pyx.canvas
from example_template.src.sample_generators.add import main as generate_addition_nomo
import types

#Create canvas
my_canvas = pyx.canvas.canvas()

#Save by reference
original_stroke_pointer = pyx.canvas.canvas.stroke

# save by copyy
my_canvas.stroke = types.FunctionType(
    pyx.canvas.canvas.stroke.__code__,
    pyx.canvas.canvas.stroke.__globals__,
    name=pyx.canvas.canvas.stroke.__name__,
    argdefs=pyx.canvas.canvas.stroke.__defaults__,
    closure=pyx.canvas.canvas.stroke.__closure__
)
#TRY AGAIN WITHOUT SELF 
def patched_stroke(self, path, *args, **kwargs):
    print(f"Stroke called with path: {path}")
    my_canvas.stroke(self, path, *args, **kwargs)
    return original_stroke_pointer(self,path, *args, **kwargs)

pyx.canvas.canvas.stroke = patched_stroke

# nomogram
#generate_addition_nomo()

my_canvas.stroke(pyx.path.path(0, 0, 1, 1))  # This will use the original stroke
# Save
my_canvas.writePDFfile("Intercept_stroke.pdf")
