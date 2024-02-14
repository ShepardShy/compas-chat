// Получение опций
const getOptions = (options) => {
    // Проверка на пустой объект
    const isEmpty = (obj) => {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
    }

    // Установка опций
    const setOptions = (options) => {
        if (![null, undefined].includes(options) || typeof options != 'object' || !Array.isArray(options)) {
            return []
        } else {
            return options.filter(p => p != null && typeof p == 'object' && !Array.isArray(p) && !isEmpty(p)).sort((prev, next) => prev.label.sort - next.label.sort)
        }
    }

    let localOptions = setOptions(options)
    console.log(localOptions);
    return JSON.parse(JSON.stringify(localOptions))
}

module.exports = getOptions

    // // Действия с автокомплитом
    // const callAction = (data) => {


    //     // Создание опции
    //     const createOption = () => {
    //         PopupScripts.hideDetails(popupRef.value.popupRef)
    //         emit('createOption', {
    //             key: props.item.key,
    //             value: true
    //         })
    //     }

    //     // Установка выбранной опции
    //     const setActiveOption = (value) => {
    //         search.value = ''
    //         let findedOption = options.value == null ? null : options.value.find(option => option.value == value)
    //         if ([null, undefined].includes(findedOption)) {
    //             activeOption.value = nullOption 
    //         } else {
    //             activeOption.value = findedOption.label
    //         }
    //     }

    //     // Поиск опций
    //     const searchOptions = (value) => {
    //         search.value = value
    //         emit('searchOptions', {key: props.item.key, value: search.value})
    //     }

    //     // Изменить значение поля
    //     const changeValue = (value) => {
    //         if (value == null || (![null, undefined].includes(props.item.lockedOptions) && !props.item.lockedOptions.includes(value))) {
    //             search.value = null
    //             options.value = backupOptions.value
    //             setActiveOption(value)
    //             PopupScripts.hideDetails(popupRef.value.popupRef)
    //             emit('changeValue', {
    //                 key: props.item.key,
    //                 value: value
    //             })
    //         }
    //     }

    //     switch (data.action) {
    //         // Создание опции
    //         case 'createOption':
    //             createOption()
    //             break;

    //         // Установка выбранной опции
    //         case 'setActiveOption':
    //             setActiveOption(data.value)
    //             break;

    //         // Поиск опций
    //         case 'searchOptions':
    //             searchOptions(data.value)
    //             break;

    //         // Изменить значение поля
    //         case 'changeValue':
    //             changeValue(data.value)
    //             break;

    //         // Получение опций
    //         case 'getOptions': 
    //             getOptions()
    //             break;
    //         default:
    //             break;
    //     }
    // }
