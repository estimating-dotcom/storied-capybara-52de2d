import os
import re

FILEPATH = r"C:\Users\estim\.gemini\antigravity\scratch\lionstone-local-sandbox\index.html"

with open(FILEPATH, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Locate dropdown div inside menu item 4462 (Services)
services_dropdown = re.search(r'<li id="menu-item-4462".*?(<div class="color-scheme-dark[^>]*>.*?</div>\s*</div>\s*</li>)', html, re.DOTALL)
if services_dropdown:
    print("=== SERVICES DROPDOWN HTML ===")
    print(services_dropdown.group(1))
else:
    print("Services dropdown div not found using standard regex")

# Locate dropdown div inside menu item 4457 (About)
about_dropdown = re.search(r'<li id="menu-item-4457".*?(<div class="color-scheme-dark[^>]*>.*?</div>\s*</div>\s*</li>)', html, re.DOTALL)
if about_dropdown:
    print("\n=== ABOUT DROPDOWN HTML ===")
    print(about_dropdown.group(1))
else:
    print("About dropdown div not found using standard regex")
