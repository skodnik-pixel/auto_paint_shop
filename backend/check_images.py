
import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from catalog.models import Product

def check_local_images():
    products = Product.objects.all()
    remote_count = 0
    local_count = 0
    empty_count = 0
    
    print(f"Total products: {products.count()}")
    print("-" * 50)
    
    for p in products:
        img = str(p.image).strip() if p.image else ""
        if not img:
            empty_count += 1
        elif img.startswith('http'):
            remote_count += 1
        else:
            local_count += 1
            print(f"LOCAL IMAGE: ID {p.id} ({p.name}) -> '{img}'")
            
    print("-" * 50)
    print(f"Stats: Remote={remote_count}, Local={local_count}, Empty={empty_count}")

if __name__ == '__main__':
    check_local_images()
