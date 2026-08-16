import os
import subprocess
import time

OUTPUT_DIR = r"C:\Users\estim\.gemini\antigravity\scratch\lionstone-local-sandbox"
ARTIFACTS_DIR = r"C:\Users\estim\.gemini\antigravity\brain\63168fed-58f1-4f78-a04a-ae2204781637"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def run_chrome_screenshot(url, output_name):
    target_img_path = os.path.join(ARTIFACTS_DIR, output_name)
    cmd = [
        CHROME_PATH,
        "--headless",
        "--disable-gpu",
        f"--screenshot={target_img_path}",
        "--window-size=1280,1200",
        "--hide-scrollbars",
        url
    ]
    print(f"Running Chrome screenshot for {output_name}...")
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Screenshot saved to {target_img_path}")

def main():
    run_chrome_screenshot("http://localhost:8000/", "homepage.png")
    run_chrome_screenshot("http://localhost:8000/services.html", "services_page.png")

if __name__ == "__main__":
    main()
