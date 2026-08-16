import os
import subprocess
import time

OUTPUT_DIR = r"C:\Users\estim\.gemini\antigravity\scratch\lionstone-local-sandbox"
ARTIFACTS_DIR = r"C:\Users\estim\.gemini\antigravity\brain\63168fed-58f1-4f78-a04a-ae2204781637"
CSS_PATH = os.path.join(OUTPUT_DIR, "assets", "css", "customstyle.css")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def run_chrome_screenshot(url, output_name):
    target_img_path = os.path.join(ARTIFACTS_DIR, output_name)
    cmd = [
        CHROME_PATH,
        "--headless",
        "--disable-gpu",
        f"--screenshot={target_img_path}",
        "--window-size=1280,800",
        "--hide-scrollbars",
        url
    ]
    print(f"Running Chrome screenshot for {output_name}...")
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Screenshot saved to {target_img_path}")

def main():
    # Read original customstyle.css
    with open(CSS_PATH, 'r', encoding='utf-8') as f:
        orig_css = f.read()
        
    try:
        # 1. Capture Services Dropdown
        services_override = """
        #menu-item-4462 .wd-dropdown-menu {
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
            transform: none !important;
        }
        """
        with open(CSS_PATH, 'w', encoding='utf-8') as f:
            f.write(orig_css + services_override)
            
        time.sleep(1) # wait for local file system sync
        run_chrome_screenshot("http://localhost:8000/", "services_dropdown.png")
        
        # 2. Capture About Dropdown
        about_override = """
        #menu-item-4457 .wd-dropdown-menu {
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
            transform: none !important;
        }
        """
        with open(CSS_PATH, 'w', encoding='utf-8') as f:
            f.write(orig_css + about_override)
            
        time.sleep(1)
        run_chrome_screenshot("http://localhost:8000/", "about_dropdown.png")
        
    finally:
        # Restore original CSS
        with open(CSS_PATH, 'w', encoding='utf-8') as f:
            f.write(orig_css)
        print("CSS file successfully restored.")

if __name__ == "__main__":
    main()
