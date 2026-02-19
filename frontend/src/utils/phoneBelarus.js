/**
 * Формат и валидация белорусского номера: +375 (25|29|33|44) XXXXXXX
 * Коды операторов: 25, 29, 33, 44.
 */

const OPERATOR_CODES = ['25', '29', '33', '44'];
/** Префикс только код страны, без скобки. Скобка в редактируемой части "(XX) XXXXXXX". */
const PREFIX = '+375 ';
const PLACEHOLDER = '+375 (__) _______';

/** Плейсхолдер только для редактируемой части: скобка и код оператора, номер. */
export const EDITABLE_PLACEHOLDER = '(__) _______';

/**
 * Из строки оставляет только цифры.
 * @param {string} value
 * @returns {string}
 */
function digitsOnly(value) {
    if (value == null) return '';
    return String(value).replace(/\D/g, '');
}

/**
 * Форматирует ввод в вид +375 (XX) XXXXXXX.
 * Оставляет только цифры из value и подставляет в шаблон; пустые позиции — подчёркивания.
 * @param {string} value — текущее значение (может быть с маской или только цифры)
 * @returns {string} отформатированная строка для отображения в поле
 */
export function formatPhoneInput(value) {
    const d = digitsOnly(value);
    if (d.length === 0) return '';
    let rest = d;
    if (rest.startsWith('8') && rest.length >= 11) {
        rest = '375' + rest.slice(1, 12);
    } else if (rest.startsWith('375')) {
        rest = rest.slice(0, 12);
    } else if (rest.length <= 9) {
        rest = rest.slice(0, 9);
    } else {
        rest = rest.slice(0, 12);
    }
    const after375 = rest.length <= 3 ? rest : rest.slice(3);
    const operator = after375.slice(0, 2).padEnd(2, '_');
    const number = after375.slice(2, 9).padEnd(7, '_');
    return `${PREFIX}(${operator}) ${number}`;
}

/**
 * Возвращает "чистое" отформатированное значение для отправки на сервер: +375 (XX) XXXXXXX
 * только если номер полный и валидный. Иначе возвращает пустую строку.
 * @param {string} value
 * @returns {{ valid: boolean, formatted: string, error?: string }}
 */
export function validatePhone(value) {
    const d = digitsOnly(value);
    if (d.length === 0) return { valid: true, formatted: '' };
    let digits = d;
    if (digits.startsWith('8') && digits.length === 11) {
        digits = '375' + digits.slice(1);
    } else if (digits.startsWith('375')) {
        digits = digits.slice(0, 12);
    } else if (digits.length === 9) {
        digits = '375' + digits;
    }
    if (digits.length !== 12) {
        return {
            valid: false,
            formatted: '',
            error: 'Введите 9 цифр: код оператора (25, 29, 33, 44) и номер (7 цифр).',
        };
    }
    if (digits.slice(0, 3) !== '375') {
        return { valid: false, formatted: '', error: 'Код страны должен быть 375.' };
    }
    const operator = digits.slice(3, 5);
    if (!OPERATOR_CODES.includes(operator)) {
        return {
            valid: false,
            formatted: '',
            error: 'Код оператора должен быть 25, 29, 33 или 44.',
        };
    }
    const number = digits.slice(5, 12);
    const formatted = `+375 (${operator}) ${number}`;
    return { valid: true, formatted };
}

/**
 * Плейсхолдер для поля телефона (полный, когда нет разделения на префикс).
 */
export function getPhonePlaceholder() {
    return PLACEHOLDER;
}

/**
 * Форматирует только редактируемую часть: 9 цифр в вид "(XX) XXXXXXX".
 * Префикс "+375 " показывается отдельно и не редактируется.
 * @param {string} digits — до 9 цифр (код оператора 2 + номер 7)
 * @returns {string}
 */
export function formatEditablePart(digits) {
    const d = digitsOnly(digits).slice(0, 9);
    if (d.length === 0) return '';
    const operator = d.slice(0, 2).padEnd(2, '_');
    const number = d.slice(2, 9).padEnd(7, '_');
    return `(${operator}) ${number}`;
}

/**
 * Из полного номера "+375 (29) 1234567" возвращает только редактируемую часть "(29) 1234567".
 * @param {string} fullPhone
 * @returns {string}
 */
export function getEditablePartFromFull(fullPhone) {
    if (!fullPhone || typeof fullPhone !== 'string') return '';
    const d = digitsOnly(fullPhone);
    if (d.startsWith('375') && d.length >= 12) {
        const after375 = d.slice(3, 12);
        return formatEditablePart(after375);
    }
    if (d.length >= 9) {
        return formatEditablePart(d.slice(-9));
    }
    return formatEditablePart(d);
}

/**
 * Собирает полный номер из редактируемой части для валидации и отправки.
 * @param {string} editablePart — например "(29) 1234567"
 * @returns {string} "+375 (29) 1234567"
 */
export function getFullPhoneFromEditablePart(editablePart) {
    const d = digitsOnly(editablePart).slice(0, 9);
    if (d.length === 0) return '';
    return PREFIX + formatEditablePart(d);
}

/**
 * Считает, сколько цифр в строке value стоит до позиции pos (для восстановления курсора).
 * @param {string} value — строка вида "(29) 1234567"
 * @param {number} pos — позиция курсора
 * @returns {number} индекс цифры (0–9)
 */
export function countDigitsBeforePosition(value, pos) {
    if (!value || pos <= 0) return 0;
    let count = 0;
    for (let i = 0; i < pos && i < value.length; i++) {
        if (/\d/.test(value[i])) count++;
    }
    return Math.min(count, 9);
}

/**
 * Позиция в отформатированной строке "(XX) XXXXXXX" по индексу цифры (0–9).
 * @param {number} digitIndex
 * @returns {number}
 */
export function digitIndexToFormattedPos(digitIndex) {
    if (digitIndex <= 1) return digitIndex + 1; // после "("
    return digitIndex + 3; // после "(XX) "
}
