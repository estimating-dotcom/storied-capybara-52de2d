import os
import re

OUTPUT_DIR = r"C:\Users\estim\.gemini\antigravity\scratch\lionstone-local-sandbox"
html_files = ["index.html", "about-us.html", "services.html", "contact.html", "reviews.html"]

def check_menus(filename):
    filepath = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(filepath):
        return
        
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
        
    # Services
    srv_match = re.search(r'<li id="menu-item-4462"[^>]*>', html)
    srv_class = srv_match.group(0) if srv_match else "NOT FOUND"
    
    # About
    abt_match = re.search(r'<li id="menu-item-4457"[^>]*>', html)
    abt_class = abt_match.group(0) if abt_match else "NOT FOUND"
    
    print(f"\n=== {filename} ===")
    print(f"Services tag: {srv_class}")
    print(f"About tag:    {abt_class}")

if __name__ == "__main__":
    for f in html_files:
        check_menus(f)
