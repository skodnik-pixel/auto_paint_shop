
import requests

url = 'https://krasavto.by/image/cachewebp/catalog/product123/jeta-pro-5573-ocistitelu-na-vodnoi-osnove-1ljetapro55731-6090-500x400.webp'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

try:
    print(f"Trying to download {url}...")
    response = requests.get(url, headers=headers, timeout=10)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("Success! Content length:", len(response.content))
        with open('test_image.webp', 'wb') as f:
            f.write(response.content)
        print("Saved to test_image.webp")
    else:
        print("Failed.")
except Exception as e:
    print(f"Error: {e}")
