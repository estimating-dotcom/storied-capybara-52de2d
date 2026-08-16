import urllib.request
import ssl

ssl_context = ssl._create_unverified_context()
urls = [
    "https://lionstonefloors.com/calendar/",
    "https://www.lionstonefloors.com/calendar/",
]

for url in urls:
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
        )
        with urllib.request.urlopen(req, context=ssl_context) as response:
            status = response.getcode()
            print(f"URL: {url} -> Status: {status}")
            content = response.read().decode('utf-8', errors='ignore')
            print(f"Length of content: {len(content)}")
            print("First 200 characters:", content[:200])
    except Exception as e:
        print(f"URL: {url} -> Error: {e}")
