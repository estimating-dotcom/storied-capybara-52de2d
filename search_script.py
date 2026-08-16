import sys
sys.stdout.reconfigure(encoding='utf-8')

def print_index_lines():
    with open('index.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for i in range(950, min(970, len(lines))):
        print(f"Line {i+1}: {lines[i].strip()}")

if __name__ == "__main__":
    print_index_lines()
