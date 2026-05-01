import requests

links = [
    "https://vigneshvl-dev.github.io/PORTFOLIO/",
    "https://vigneshvl-dev.github.io/PORTFOLIO/match.html",
    "https://vigneshvl-dev.github.io/PORTFOLIO/brick-breaker.html",
    "https://github.com/vigneshvl-dev/PORTFOLIO",
    "https://github.com/vigneshvl-dev/BRICK-BREAKER-GAME",
    "https://vigneshvl-dev.github.io/BRICK-BREAKER-GAME/",
    "https://x.com/vikyvelappan"
]

for link in links:
    try:
        response = requests.head(link, allow_redirects=True, timeout=10)
        print(f"{link}: {response.status_code}")
    except Exception as e:
        print(f"{link}: Error {e}")
