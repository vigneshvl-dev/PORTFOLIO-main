import requests

page = 1
while True:
    url = f"https://api.github.com/users/vigneshvl-dev/repos?page={page}&per_page=100"
    response = requests.get(url)
    if response.status_code == 200:
        repos = response.json()
        if not repos:
            break
        for repo in repos:
            print(repo['name'])
        page += 1
    else:
        print(f"Error: {response.status_code}")
        break
