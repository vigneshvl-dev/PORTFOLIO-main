import requests

links = [
    "https://vigneshvl-dev.github.io/PORTFOLIO/",
    "https://vigneshvl-dev.github.io/portfolio/",
    "https://vigneshvl-dev.github.io/PORTFOLIO/index.html",
    "https://vigneshvl-dev.github.io/PORTFOLIO/MATCH.html",
    "https://vigneshvl-dev.github.io/PORTFOLIO/match.html"
]

for link in links:
    try:
        response = requests.get(link, allow_redirects=True, timeout=10)
        print(f"{link}: {response.status_code}")
    except Exception as e:
        print(f"{link}: Error {e}")
