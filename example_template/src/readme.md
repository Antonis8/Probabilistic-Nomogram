# Readme

Put a brief description of your code here. This should at least describe the file structure.

## Build instructions

**You must** include the instructions necessary to build and deploy this project successfully. If appropriate, also include 
instructions to run automated tests. 

### Requirements

List the all of the pre-requisites software required to set up your project (e.g. compilers, packages, libraries, OS, hardware)

For example:

* Python 3.7
* Packages: listed in `requirements.txt` 
* Tested on Windows 10

or another example:

* Requires Raspberry Pi 3 
* a Linux host machine with the `arm-none-eabi` toolchain (at least version `x.xx`) installed
* a working LuaJIT installation > 2.1.0


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

