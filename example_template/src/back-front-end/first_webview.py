import webview

class API:
    def sendTouchData(self, coordinates):
        print(f"User touched at: X={coordinates['x']}, Y={coordinates['y']}")
        return "Coordinates received"

# Create and launch the webview
api = API()
window = webview.create_window("Touch Tracker", "frontend.html", js_api=api)
webview.start()
