import pprint
from pynomo.nomographer import Nomographer
import heapq
import json
import numpy as np

def main():
    TICK_LEVELS = 3
    VAR_LEVELS = 3

    N_params_1 = {
        'u_min': 0.0,
        'u_max': 10.0,
        'function': lambda u: u,
        'title': r'$u_1$',
        'tick_levels': TICK_LEVELS,
        'tick_text_levels': 1,
    }

    N_params_2 = {
        'u_min': 0.0,
        'u_max': 10.0,
        'function': lambda u: u,
        'title': r'$u_2$',
        'tick_levels': TICK_LEVELS,
        'tick_text_levels': 1,
    }

    N_params_3 = {
        'u_min': 0.0,
        'u_max': -10.0,
        'function': lambda u: u,
        'title': r'$u_3$',
        'tick_levels': TICK_LEVELS,
        'tick_text_levels': 1,
    }

    block_1_params = {
        'block_type': 'type_1',
        'width': 10.0,
        'height': 10.0,
        'f1_params': N_params_1,
        'f2_params': N_params_2,
        'f3_params': N_params_3,
        'isopleth_values': [[6, 2, 'x']],
    }

    main_params = {
        'filename': 'add.svg',
        'paper_height': 10.0,
        'paper_width': 10.0,
        'block_params': [block_1_params],
        'transformations': [('rotate', 0.01), ('scale paper',)],
        'title_str': r'$u_1+u_2+u_3=0$',
        'debug': False,
        'svg_file': True,
    }
    cleanseJSON()
    Nomographer(main_params)
    getTickCoords(VAR_LEVELS, TICK_LEVELS, data = readJSON())

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

        sorted_axis_ticks= merge_n_sorted_lists(data[start_idx:end_idx])

        axis_name= "Axis " + str(i+1)
        Axis_ticks[axis_name] = sorted_axis_ticks

    pprint.pp(Axis_ticks)

def merge_n_sorted_lists(lists):
    """
    :param lists: List of sorted lists
    :return: A single sorted list
    """
    return list(heapq.merge(*lists))


if __name__ == "__main__":
    #getTickCoords()
    main()