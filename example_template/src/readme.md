# Probabilistic Nomogram Generator

## Project Structure

Under `example_template/src` you will find the 3 main folders:

- **`back-end`** - Responsible for nomogram generation and axes coordinate-value pair collection
- **`nomogram-generation-front-end`** - Contains the PyWebView app that adds a layer over the back-end, and routes to the interactive front-end. 
- **`front-end`** - Contains all JavaScript components for generating and handling the probabilistic nomogram

## Requirements

### Prerequisites
- Python 3.7+
- VS Code (or IDE capable of running HTML files as a live server)
- Tested on Windows 10

### PyNomo installation
Please follow the official guide on https://lefakkomies.github.io/pynomo-doc/installation/installation.html

If you have issues with Tex installation, follow the section below.

### TeX Installation
**NOTE:** TeX is required for PyNomo, but standard installation can take 24+ hours.

**Recommended approach:**
1. Download nearest CTAN ISO image. For UK: https://mirror.ox.ac.uk/sites/ctan.org/
2. Navigate to: `systems/texlive/Images/`
3. Download `texlive2024.iso` (or latest version)
4. Mount the ISO file (Windows 10+ right-click → Mount)
5. Run `install-tl-windows.bat` from mounted drive

### Python Dependencies
Install packages listed in `requirements.txt`:

```bash
pip install -r requirements.txt
```

## Setup Instructions

### 1. Install Requirements
Follow the Requirements section above and activate your virtual environment.

### 2. PyNomo Modification
**Required:** Modify PyNomo to export tick data for the probabilistic system. Locate the pynomo folder in your virtual environment. 

#### Add Function to `pynomo/nomo_axis.py`
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

#### Modify `_make_tick_lines()` Function
Insert this line at **line 987**, at the end of the `_make_tick_lines()` function:
```python
self._write_tick_list_to_json(tick_list)
```

## Usage
Ensure your virtual environment is activated. 

### Option 1: Interactive Mode (Recommended)
```bash
cd example_template/src/nomogram-generation-front-end
python main.py
```

Choose from 3 pre-selected nomograms or add custom ones to `src/back-end/sample_nomograms/` following the existing format.

**Limitations:** 3 axes with straight lines only.

### Option 2: Manual Mode (If Interactive Fails)
If port issues occur, run backend and frontend separately:

#### Run Backend
```bash
cd example_template/src/back-end

```
```bash
python get_axis_coords.py fuel
```
Available nomograms: `fuel`, `multiply`, `add`, or custom ones in `sample_nomograms/`

#### Run Frontend
```bash
cd src/front-end/main/
```

Right-click `index.html` → "Open with Live Server" (VS Code)

**Note:** Live server is necessary for proper functionality.

## Adding Custom Nomograms
1. Create new `.py` file in `back-end/sample_nomograms/`
2. Follow existing format (see `fuel.py`, `multiply.py`, `add.py`)
3. Ensure exactly 3 axes with straight lines
4. Reference by filename when running backend

## Troubleshooting
- Ensure virtual environment is activated
- Verify TeX installation if PyNomo fails
- Check port availability for PyWebView
- Use live server for frontend (static files may not work)
- If everything fails for whatever reason, the probabilistic nomogram of the front-end is hosted on https://antonis8.github.io/Probabilistic-Nomogram/example_template/src/front-end/main/.
- This was used for evaluation and will remain live. 