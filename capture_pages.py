import os
import subprocess
import time
import http.server
import socketserver
import threading

ARTIFACTS_DIR = r"C:\Users\jobbe\.gemini\antigravity\brain\ec193f78-68f2-41c9-8523-b22103b86d9c"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 8089

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=r"c:\Users\jobbe\OneDrive\Desktop\programming\AntiGravity\LionStoneWebsite", **kwargs)

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()

def run_chrome_screenshot(url, output_name, width=1280, height=1200):
    target_img_path = os.path.join(ARTIFACTS_DIR, output_name)
    cmd = [
        CHROME_PATH,
        "--headless",
        "--disable-gpu",
        f"--screenshot={target_img_path}",
        f"--window-size={width},{height}",
        "--hide-scrollbars",
        url
    ]
    print(f"Running Chrome screenshot for {output_name}...")
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Saved: {target_img_path}")

def main():
    # Start server in background thread
    t = threading.Thread(target=start_server, daemon=True)
    t.start()
    time.sleep(1)

    pages = [
        ("http://localhost:8089/index.html", "homepage.png"),
        ("http://localhost:8089/services.html", "services_page.png"),
        ("http://localhost:8089/reviews.html", "reviews_page.png"),
        ("http://localhost:8089/about-us.html", "about_us_page.png"),
        ("http://localhost:8089/contact.html", "contact_page.png"),
        ("http://localhost:8089/index.html", "homepage_mobile.png", 390, 844)
    ]

    for p in pages:
        if len(p) == 4:
            run_chrome_screenshot(p[0], p[1], p[2], p[3])
        else:
            run_chrome_screenshot(p[0], p[1])

    print("All screenshots captured successfully.")

if __name__ == "__main__":
    main()
