// Функция, которая показывает ошибку
const showInputError = (formElement, inputElement, errorMessage, config) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
};

// Функция, которая скрывает ошибку
const hideInputError = (formElement, inputElement, config) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.classList.remove(config.errorClass);
    errorElement.textContent = '';
};

// Функция проверки валидности поля
const checkInputValidity = (formElement, inputElement, config) => {
    if (inputElement.validity.patternMismatch) {
        // Если поле не прошло проверку регулярным выражением, используем кастомное сообщение
        inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
        // В противном случае сбрасываем кастомное сообщение
        inputElement.setCustomValidity('');
    }

    if (!inputElement.validity.valid) {
        showInputError(
            formElement,
            inputElement,
            inputElement.validationMessage,
            config
        );
    } else {
        hideInputError(formElement, inputElement, config);
    }
};

// Функция проверки, есть ли невалидные поля
const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    });
};

// Функция блокировки кнопки отправки
const disableSubmitButton = (buttonElement, config) => {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
};

// Функция разблокировки кнопки отправки
const enableSubmitButton = (buttonElement, config) => {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
};

// Функция переключения состояния кнопки отправки
const toggleButtonState = (inputList, buttonElement, config) => {
    if (hasInvalidInput(inputList)) {
        disableSubmitButton(buttonElement, config);
    } else {
        enableSubmitButton(buttonElement, config);
    }
};

// Функция установки слушателей событий
const setEventListeners = (formElement, config) => {
    const inputList = Array.from(
        formElement.querySelectorAll(config.inputSelector)
    );
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    // Инициализируем состояние кнопки при загрузке (если нужно, но обычно они уже disabled)
    toggleButtonState(inputList, buttonElement, config);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            checkInputValidity(formElement, inputElement, config);
            toggleButtonState(inputList, buttonElement, config);
        });
    });
};

// Функция включения валидации
export const enableValidation = (config) => {
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    formList.forEach((formElement) => {
        // Отключаем нативную валидацию, так как у нас своя
        // (мы это уже сделали через novalidate в HTML, но можно и тут)
        // formElement.addEventListener('submit', (evt) => {
        //   evt.preventDefault(); // Это обычно делается в обработчиках сабмита в index.js
        // });
        setEventListeners(formElement, config);
    });
};

// Функция очистки валидации (экспортируемая)
export const clearValidation = (formElement, config) => {
    const inputList = Array.from(
        formElement.querySelectorAll(config.inputSelector)
    );
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    // Очищаем ошибки полей
    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, config);
        inputElement.setCustomValidity(''); // Сбрасываем кастомные ошибки, если были
    });

    // Делаем кнопку неактивной
    disableSubmitButton(buttonElement, config);
};
