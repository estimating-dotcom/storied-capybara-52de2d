import os
import re

FILEPATH = r"C:\Users\estim\.gemini\antigravity\scratch\lionstone-local-sandbox\index.html"

with open(FILEPATH, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Let's search for adminbar or admin-bar or wpadminbar
matches = [m.start() for m in re.finditer(r'adminbar|admin-bar|wpadminbar', html)]
print(f"Found {len(matches)} admin bar references.")
for idx, pos in enumerate(matches[:5]):
    start = max(0, pos - 100)
    end = min(len(html), pos + 200)
    print(html[start:end])
    print("-" * 50)
