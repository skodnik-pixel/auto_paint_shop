# Тестирование добавления товара в корзину

## Проблема
Товар не добавляется в корзину при нажатии кнопки "В корзину"

## Шаги для диагностики

### 1. Проверьте консоль браузера (F12)

Откройте консоль разработчика и посмотрите на сообщения при нажатии "В корзину".

Должны появиться логи:
```
Добавление товара в корзину: {url: "...", product_slug: "...", token: "..."}
Ответ сервера: 200 OK
Товар добавлен: {...}
```

### 2. Проверьте авторизацию

Откройте консоль браузера и выполните:
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

Если токен или пользователь отсутствуют - войдите в систему заново.

### 3. Проверьте backend

Запустите тестовый скрипт:
```bash
cd backend
python test_cart_add.py
```

Скрипт покажет:
- Есть ли пользователи в системе
- Есть ли товары
- Токен для тестирования
- Команду curl для проверки API

### 4. Тест через curl

Скопируйте команду из вывода скрипта и выполните:
```bash
curl -X POST http://127.0.0.1:8000/api/cart/cart/add_item/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token ВАШ_ТОКЕН" \
  -d '{"product_slug": "novol-590", "quantity": 1}'
```

Должен вернуться JSON с данными корзины.

### 5. Проверьте сервер Django

Убедитесь, что сервер запущен:
```bash
cd backend
python manage.py runserver
```

Сервер должен быть доступен на http://127.0.0.1:8000

### 6. Проверьте React приложение

Убедитесь, что React приложение запущено:
```bash
cd frontend
npm start
```

Приложение должно быть доступно на http://localhost:3000

## Возможные ошибки и решения

### Ошибка 401 (Unauthorized)

**Причина:** Неправильный или отсутствующий токен

**Решение:**
1. Выйдите из системы
2. Войдите заново
3. Попробуйте добавить товар снова

### Ошибка 404 (Not Found)

**Причина:** Неправильный URL или товар не найден

**Решение:**
1. Проверьте, что backend запущен
2. Проверьте slug товара
3. Убедитесь, что товар существует в базе данных

### Ошибка 403 (Forbidden)

**Причина:** Нет прав доступа

**Решение:**
1. Проверьте, что вы авторизованы
2. Проверьте, что токен правильный

### Ошибка CORS

**Причина:** Проблемы с Cross-Origin Resource Sharing

**Решение:**
1. Убедитесь, что в backend/shop/settings.py есть:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

2. Убедитесь, что corsheaders установлен:
```bash
pip install django-cors-headers
```

### Товар не отображается в корзине

**Причина:** Корзина не обновляется после добавления

**Решение:**
1. Обновите страницу корзины
2. Проверьте, что товар действительно добавлен через API:
```bash
curl -X GET http://127.0.0.1:8000/api/cart/cart/ \
  -H "Authorization: Token ВАШ_ТОКЕН"
```

## Отладочная информация

### Проверка токена в базе данных

```bash
cd backend
python manage.py shell
```

```python
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()

# Показать все токены
for token in Token.objects.all():
    print(f"User: {token.user.username}, Token: {token.key}")

# Создать токен для пользователя
user = User.objects.get(username='ваше_имя')
token, created = Token.objects.get_or_create(user=user)
print(f"Token: {token.key}")
```

### Проверка корзины в базе данных

```bash
cd backend
python test_cart.py
```

Или через shell:
```python
from cart.models import Cart, CartItem

# Показать все корзины
for cart in Cart.objects.all():
    print(f"User: {cart.user.username}")
    for item in cart.items.all():
        print(f"  - {item.product.name} x {item.quantity}")
```

## Контрольный список

- [ ] Backend сервер запущен (http://127.0.0.1:8000)
- [ ] Frontend приложение запущено (http://localhost:3000)
- [ ] Пользователь авторизован (есть токен в localStorage)
- [ ] Товары отображаются в каталоге
- [ ] Консоль браузера не показывает ошибок
- [ ] CORS настроен правильно
- [ ] Токен существует в базе данных
- [ ] API endpoint доступен (проверено через curl)

## Если ничего не помогло

1. Очистите localStorage:
```javascript
localStorage.clear();
```

2. Перезапустите оба сервера

3. Зарегистрируйте нового пользователя

4. Попробуйте добавить товар снова

5. Проверьте логи Django сервера на наличие ошибок
