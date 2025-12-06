# Исправление корзины

## Дата: 6 декабря 2025

## Найденные проблемы

### 1. Неправильная авторизация в Cart.js
**Проблема:** Использовался `Bearer` вместо `Token`
```javascript
// ❌ Было
'Authorization': `Bearer ${token}`

// ✅ Стало
'Authorization': `Token ${token}`
```

### 2. Неправильные endpoints в Cart.js
**Проблема:** Отсутствовал `/cart/` в пути
```javascript
// ❌ Было
fetch(`${apiUrl}/cart/`)

// ✅ Стало
fetch(`${apiUrl}/cart/cart/`)
```

### 3. Backend не поддерживал product_slug
**Проблема:** `add_item` в `cart/views.py` принимал только `product_id`, но фронтенд отправлял `product_slug`

**Решение:** Добавлена поддержка обоих параметров

## Исправленные файлы

### backend/cart/views.py
- ✅ Добавлена поддержка `product_slug` в методе `add_item`
- ✅ Добавлена обработка ошибок (товар не найден)
- ✅ Улучшена логика создания/обновления количества товара

### frontend/src/components/Cart.js
- ✅ Изменена авторизация с `Bearer` на `Token`
- ✅ Исправлены все endpoints: `/cart/` → `/cart/cart/`
- ✅ Исправлены endpoints для обновления и удаления товаров

### frontend/src/components/Catalog.js
- ✅ Добавлена кнопка "В корзину"
- ✅ Добавлена индикация загрузки при добавлении
- ✅ Правильная авторизация через `Token`
- ✅ Использование `product_slug`

### frontend/src/components/ProductDetail.js
- ✅ Исправлен endpoint для добавления в корзину
- ✅ Правильная авторизация через `Token`
- ✅ Использование `product_slug`

## Как работает корзина

### 1. Добавление товара в корзину

**Endpoint:** `POST /api/cart/cart/add_item/`

**Заголовки:**
```
Content-Type: application/json
Authorization: Token <ваш_токен>
```

**Тело запроса:**
```json
{
  "product_slug": "3m-51815-fast-cut-plus-extreme-polirovalnaya-pasta",
  "quantity": 1
}
```

**Или:**
```json
{
  "product_id": 15,
  "quantity": 1
}
```

### 2. Получение корзины

**Endpoint:** `GET /api/cart/cart/`

**Заголовки:**
```
Authorization: Token <ваш_токен>
```

**Ответ:**
```json
[
  {
    "id": 1,
    "user": 1,
    "items": [
      {
        "id": 1,
        "product": {
          "id": 15,
          "name": "3М",
          "slug": "3m-51815-fast-cut-plus-extreme-polirovalnaya-pasta",
          "price": "25.00",
          "stock": 10
        },
        "quantity": 2
      }
    ],
    "total_price": "50.00"
  }
]
```

### 3. Обновление количества товара

**Endpoint:** `PATCH /api/cart/cart/{cart_id}/`

**Заголовки:**
```
Content-Type: application/json
Authorization: Token <ваш_токен>
```

**Тело запроса:**
```json
{
  "items": [
    {
      "id": 1,
      "quantity": 3
    }
  ]
}
```

### 4. Удаление товара из корзины

**Endpoint:** `PATCH /api/cart/cart/{cart_id}/`

**Заголовки:**
```
Content-Type: application/json
Authorization: Token <ваш_токен>
```

**Тело запроса:**
```json
{
  "items": [
    {
      "id": 1,
      "quantity": 0
    }
  ]
}
```

## Тестирование

### 1. Проверка добавления товара
```bash
# Получите токен после входа
TOKEN="ваш_токен"

# Добавьте товар в корзину
curl -X POST http://127.0.0.1:8000/api/cart/cart/add_item/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token $TOKEN" \
  -d '{"product_slug": "3m", "quantity": 1}'
```

### 2. Проверка получения корзины
```bash
curl -X GET http://127.0.0.1:8000/api/cart/cart/ \
  -H "Authorization: Token $TOKEN"
```

### 3. Проверка обновления количества
```bash
curl -X PATCH http://127.0.0.1:8000/api/cart/cart/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token $TOKEN" \
  -d '{"items": [{"id": 1, "quantity": 5}]}'
```

## Возможные ошибки и решения

### Ошибка: "Товар не найден"
**Причина:** Неправильный `product_slug` или товар не существует
**Решение:** Проверьте slug товара в базе данных

### Ошибка: "Необходимо войти в систему"
**Причина:** Отсутствует или неправильный токен
**Решение:** Войдите в систему и получите новый токен

### Ошибка: "Failed to fetch cart"
**Причина:** Неправильный endpoint или токен
**Решение:** Убедитесь, что используется `/api/cart/cart/` и `Token` авторизация

### Корзина пустая после добавления товара
**Причина:** Товар добавляется, но страница не обновляется
**Решение:** Обновите страницу или добавьте автоматическое обновление после добавления

## Рекомендации для улучшения

1. **Добавить счетчик товаров в корзине** в Navbar
2. **Добавить автоматическое обновление корзины** после добавления товара
3. **Добавить уведомления** вместо alert()
4. **Добавить анимации** при добавлении/удалении товаров
5. **Добавить проверку наличия товара** перед добавлением в корзину
