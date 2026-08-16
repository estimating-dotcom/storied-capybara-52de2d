import urllib.request
import ssl
import json
import re

ssl_context = ssl._create_unverified_context()
url = "https://links.floorlaunch.com/widget/form/8NspFPVIP0Lxw5uBRMkY"

try:
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    with urllib.request.urlopen(req, context=ssl_context) as response:
        content = response.read().decode('utf-8', errors='ignore')
    
    print("Content length:", len(content))
    
    # Save the raw HTML to inspect it if needed
    with open("iframe_raw.html", "w", encoding="utf-8") as f:
        f.write(content)
        
    # Search for anything like redirect, thankyou, thank-you, success, action, submit
    # In GHL, the form state/schema is often inside a window.__INITIAL_STATE__ or in script tags
    print("Looking for URLs in scripts...")
    urls = re.findall(r'https?://[^\s"\'>]+', content)
    for u in set(urls):
        if "thank" in u.lower() or "success" in u.lower() or "lionstone" in u.lower():
            print("  Found interesting URL:", u)
            
    # Print script block contents containing window or state
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
    for i, script in enumerate(scripts):
        if "__INITIAL_STATE__" in script or "form" in script or "redirect" in script:
            print(f"Script {i} contains keywords. Length: {len(script)}")
            # print first 500 chars of it
            print(script[:500] + "...")
            
except Exception as e:
    print("Error:", e)
