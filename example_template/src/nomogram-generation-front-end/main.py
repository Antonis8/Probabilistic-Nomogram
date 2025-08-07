import webview
import subprocess
import os
import time
import threading
import http.server
import socketserver
import socket

class API:
    def __init__(self):
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        
    def generateNomogram(self, nomogram_type):
        """Generate nomogram and return result"""
        try:
            script_path = os.path.join(self.script_dir, "..", "back-end", "get_axis_coords.py")
            
            # Add a small delay to show the loading animation
            time.sleep(0.5)
            
            # Use the same Python executable that's running this script
            # This ensures we use the same virtual environment with pynomo installed
            python_exe = os.sys.executable
            
            result = subprocess.run(
                [python_exe, script_path, nomogram_type],
                capture_output=True,
                text=True,
                cwd=os.path.dirname(script_path)
            )
            
            if result.returncode == 0:
                return {"success": True, "message": f"Generated {nomogram_type} nomogram"}
            else:
                error_msg = result.stderr.strip() if result.stderr else result.stdout.strip()
                return {"success": False, "error": error_msg or "Unknown error occurred"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}

def is_port_in_use(port):
    """Check if a port is already in use"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(('127.0.0.1', port))
            return False
        except socket.error:
            return True

def start_local_server():
    """Start a local HTTP server on port 5500"""
    try:
        # Navigate to the project root directory (example_template)
        project_root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
        os.chdir(project_root)
        
        PORT = 5600 # random port to avoid conflicts with Live Server
        Handler = http.server.SimpleHTTPRequestHandler
        
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"Serving at http://127.0.0.1:{PORT}")
            httpd.serve_forever()
    except Exception as e:
        print(f"Error starting server: {e}")

# Check if port 5500 is already in use
PORT = 5500
if is_port_in_use(PORT):
    print(f"Port {PORT} is already in use (likely Live Server). Using existing server.")
else:
    # Start the local server in a background thread
    server_thread = threading.Thread(target=start_local_server, daemon=True)
    server_thread.start()
    print(f"Started local server on port {PORT}")

# Give the server a moment to start (if we started one)
time.sleep(1)

# Create and launch the webview
api = API()

# Get the absolute path to index.html
script_dir = os.path.dirname(os.path.abspath(__file__))
frontend_path = os.path.join(script_dir, "index.html")

window = webview.create_window(
    "Nomogram Generator", 
    frontend_path, 
    js_api=api, 
    width=800, 
    height=600,
    resizable=True
)   
webview.start(debug=False)
