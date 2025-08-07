from pynomo.nomographer import Nomographer

def main():

# Define the parameters for A, B, and C
     A = {'u_min': 0, 
          'u_max': 20, 
          'title': 'A', 
          'function': lambda u: u,
          'tick_levels': 3,
          'tick_text_levels': 2,
          }
     B = {'u_min': 0, 
          'u_max': 10, 
          'title': 'B', 
          'function': lambda u: u,
          'scale_type': 'linear smart',    
          'tick_levels': 3,
          'tick_text_levels': 2,
          }

     C = {'u_min': 0, 
          'u_max': 10, 
          'title': 'C',
          'function': lambda u: u,
          'scale_type': 'linear smart',
          'tick_levels': 3,
          'tick_text_levels': 2,
     }

     # Define the block parameters
     block_SI = {'block_type': 'type_2',
               'f1_params': A,
               'f2_params': B, 
               'f3_params': C,
               #'debug': True,
     }

     # Define the main parameters
     main_params = {'filename': 'nomogram.svg', 'paper_height':15.0,
     'paper_width':15.0,'block_params': [block_SI],
     'title_str': r'\LARGE A = BxC',
     'svg_file': True,
     }

     # Generate the nomogram
     Nomographer(main_params)

if __name__ == "__main__":
     main()