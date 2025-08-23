'''

Please include this function in pynomo/nomo_axis.py

Additionally, insert the following line of code in line 987, at the end of the function _make_tick_lines():

self._write_tick_list_to_json(tick_list)


'''
def _write_tick_list_to_json(self, tick_list):
        import os
        import json
        current_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.join(current_dir,'..', '..', '..', '..', '..', 'src', 'back-end')
        backend_dir = os.path.normpath(backend_dir)
        json_file_path = os.path.join(backend_dir, 'tick_list.json')


        existing_data = []
        try:
            with open(json_file_path, 'r') as file:
                existing_data = json.load(file)
        except json.JSONDecodeError:
            print("Json file likely just empty")
        except FileNotFoundError:
            #print("Json file not found, creating a new one.")
            pass

        existing_data.append(tick_list)

        with open(json_file_path, 'w') as file:
            #print(f"Writing to: {json_file_path}")
            json.dump(existing_data, file)

