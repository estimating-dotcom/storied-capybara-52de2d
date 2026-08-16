import os
import re
import urllib.request
import urllib.parse
import ssl

ssl_context = ssl._create_unverified_context()

CSS_DIR = r"C:\Users\estim\.gemini\antigravity\scratch\lionstone-local-sandbox\assets\css"
IMAGES_DIR = r"C:\Users\estim\.gemini\antigravity\scratch\lionstone-local-sandbox\assets\images"
os.makedirs(IMAGES_DIR, exist_ok=True)

def download_asset(url, target_path):
    try:
        print(f"Downloading: {url} -> {target_path}")
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
        )
        with urllib.request.urlopen(req, context=ssl_context) as response:
            with open(target_path, 'wb') as f:
                f.write(response.read())
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def process_css_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        css = f.read()
        
    original = css
    
    # Regex to find background-image urls pointing to either floorlaunching or lionstonefloors
    url_patterns = [
        r'url\((["\']?)(https://lionstone-concrete-coating-llc\.floorlaunching\.com/wp-content/uploads/[^"\')\s]+)(["\']?)\)',
        r'url\((["\']?)(https://lionstonefloors\.com/wp-content/uploads/[^"\')\s]+)(["\']?)\)'
    ]
    
    replacements_count = 0
    for pattern in url_patterns:
        matches = re.findall(pattern, css)
        for quote_start, remote_url, quote_end in matches:
            clean_url = remote_url.split('?')[0].split('#')[0]
            filename = os.path.basename(urllib.parse.urlparse(clean_url).path)
            if not filename:
                continue
                
            local_path = os.path.join(IMAGES_DIR, filename)
            
            download_success = True
            if not os.path.exists(local_path):
                download_success = download_asset(remote_url, local_path)
                
            if download_success:
                local_ref = f"../images/{filename}"
                css = css.replace(remote_url, local_ref)
                replacements_count += 1
                
    if css != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(css)
        print(f"Updated {replacements_count} background links in {os.path.basename(filepath)}")
    else:
        print(f"No adjustments needed in {os.path.basename(filepath)}")

def main():
    print("=== Localizing CSS Background Images ===")
    for file in os.listdir(CSS_DIR):
        if file.endswith('.css'):
            process_css_file(os.path.join(CSS_DIR, file))
    print("=== Localization Completed! ===")

if __name__ == "__main__":
    main()
