import os

CSS_DIR = r"C:\Users\estim\.gemini\antigravity\scratch\lionstone-local-sandbox\assets\css"

def search_floorlaunching():
    for file in os.listdir(CSS_DIR):
        if file.endswith('.css'):
            filepath = os.path.join(CSS_DIR, file)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            if 'floorlaunching' in content:
                print(f"Found 'floorlaunching' in {file}")
                # Print some matching contexts
                pos = content.find('floorlaunching')
                print(content[max(0, pos - 100):min(len(content), pos + 200)])
                print("-" * 50)
            else:
                print(f"No 'floorlaunching' in {file}")

if __name__ == "__main__":
    search_floorlaunching()
