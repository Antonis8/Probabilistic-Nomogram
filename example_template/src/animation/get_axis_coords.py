import heapq
import json
from pprint import *
import xml.etree.ElementTree as ET
from add import main as generateNomogram

tree = ET.parse('src/animation/add.svg')
root = tree.getroot()
view_box= [-6.08628, -295.841]
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
        print("Number of ticks for Axis " + str(axis) + ": " + str(len(trim_linetos(axis))))

    pprint(axis_to_coords)

    return axis_to_coords

# tick list
def cleanseJSON(filepath = "tick_list.json"):
    with open(filepath, 'w') as file:
            print("Cleansing json file")
            json.dump([], file)

def readJSON(filepath = "tick_list.json"):
    with open(filepath, 'r') as file:
        try:
            existing_data = json.load(file)
            print("JSON read!")
        except json.JSONDecodeError:
            print("Json file likely just empty")
    #breakpoint()
    return existing_data

def getTickCoords(VAR_LEVELS = 3, TICK_LEVELS = 2, data = readJSON()):

    Axis_ticks = {}
    for i in range(VAR_LEVELS):

        start_idx= i*TICK_LEVELS
        end_idx = start_idx + TICK_LEVELS
        #print("Start" + str(start_idx) + ", End:" + str(end_idx))
        if i==1:
            sorted_axis_ticks= merge_n_sorted_lists(data[start_idx:end_idx])[::-1]
        else:
            sorted_axis_ticks= merge_n_sorted_lists(data[start_idx:end_idx])

        axis_name= "Axis " + str(i+1)
        Axis_ticks[axis_name] = sorted_axis_ticks

    pprint(Axis_ticks)
    for axis in Axis_ticks:
        print(len(Axis_ticks[axis]))
    
    return(Axis_ticks)


def merge_n_sorted_lists(lists):
    """
    :param lists: List of sorted lists
    :return: A single sorted list
    """
    return list(heapq.merge(*lists))

def map_axis_to_ticklist():
    TICK_LEVELS = 3
    N_AXIS = 3
    cleanseJSON()
    generateNomogram()
    return getTickCoords(N_AXIS, TICK_LEVELS, data = readJSON())



def map_axis_to_coordinate_value_pairs():
    axis_values_dict = map_axis_to_ticklist()
    '''
    'Axis 3': [-10.0,
               -9.9,
               -9.8, ...
               ]
            
    '''
    axis_coords_dict = map_axis_to_coordinates()
    ''' 
     'Axis 3': [
                [293.2, 156.7],
                [293.2, 159.6], ...
               ]
    '''

    axis_to_coord_values= {}
    for axis, coord_list in axis_coords_dict.items():

        coords_to_values = {}
        for i in range(len(coord_list)):
            #convert [x,y] list into (x,y) tuple for hashing
            coords = tuple(coord_list[i]) 
            value = round(axis_values_dict[axis][i], 1)
            coords_to_values[coords] = value

            # print("Pairs: ")
            # print(str(coords) +" : " + str(value))

        axis_to_coord_values[axis] = coords_to_values
    
    pprint(axis_to_coord_values)
    return (axis_to_coord_values)



def main():     
    map_axis_to_coordinate_value_pairs()



main()
