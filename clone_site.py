import os
import re
import ssl
import urllib.request
import urllib.parse

# Bypass SSL verification for scrapers
ssl_context = ssl._create_unverified_context()

BASE_URL = "https://lionstonefloors.com"
OUTPUT_DIR = r"C:\Users\estim\.gemini\antigravity\scratch\lionstone-local-sandbox"

# Create asset subfolders
assets_dirs = {
    "images": os.path.join(OUTPUT_DIR, "assets", "images"),
    "css": os.path.join(OUTPUT_DIR, "assets", "css"),
    "js": os.path.join(OUTPUT_DIR, "assets", "js")
}

for d in assets_dirs.values():
    os.makedirs(d, exist_ok=True)

# List of pages to clone
pages = {
    "/": "index.html",
    "/about-us/": "about-us.html",
    "/services/": "services.html",
    "/contact/": "contact.html",
    "/reviews/": "reviews.html"
}

def download_url(url):
    """Fetch HTML content of a URL."""
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
        )
        with urllib.request.urlopen(req, context=ssl_context) as response:
            return response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching URL {url}: {e}")
        return None

def download_binary(url, filepath):
    """Download a binary file (e.g. image) and save it."""
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
        )
        with urllib.request.urlopen(req, context=ssl_context) as response, open(filepath, 'wb') as f:
            f.write(response.read())
        return True
    except Exception as e:
        print(f"Error downloading asset {url}: {e}")
        return False

# Cache of downloaded assets to avoid downloading multiple times
downloaded_assets = {}

def process_page_assets(html):
    """Find all local images, CSS, and JS files, download them, and replace HTML references."""
    # Find images: <img src="...">
    # We target both double and single quotes
    img_matches = re.findall(r'<img[^>]+src=["\'](https://lionstonefloors.com/wp-content/uploads/[^"\']+)["\']', html)
    
    # Also find background images in inline styles: url("...")
    bg_matches = re.findall(r'url\(["\']?(https://lionstonefloors.com/wp-content/uploads/[^"\')\s]+)["\']?\)', html)
    
    all_images = list(set(img_matches + bg_matches))
    print(f"Found {len(all_images)} unique images to download.")
    
    for img_url in all_images:
        filename = os.path.basename(urllib.parse.urlparse(img_url).path)
        if not filename:
            continue
        
        local_path = os.path.join(assets_dirs["images"], filename)
        relative_path = f"./assets/images/{filename}"
        
        if img_url not in downloaded_assets:
            print(f"Downloading image: {filename}")
            success = download_binary(img_url, local_path)
            downloaded_assets[img_url] = success
            
        if downloaded_assets.get(img_url):
            # Replace img src attributes
            html = html.replace(img_url, relative_path)
            # Replace styling background urls
            html = html.replace(img_url.replace("/", "\\/"), relative_path.replace("/", "\\/"))
            
    # Also download custom stylesheets to let them edit CSS locally
    # Custom CSS files like child style.css
    css_matches = re.findall(r'<link[^>]+href=["\'](https://lionstonefloors.com/wp-content/themes/woodmart-child/[^"\']+\.css[^"\']*)["\']', html)
    css_matches += re.findall(r'<link[^>]+href=["\'](https://lionstonefloors.com/wp-content/themes/woodmart-child/includes/css/[^"\']+\.css[^"\']*)["\']', html)
    
    for css_url in list(set(css_matches)):
        # Strip query params like ?ver=85d1b
        clean_url = css_url.split('?')[0]
        filename = os.path.basename(urllib.parse.urlparse(clean_url).path)
        if not filename:
            continue
            
        local_path = os.path.join(assets_dirs["css"], filename)
        relative_path = f"./assets/css/{filename}"
        
        if css_url not in downloaded_assets:
            print(f"Downloading stylesheet: {filename}")
            success = download_binary(css_url, local_path)
            downloaded_assets[css_url] = success
            
        if downloaded_assets.get(css_url):
            html = html.replace(css_url, relative_path)

    return html

