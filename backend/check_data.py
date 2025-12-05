import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
django.setup()

from catalog.models import Category, Brand, Product

print("=" * 60)
print("КАТЕГОРИИ:")
print("=" * 60)
categories = Category.objects.all()
if categories:
    for c in categories:
        print(f"  ID: {c.id} | Название: {c.name} | Slug: {c.slug}")
else:
    print("  Категории не найдены!")

print("\n" + "=" * 60)
print("БРЕНДЫ:")
print("=" * 60)
brands = Brand.objects.all()
if brands:
    for b in brands:
        print(f"  ID: {b.id} | Название: {b.name} | Slug: {b.slug}")
else:
    print("  Бренды не найдены!")

print("\n" + "=" * 60)
print("ТОВАРЫ:")
print("=" * 60)
products = Product.objects.all()
if products:
    for p in products:
        print(f"  ID: {p.id} | {p.name}")
        print(f"    Категория: {p.category.name if p.category else 'Нет'}")
        print(f"    Бренд: {p.brand.name if p.brand else 'Нет'}")
        print(f"    Slug: {p.slug}")
        print()
else:
    print("  Товары не найдены!")

print("=" * 60)
print(f"Всего категорий: {categories.count()}")
print(f"Всего брендов: {brands.count()}")
print(f"Всего товаров: {products.count()}")
print("=" * 60)
