# Readme

Under src you will find the 3 main folders. "Back-end" is responsible for nomogram generation and axes coordinate-value pair collection. "nomogram-generation-front-end" holds the pywebview code sitting on top of this. "front-end" contains all the JS code for generating and handling the probabilistic nomogram. 

## Build instructions

1. Install requirements (follow requirements section)

2. Modify one PyNomo function 

## PyNomo Modification Instructions


### 1. Add Function to `pynomo/nomo_axis.py`

Please include this function in `pynomo/nomo_axis.py`:

```python
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
```

### 2. Modify `_make_tick_lines()` Function

Additionally, insert the following line of code at **line 987**, at the end of the function `_make_tick_lines()`:

```python
self._write_tick_list_to_json(tick_list)
```

## Why?
These modifications will enable the PyNomo library to export tick list data to a JSON file for use with the backend system.



### Requirements

List the all of the pre-requisites software required to set up your project (e.g. compilers, packages, libraries, OS, hardware)

For example:

* Python 3.7
* Packages: listed in `requirements.txt` 
* Tested on Windows 10


1. Tex (Pynomo requirement)
    
Installing Tex can take very very long with a live installation (>24h)

Instead download your nearest CTAN image via ISO. For UK:
https://mirror.ox.ac.uk/sites/ctan.org/

Steps:

1. In the CTAN mirror directory, go to: "systems/texlive/Images/"

2. Download a file named something like texlive2024.iso

3. After downloading, mount the ISO file on Windows by right-clicking it and selecting Mount (Windows 10+ has this feature built-in).
If you're on an older version of Windows, you may need a third-party tool like WinCDEmu to mount the ISO.

4. Open the mounted ISO and run "install-tl-windows.bat" to start the installation.

### Build steps



### Test steps

List steps needed to show your software works. This might be running a test suite, or just starting the program; but something that could be used to verify your code is working correctly.

Examples:

* Run automated tests by running `pytest`
* Start the software by running `bin/editor.exe` and opening the file `examples/example_01.bin`

