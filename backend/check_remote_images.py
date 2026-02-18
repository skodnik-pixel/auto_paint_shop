
import os
import django
import sys
import requests

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from catalog.models import Product

def check_remote_images():
    products = Product.objects.all()
    print("Checking remote images...")
    
    count = 0
    errors = 0
    
    for p in products:
        img = str(p.image).strip()
        if not img:
            print(f"WARNING: Product '{p.name}' (ID {p.id}) has NO image.")
            continue
            
        if img.startswith('http'):
            count += 1
            if count > 10: break # Check first 10 only to be fast
            
            try:
                r = requests.head(img, timeout=5)
                if r.status_code != 200:
                    print(f"ERROR: {r.status_code} for {p.name} -> {img}")
                    errors += 1
                else:
                    print(f"OK: {p.name}")
            except Exception as e:
                print(f"EXCEPTION: {e} for {p.name} -> {img}")
                errors += 1

    print("-" * 30)
    print(f"Checked first {count} remote images. Found {errors} errors.")

if __name__ == '__main__':
    check_remote_images()
