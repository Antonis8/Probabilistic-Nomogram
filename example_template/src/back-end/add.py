from pynomo.nomographer import Nomographer

def main():
    TICK_LEVELS = 3

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

    Nomographer(main_params)


if __name__ == "__main__":
    main()