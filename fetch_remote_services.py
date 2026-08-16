import urllib.request
import ssl
import re

def compare_services():
    ctx = ssl._create_unverified_context()
    req = urllib.request.Request(
        'https://lionstonefloors.com/services/', 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            remote_html = response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching remote services page: {e}")
        return

    # Let's find post-2290 in remote html
    idx = remote_html.find('id="post-2290"')
    if idx == -1:
        print("post-2290 not found in remote html")
        return
    
    print("REMOTE SERVICES HTML SUBSECTION (post-2290):")
    # Let's print from idx to the next 6000 chars
    print(remote_html[idx:idx+6000])

if __name__ == "__main__":
    compare_services()
