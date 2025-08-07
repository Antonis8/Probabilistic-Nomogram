import heapq
import json
from pprint import *
import xml.etree.ElementTree as ET
import os

# Get the absolute path of the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

from sample_nomograms.add import main as generateAdditionNomogram
from sample_nomograms.multiply import main as generateMultiplyNomogram
from sample_nomograms.fuel import main as generateFuelNomogram


svg_filename = 'nomogram.svg'


MULTIPLICATION_NOMO_SCALING_FACTOR = 1.3227
namespace = {'svg': 'http://www.w3.org/2000/svg'}


def trim_svg_keep_axis():
    # output:  one string of chained command paths
    tree = ET.parse(svg_filename)
    root = tree.getroot()


    # Find all <g> elements with stroke-linecap="butt"
    paths = []
    for g in root.findall(".//{http://www.w3.org/2000/svg}g[@stroke-linecap='butt']", namespaces=namespace):

        # Within these <g>, find all <path> elements
        for path in g.findall(".//{http://www.w3.org/2000/svg}path", namespaces=namespace):

            #if d is long > Scale!
            d = path.attrib.get('d')
            if len(d.split(" ")) > 5:
                paths.append(d)
    viewBox_attr = root.attrib.get("viewBox")
    if viewBox_attr:
        viewBox = [float(val) for val in viewBox_attr.split()][:2]
    else:
        viewBox = None

    return {"paths": paths, "viewBox": viewBox}

def trim_linetos(axis = 0):
    # input: Axis number
    # output: Shifted MOVETO coordinate pairs (x,y) - sorted by y

    paths = trim_svg_keep_axis()["paths"]
    viewBox = trim_svg_keep_axis()["viewBox"]
    x_offset = viewBox[0]
    y_offset = viewBox[1]
    MLpairs = paths[axis].split('M')[2:]

    decimals = 1
    moves = []
    for path in MLpairs:
        move_xy= path.split("L")[0].split()


        new_x= (float(move_xy[0]) - x_offset)
        scaled_x =round( new_x * MULTIPLICATION_NOMO_SCALING_FACTOR ,decimals)

        new_y= round((float(move_xy[1]) - y_offset),decimals)
        scaled_y = round(new_y * MULTIPLICATION_NOMO_SCALING_FACTOR, decimals)
        new_move = [scaled_x, scaled_y]
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
    return axis_to_coords

# get tick list
def readJSON(filename="tick_list.json"):
    filepath = os.path.join(SCRIPT_DIR, filename)
    with open(filepath, 'r') as file:
        try:
            existing_data = json.load(file)
            #print(f"JSON read from {filepath}!")
        except json.JSONDecodeError:
            print("Json file likely just empty")
            existing_data = []
    return existing_data

def delete_redundant_json(filename="tick_list.json"):
    filepath = os.path.join(SCRIPT_DIR, filename)
    if os.path.exists(filepath):
        os.remove(filepath)
    else:
        print(f"JSON file at {filepath} does not exist.")

def getTickCoords(VAR_LEVELS = 3, TICK_LEVELS = 2, data = None):
    Axis_ticks = {}
    for i in range(VAR_LEVELS):

        start_idx= i*TICK_LEVELS
        end_idx = start_idx + TICK_LEVELS
        if i==1:
            sorted_axis_ticks= merge_n_sorted_lists(data[start_idx:end_idx])[::-1]
        else:
            sorted_axis_ticks= merge_n_sorted_lists(data[start_idx:end_idx])

        axis_name= "Axis " + str(i+1)
        Axis_ticks[axis_name] = sorted_axis_ticks
    
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
            coords = str(coord_list[i]) 
            value = round(axis_values_dict[axis][i], 1)
            coords_to_values[coords] = value


        # x,y bounds
        x_coords, y_coords = zip(*coord_list)
        xMin, xMax = min(x_coords), max(x_coords)
        yMin, yMax = min(y_coords), max(y_coords)

        # value bounds
        values = axis_values_dict[axis]
        valueMin, valueMax = min(values), max(values)

        # hacky test if logarithmic or linear
        negligible_difference = 0.2
        n = len(values)
        midpoint = n // 2
        if abs((values[0] - values[5]) - (values[5] - values[10])) > negligible_difference:
            scale = "logarithmic"
        else:
            scale = "linear"

        # Save
        axis_to_coord_values[axis] = {
            "xMin": xMin,
            "xMax": xMax,
            "yMin": yMin,
            "yMax": yMax,
            "valueMin": valueMin,
            "valueMax": valueMax,
            "points": coords_to_values,
            "scale": scale,
        }
    return (axis_to_coord_values)

def save_to_json():
    axis_to_coord_values = map_axis_to_coordinate_value_pairs()
    
    serializable_dict = axis_to_coord_values
    # Write the dictionary to a JSON file in the same directory as the script
    frontend_main_dir = os.path.join(SCRIPT_DIR, "..", "front-end", "main")
    frontend_main_dir = os.path.normpath(frontend_main_dir)  # Clean up the path
    filepath = os.path.join(frontend_main_dir, "axis_to_coord_values.json")
    
    with open(filepath, "w") as json_file:
        json.dump(serializable_dict, json_file)
    print(f"Dictionary written to {filepath}")

def main():
    # different_nomograms = [generateAdditionNomogram(), 
    #                        generateMultiplyNomogram(),
    #                        generateFuelNomogram()]
    generateAdditionNomogram()
    map_axis_to_coordinate_value_pairs()
    save_to_json()
    delete_redundant_json()


main()    