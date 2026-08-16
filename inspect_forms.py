import urllib.request
import urllib.error

url = "http://localhost:8000/contact.html"
print(f"Requesting {url}...")
try:
    with urllib.request.urlopen(url, timeout=5) as response:
        html = response.read()
        print("Success! Status code:", response.status)
        print("Response length:", len(html))
        # Check if the native form exists in the served HTML
        if b'Estimate Form (Website)' in html:
            print("Verified: Native Estimate Form is present in served HTML.")
        else:
            print("Error: Form not found in served HTML.")
except urllib.error.URLError as e:
    print("Failed to reach local server:", e)






