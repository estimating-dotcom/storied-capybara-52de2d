#!/usr/bin/env python3
"""
LionStone Floors - Local Development & Lead Capture Server
Serves static website files and captures quote estimates into leads.json and leads.csv.
"""

import sys
import os
import json
import csv
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LEADS_JSON_PATH = os.path.join(BASE_DIR, 'leads.json')
LEADS_CSV_PATH = os.path.join(BASE_DIR, 'leads.csv')

class LionStoneRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_GET(self):
        if self.path == '/api/leads':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            if os.path.exists(LEADS_JSON_PATH):
                with open(LEADS_JSON_PATH, 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(b'[]')
            return
        
        super().do_GET()

    def do_POST(self):
        if self.path == '/api/apply-photo-changes':
            content_length = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_length)
            try:
                payload = json.loads(post_body.decode('utf-8'))
            except Exception as exc:
                err_bytes = json.dumps({"status": "error", "message": f"Invalid JSON: {exc}"}).encode('utf-8')
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Length', str(len(err_bytes)))
                self.end_headers()
                self.wfile.write(err_bytes)
                return

            overrides_path = os.path.join(BASE_DIR, 'photo_overrides.json')
            payload['saved_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            with open(overrides_path, 'w', encoding='utf-8') as f:
                json.dump(payload, f, indent=2)

            applied_count = 0
            for change in payload.get('changes', []):
                target_file = change.get('file', '')
                if not target_file or '/' in target_file or '\\' in target_file:
                    continue
                file_path = os.path.join(BASE_DIR, target_file)
                if not os.path.isfile(file_path):
                    continue
                with open(file_path, 'r', encoding='utf-8') as f:
                    html = f.read()
                updated = False
                orig_src = change.get('origSrc', '')
                new_src = change.get('newSrc', '')
                orig_title = change.get('origTitle', '')
                new_title = change.get('newTitle', '')
                orig_caption = change.get('origCaption', '')
                new_caption = change.get('newCaption', '')

                if new_src and orig_src and not new_src.startswith('data:') and orig_src != new_src:
                    # Only replace cleanly if origTitle or origSrc context matches
                    if orig_title and orig_title in html:
                        idx = html.find(orig_title)
                        window_start = max(0, idx - 600)
                        window_end = min(len(html), idx + 600)
                        segment = html[window_start:window_end]
                        if orig_src in segment:
                            segment = segment.replace(orig_src, new_src, 1)
                            html = html[:window_start] + segment + html[window_end:]
                            updated = True
                    elif orig_src in html:
                        html = html.replace(orig_src, new_src, 1)
                        updated = True

                if new_title and orig_title and orig_title != new_title and orig_title in html:
                    html = html.replace(orig_title, new_title, 1)
                    updated = True

                if new_caption and orig_caption and orig_caption != new_caption and orig_caption in html:
                    html = html.replace(orig_caption, new_caption, 1)
                    updated = True

                if updated:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(html)
                    applied_count += 1

            resp_bytes = json.dumps({
                "status": "success",
                "saved_file": "photo_overrides.json",
                "applied_count": applied_count
            }).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

        if self.path in ['/api/estimate', '/api/contact', '/contact.html', '/index.html', '/']:
            content_length = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_length)
            
            lead_data = {}
            content_type = self.headers.get('Content-Type', '')
            
            if 'application/json' in content_type:
                try:
                    lead_data = json.loads(post_body.decode('utf-8'))
                except Exception:
                    pass
            elif 'application/x-www-form-urlencoded' in content_type:
                parsed = urllib.parse.parse_qs(post_body.decode('utf-8', errors='ignore'))
                lead_data = {k: v[0] if len(v) == 1 else v for k, v in parsed.items()}
            elif 'multipart/form-data' in content_type:
                # Basic multipart parsing fallback
                try:
                    import email
                    from email.parser import BytesParser
                    msg = BytesParser().parsebytes(b"Content-Type: " + content_type.encode() + b"\r\n\r\n" + post_body)
                    for part in msg.get_payload():
                        cd = part.get("Content-Disposition", "")
                        if 'name="' in cd:
                            field_name = cd.split('name="')[1].split('"')[0]
                            lead_data[field_name] = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                except Exception:
                    # Fallback string extraction
                    pass

            lead_data['received_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            lead_data['routed_to'] = 'estimating@lionstonefloors.com'
            
            # Save to leads.json
            leads = []
            if os.path.exists(LEADS_JSON_PATH):
                try:
                    with open(LEADS_JSON_PATH, 'r', encoding='utf-8') as f:
                        leads = json.load(f)
                except Exception:
                    leads = []
            leads.append(lead_data)
            with open(LEADS_JSON_PATH, 'w', encoding='utf-8') as f:
                json.dump(leads, f, indent=2)

            # Save to leads.csv
            file_exists = os.path.exists(LEADS_CSV_PATH)
            keys = ['received_at', 'name', 'phone', 'email', 'project_type', 'sqft', 'message', 'routed_to']
            with open(LEADS_CSV_PATH, 'a', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=keys, extrasaction='ignore')
                if not file_exists:
                    writer.writeheader()
                writer.writerow(lead_data)

            # Print conspicuous notice in terminal
            print("\n" + "="*65)
            print(" [LIONSTONE FLOORS] NEW ESTIMATE REQUEST RECEIVED!")
            print(f" Target Email: estimating@lionstonefloors.com | Time: {lead_data['received_at']}")
            print("="*65)
            for k, v in lead_data.items():
                if k not in ['g-recaptcha-response', 'form-name', '_wpcf7']:
                    print(f"  * {k.title():<15}: {v}")
            print(f" Saved to: {os.path.basename(LEADS_JSON_PATH)} & {os.path.basename(LEADS_CSV_PATH)}")
            print("="*65 + "\n")

            # Send JSON response
            resp_bytes = json.dumps({
                "status": "success",
                "message": "Estimate successfully received and recorded for estimating@lionstonefloors.com",
                "data": lead_data
            }).encode('utf-8')

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(b'{"status": "ok"}')

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, LionStoneRequestHandler)
    print(f"\n=======================================================")
    print(f" LionStone Floors Server Running on http://localhost:{PORT}")
    print(f" Capturing leads for: estimating@lionstonefloors.com")
    print(f" Leads will be saved to leads.json & leads.csv")
    print(f"=======================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