def fix_known_bugs(html, is_homepage=False):
    """Fix the template bugs identified in the audit."""
    # 1. Fix H1 typo on homepage
    if is_homepage:
        html = html.replace("Connecticut.?", "Connecticut?")
        
    # 2. Fix Local Schema Address & Phone in JSON-LD
    # Replace Humble Texas address in schema
    html = html.replace('"streetAddress":"6226 Kristen Park Lane"', '"streetAddress":"12 Bartlett Court"')
    html = html.replace('"addressLocality":"Humble"', '"addressLocality":"Wilbraham"')
    html = html.replace('"addressRegion":"Texas"', '"addressRegion":"Massachusetts"')
    html = html.replace('"postalCode":"77346"', '"postalCode":"01095"')
    
    # Replace Texas Phone Number in schema
    html = html.replace('"+1-346-229-1153"', '"+1-860-805-0061"')
    
    # Replace Legal Name in schema
    html = html.replace('"legalName":"Stone FX Internationals LLC"', '"legalName":"LionStone Concrete Coating LLC"')
    
    # Replace floorlaunching staging URL with correct live URL
    html = html.replace("https://lionstone-concrete-coating-llc.floorlaunching.com/", "https://lionstonefloors.com/")

    # 3. Fix Placeholder Social Media Links in Footer
    html = html.replace('href="http://instagram_url"', 'href="https://instagram.com/lionstoneconcretecoatings" title="Instagram"')
    html = html.replace('href="http://youtube_url"', 'href="#" title="YouTube (Not Configured)"')
    html = html.replace('href="http://x_url"', 'href="#" title="X/Twitter (Not Configured)"')
    html = html.replace('href="http://linkedin_url"', 'href="#" title="LinkedIn (Not Configured)"')
    html = html.replace('href="http://pinterest_url"', 'href="#" title="Pinterest (Not Configured)"')
    html = html.replace('href="http://houzz_url"', 'href="#" title="Houzz (Not Configured)"')
    html = html.replace('href="http://yelp_url"', 'href="#" title="Yelp (Not Configured)"')

    # 4. Fix redirect issue for Residential Garage Flooring on homepage
    # Change `/polished-concrete-houston/` to relative `./reviews.html` (or you can map it to another local page)
    html = html.replace('href="https://lionstonefloors.com/polished-concrete-houston/"', 'href="./reviews.html"')
    html = html.replace('href="/polished-concrete-houston/"', 'href="./reviews.html"')
    
    # Replace other menu and footer links to be relative local files
    html = html.replace('href="https://lionstonefloors.com/about-us/"', 'href="./about-us.html"')
    html = html.replace('href="https://lionstonefloors.com/services/"', 'href="./services.html"')
    html = html.replace('href="https://lionstonefloors.com/contact/"', 'href="./contact.html"')
    html = html.replace('href="https://lionstonefloors.com/reviews/"', 'href="./reviews.html"')
    html = html.replace('href="https://lionstonefloors.com/"', 'href="./index.html"')
    
    # Handle root relative links as well
    html = html.replace('href="/about-us/"', 'href="./about-us.html"')
    html = html.replace('href="/services/"', 'href="./services.html"')
    html = html.replace('href="/contact/"', 'href="./contact.html"')
    html = html.replace('href="/reviews/"', 'href="./reviews.html"')
    
    return html

def main():
    print(f"Starting local static sandbox clone in {OUTPUT_DIR}...")
    
    for path_suffix, filename in pages.items():
        url = BASE_URL + path_suffix
        print(f"\n--- Scraping {url} ---")
        
        html = download_url(url)
        if not html:
            print(f"Skipping {url} due to download failure.")
            continue
            
        # Download assets and rewrite paths
        html = process_page_assets(html)
        
        # Apply bug fixes
        is_homepage = (path_suffix == "/")
        html = fix_known_bugs(html, is_homepage=is_homepage)
        
        # Save page
        output_path = os.path.join(OUTPUT_DIR, filename)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Successfully saved to {filename}")

    print("\n--- Sandbox Clone Completed successfully! ---")

if __name__ == "__main__":
    main()
