const getOptions = require('./callActions.js') 

// Проверка опций на получение значения null
test('Проверка опций на получение значения null', () => {
    expect(getOptions(null)).toEqual([])
})

// Проверка опций на получение значения пустой массив
test('Проверка опций на получение значения пустой массив', () => {
    expect(getOptions([])).toEqual([])
})

// Проверка опций на получение значения строки
test('Проверка опций на получение значения строки', () => {
    expect(getOptions("test string")).toEqual([])
})

// Проверка опций на получение значения undefined
test('Проверка опций на получение undefined', () => {
    expect(getOptions(undefined)).toEqual([])
})

// Проверка опций на получение значения объекта
test('Проверка опций на получение объекта', () => {
    expect(getOptions({})).toEqual([])
})

// Проверка опций на получение правильного значения
test('Проверка опций на получение объекта', () => {
    expect(getOptions({
        label: 'test',
        value: 0
    })).toEqual([{
        label: 'test',
        value: 0
    }])
})