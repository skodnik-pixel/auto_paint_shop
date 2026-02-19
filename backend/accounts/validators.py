# Валидация белорусского номера: +375 (25|29|33|44) XXXXXXX (7 цифр)

BELARUS_OPERATOR_CODES = ('25', '29', '33', '44')


def normalize_phone_belarus(phone):
    """
    Проверяет и нормализует номер телефона Беларуси.
    Допустимый формат: +375 (25|29|33|44) и 7 цифр номера.
    Возвращает: (нормализованная строка в формате +375 (XX) XXXXXXX, None) при успехе,
    (None, сообщение об ошибке) при неверном формате.
    Пустая строка считается валидной (телефон не указан).
    """
    if not phone or not isinstance(phone, str):
        return (None, None)  # пусто — ок
    raw = phone.strip()
    if not raw:
        return (None, None)
    digits = ''.join(c for c in raw if c.isdigit())
    if not digits:
        return (None, 'В номере должны быть только цифры.')
    if digits.startswith('8') and len(digits) == 11:
        digits = '375' + digits[1:]
    elif digits.startswith('375'):
        pass
    else:
        if len(digits) == 9:
            digits = '375' + digits
        else:
            return (None, 'Неверный формат. Введите номер в формате +375 (25) 1234567. Коды операторов: 25, 29, 33, 44.')
    if len(digits) != 12:
        return (None, 'Номер должен содержать 9 цифр после +375 (код оператора 2 цифры + 7 цифр номера).')
    if digits[:3] != '375':
        return (None, 'Код страны должен быть 375 (Беларусь).')
    operator = digits[3:5]
    if operator not in BELARUS_OPERATOR_CODES:
        return (None, 'Неверный код оператора. Допустимы: 25, 29, 33, 44.')
    number_part = digits[5:12]
    formatted = f'+375 ({operator}) {number_part}'
    return (formatted, None)
