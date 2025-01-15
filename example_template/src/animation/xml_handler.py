import xml.etree.ElementTree as ET

tree = ET.parse('fuel_nomo.svg')
root = tree.getroot()

# Define the namespace
namespace = {'svg': 'http://www.w3.org/2000/svg'}

# Find all <g> elements with stroke-linecap="butt"

for g in root.findall(".//{http://www.w3.org/2000/svg}g[@stroke-linecap='butt']", namespaces=namespace):

    # Within these <g>, find all <path> elements
    for path in g.findall(".//{http://www.w3.org/2000/svg}path", namespaces=namespace):

        #if d is long > Scale!
        d = path.attrib.get('d')
        if d:
            print(f"d attribute: {len(d.split(" "))}")
        if len(d.split(" ")) > 2:
            print("hooray")
            path.set('is_scale', 'true')

output_file = 'augmented.svg'
tree.write(output_file)