import os
import re

CSS_DIR = r"C:\Users\estim\.gemini\antigravity\scratch\lionstone-local-sandbox\assets\css"

def search_menu_ids():
    target_ids = ["menu-item-4457", "menu-item-4462", "4457", "4462"]
    for file in os.listdir(CSS_DIR):
        if file.endswith('.css'):
            filepath = os.path.join(CSS_DIR, file)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            for target in target_ids:
                matches = re.finditer(r'#' + target + r'\b|[^{}]*' + target + r'[^{}]*\{[^}]*\}', content)
                for idx, m in enumerate(matches):
                    start = max(0, m.start() - 50)
                    end = min(len(content), m.end() + 100)
                    print(f"Found {target} in {file}:")
                    print(content[start:end])
                    print("-" * 50)

if __name__ == "__main__":
    search_menu_ids()
