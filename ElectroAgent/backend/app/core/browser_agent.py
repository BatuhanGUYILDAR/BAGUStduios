from __future__ import annotations

import urllib.parse
import webbrowser


class BrowserAgent:
    def search_web(self, query: str) -> dict[str, str | bool]:
        encoded = urllib.parse.urlencode({"q": query})
        url = f"https://www.google.com/search?{encoded}"
        opened = webbrowser.open(url)
        return {
            "opened": opened,
            "url": url,
            "summary": "Opened a browser search for the requested goal.",
        }
