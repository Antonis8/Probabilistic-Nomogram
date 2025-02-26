import xml.etree.ElementTree as ET

svg_file = "fuel_nomo.svg"
output_file = "manually_stripped_fuel2.svg"

try:
    tree = ET.parse(svg_file)
    root = tree.getroot()

    # Create a new SVG root element for the output
    new_svg = ET.Element(root.tag, root.attrib)

    # Iterate through all elements and find lines with linecap="butt"
    for elem in root.iter():
        if elem.tag.endswith('line') and elem.get('stroke-linecap') == 'butt':
            new_svg.append(elem)

    # Write the new SVG to the output file
    new_tree = ET.ElementTree(new_svg)
    new_tree.write(output_file)

    print(f"Isolated lines with linecap='butt' and saved to {output_file}")

except ET.ParseError as e:
    print(f"XML Parsing Error: {e}")