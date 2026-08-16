import os
import re

FILEPATH = r"C:\Users\estim\.gemini\antigravity\scratch\lionstone-local-sandbox\index.html"

with open(FILEPATH, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Find Services menu item markup
services_match = re.search(r'<li id="menu-item-4462"[^>]*>.*?</li>', html, re.DOTALL)
if services_match:
    print("=== SERVICES MENU ITEM ===")
    print(services_match.group(0)[:800])

# Find About menu item markup
about_match = re.search(r'<li id="menu-item-4457"[^>]*>.*?</li>', html, re.DOTALL)
if about_match:
    print("\n=== ABOUT MENU ITEM ===")
    print(about_match.group(0)[:800])
