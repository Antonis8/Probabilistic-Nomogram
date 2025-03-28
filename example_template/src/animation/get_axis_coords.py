from pprint import pprint


import xml.etree.ElementTree as ET
 
tree = ET.parse('fuel_nomo.svg')
root = tree.getroot()
view_box= [-9.74501, -440.202]
x_offset = view_box[0]
y_offset = view_box[1]

namespace = {'svg': 'http://www.w3.org/2000/svg'}

def trim_svg_keep_axis():
    # output:  one string of chained command paths

    # Find all <g> elements with stroke-linecap="butt"
    paths = []
    for g in root.findall(".//{http://www.w3.org/2000/svg}g[@stroke-linecap='butt']", namespaces=namespace):

        # Within these <g>, find all <path> elements
        for path in g.findall(".//{http://www.w3.org/2000/svg}path", namespaces=namespace):

            #if d is long > Scale!
            d = path.attrib.get('d')
            if len(d.split(" ")) > 5:
                paths.append(d)
    return paths

def trim_linetos(axis = 0):
    # input: Axis number
    # output: Shifted MOVETO coordinate pairs (x,y) - sorted by y

    paths = trim_svg_keep_axis()
    MLpairs = paths[axis].split('M')[2:]

    decimals = 1
    moves = []
    for path in MLpairs:
        move_xy= path.split("L")[0].split()
        #print("PATH: " + str(move_xy))
        
        new_x =round((float(move_xy[0]) - x_offset),decimals)
        new_y= round((float(move_xy[1]) - y_offset),decimals)
        new_move = [new_x, new_y]
        moves.append(new_move)
    return sortMoves(moves)

def sortMoves(moves):
    # input: unsorted moves
    # output: sorted moves
    sorted_moves = sorted(moves, key= lambda x: x[1])
    return sorted_moves

def map_axis_to_coordinates(axis_count= 3):
    # input: N of axis
    # output: dict mapping axis to list of coordinates
    
    axis_to_coords= {}
    for axis in range(axis_count):
        axis_name = "Axis " + str(axis+1)
        axis_to_coords[axis_name] = trim_linetos(axis)

    pprint(axis_to_coords)

    return axis_to_coords

map_axis_to_coordinates()
