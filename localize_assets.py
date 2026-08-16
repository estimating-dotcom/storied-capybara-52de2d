import os
import re
import ssl
import urllib.request
import urllib.parse

# Bypass SSL verification for scrapers
ssl_context = ssl._create_unverified_context()

BASE_URL = "https://lionstonefloors.com"
OUTPUT_DIR = r"C:\Users\estim\.gemini\antigravity\scratch\lionstone-local-sandbox"

assets_dirs = {
    "images": os.path.join(OUTPUT_DIR, "assets", "images"),
    "css": os.path.join(OUTPUT_DIR, "assets", "css"),
    "js": os.path.join(OUTPUT_DIR, "assets", "js"),
    "fonts": os.path.join(OUTPUT_DIR, "assets", "fonts")
}

for d in assets_dirs.values():
    os.makedirs(d, exist_ok=True)

download_cache = {}

def download_file(url, target_path):
    """Download a file from a URL to a local target path."""
    if url in download_cache:
        return download_cache[url]
    
    # Clean URL of version params for the request, but retain them if needed
    try:
        print(f"Downloading: {url} -> {target_path}")
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
        )
        with urllib.request.urlopen(req, context=ssl_context) as response:
            data = response.read()
            with open(target_path, 'wb') as f:
                f.write(data)
        download_cache[url] = True
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        download_cache[url] = False
        return False

def localize_css_content(css_content, css_url):
    """Scan CSS file contents for remote urls, download them, and rewrite them to relative paths."""
    # Find all url(...) references in CSS
    url_matches = re.findall(r'url\((["\']?)(https://lionstonefloors.com/wp-content/[^"\')\s]+)(["\']?)\)', css_content)
    
    for quote_start, remote_url, quote_end in url_matches:
        # Strip query parameters for local filename
        clean_url = remote_url.split('?')[0].split('#')[0]
        filename = os.path.basename(urllib.parse.urlparse(clean_url).path)
        if not filename:
            continue
            
        # Determine asset category
        ext = os.path.splitext(filename)[1].lower()
        if ext in ['.woff', '.woff2', '.ttf', '.eot', '.otf']:
            category = "fonts"
            rel_prefix = "../fonts/"
        elif ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']:
            category = "images"
            rel_prefix = "../images/"
        else:
            category = "images" # fallback
            rel_prefix = "../images/"
            
        local_path = os.path.join(assets_dirs[category], filename)
        
        # Download the asset
        if download_file(remote_url, local_path):
            # Rewrite CSS to reference local relative path
            local_ref = f"{rel_prefix}{filename}"
            css_content = css_content.replace(remote_url, local_ref)
            
    return css_content

def process_html_file(filepath):
    """Scan HTML file, download all remote assets, and update references."""
    print(f"\nProcessing HTML file: {filepath}")
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
        
    # 1. Localize Stylesheets: <link rel="stylesheet" href="...">
    css_links = re.findall(r'<link[^>]+href=["\'](https://lionstonefloors.com/wp-content/[^"\']+\.css[^"\']*)["\']', html)
    for css_url in list(set(css_links)):
        clean_url = css_url.split('?')[0]
        filename = os.path.basename(urllib.parse.urlparse(clean_url).path)
        if not filename:
            continue
            
        local_path = os.path.join(assets_dirs["css"], filename)
        relative_path = f"./assets/css/{filename}"
        
        # Download CSS
        if download_file(css_url, local_path):
            # Read CSS file, parse for internal URLs, and rewrite
            try:
                with open(local_path, 'r', encoding='utf-8', errors='ignore') as f_css:
                    css_data = f_css.read()
                updated_css_data = localize_css_content(css_data, css_url)
                with open(local_path, 'w', encoding='utf-8') as f_css:
                    f_css.write(updated_css_data)
            except Exception as e:
                print(f"Error parsing downloaded CSS {filename}: {e}")
                
            # Replace link in HTML
            html = html.replace(css_url, relative_path)
            
    # 2. Localize Scripts: <script src="...">
    js_links = re.findall(r'<script[^>]+src=["\'](https://lionstonefloors.com/[^"\']+\.js[^"\']*)["\']', html)
    for js_url in list(set(js_links)):
        clean_url = js_url.split('?')[0]
        filename = os.path.basename(urllib.parse.urlparse(clean_url).path)
        if not filename:
            continue
            
        local_path = os.path.join(assets_dirs["js"], filename)
        relative_path = f"./assets/js/{filename}"
        
        if download_file(js_url, local_path):
            html = html.replace(js_url, relative_path)
            
    # 3. Localize Images and background-images that were missed
    img_links = re.findall(r'<img[^>]+src=["\'](https://lionstonefloors.com/[^"\']+)["\']', html)
    bg_links = re.findall(r'url\(["\']?(https://lionstonefloors.com/[^"\')\s]+)["\']?\)', html)
    
    # Also catch data-src or other source attributes used by lazy loaders
    lazy_links = re.findall(r'data-src=["\'](https://lionstonefloors.com/[^"\']+)["\']', html)
    lazy_srcset = re.findall(r'data-srcset=["\'](https://lionstonefloors.com/[^"\']+)["\']', html)
    
    all_images = list(set(img_links + bg_links + lazy_links + lazy_srcset))
    for img_url in all_images:
        # Ignore non-wp-content links if any
        if "wp-content" not in img_url:
            continue
        clean_url = img_url.split('?')[0].split(',')[0].strip() # clean srcset parameters if any
        filename = os.path.basename(urllib.parse.urlparse(clean_url).path)
        if not filename:
            continue
            
        local_path = os.path.join(assets_dirs["images"], filename)
        relative_path = f"./assets/images/{filename}"
        
        if download_file(img_url, local_path):
            html = html.replace(img_url, relative_path)

    # 4. Save modified HTML back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Saved changes to {filepath}")

def main():
    html_files = [
        "index.html",
        "about-us.html",
        "services.html",
        "contact.html",
        "reviews.html"
    ]
    
    print("=== Starting Remote Asset Localization ===")
    for filename in html_files:
        filepath = os.path.join(OUTPUT_DIR, filename)
        if os.path.exists(filepath):
            process_html_file(filepath)
        else:
            print(f"File not found: {filepath}")
            
    print("=== Asset Localization Completed! ===")

if __name__ == "__main__":
    main()
