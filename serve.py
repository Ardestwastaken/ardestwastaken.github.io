# Local preview server for the portfolio (used by preview.bat).
# Same as `python -m http.server`, but tells the browser never to cache files,
# so a normal reload always shows your latest changes.
import functools
import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ROOT = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


handler = functools.partial(NoCacheHandler, directory=ROOT)
print(f"Previewing at http://localhost:{PORT} (Ctrl+C to stop)")
http.server.ThreadingHTTPServer(("", PORT), handler).serve_forever()
