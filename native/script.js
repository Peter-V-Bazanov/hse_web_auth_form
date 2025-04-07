const dataI18n = "data-i18n";
const dataI18nPlaceholder = dataI18n + "-placeholder";
const ET = Object.freeze({
  PASSWORD_WRONG: "password_WrongErr",
  PASSWORD_EMTY: "password_EmptyErr",
  PASSWORD_OK: "password_Ok",
  EMAIL_FORMAT: "email_FormatErr",
  EMAIL_WRONG: "email_WrongErr",
  EMAIL_EMPTY: "email_EmptyErr",
  EMAIL_OK: "email_Ok",
  PHONE_FORMAT: "phone_FormatErr",
  PHONE_WRONG: "phone_WrongErr",
  PHONE_EMPTY: "phone_EmptyErr",
  PHONE_OK: "phone_Ok"   
});

// Слушатель кнопки шоу/хайд
document.getElementById('togglePassword').addEventListener('click', function () {
  togglePasswordVisibility();
});

function togglePasswordVisibility() {
  let lang = localStorage.getItem('language');
  const passwordInput = document.getElementById('passwordInput');
  const togglePasswordElement = document.getElementById('togglePassword');

  if (passwordInput.type === 'password') { // инпут тайп пароль означает, что сейчас пароль скрыт точками
    passwordInput.type = 'text'; // Меняем на текст и пароль показывается
    togglePasswordElement.setAttribute(dataI18n, 'togglePasswordHide'); // Меняем атрибут, чтобы устанавливать нужную надпись при переводе страницы
  } else { // Иначе наоборот
    passwordInput.type = 'password';
    togglePasswordElement.setAttribute(dataI18n, 'togglePasswordShow');
  }

  setPasswordButtonText(lang);
}

async function setPasswordButtonText(lang) { // Установка текста на кнопку шоу/хайд
  const translations = await loadLanguage(lang);
  const togglePasswordElement = document.getElementById('togglePassword');
  const key = togglePasswordElement.getAttribute(dataI18n); // Смотрим какую надпись нужно установить (шоу/хайд)
  togglePasswordElement.innerText = translations[key];
}

async function loadLanguage(lang) {
    const response = await fetch(`${lang}.json`);
    return await response.json();
}
 
async function applyLanguage(lang) {
  const translations = await loadLanguage(lang);

  // Заменяем текстовые значения
  document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
          el.innerText = translations[key];
      }
  });

  // Заменяем значения placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[key]) {
          el.placeholder = translations[key];
      }
  });

  // Сохраняем установленный язык в localStorage
  localStorage.setItem('language', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  const languageSelect = document.getElementById('languageSelect');
  const supportedLangs = ['en', 'ru'];

  // Пытаемся получить сохранённый язык из localStorage
  let lang = localStorage.getItem('language');

  // Если язык не сохранён ранее, то определяем язык браузера
  if (!lang) {
      lang = (navigator.language || navigator.userLanguage).slice(0, 2); // "en-GB" "en-US"
      if (!supportedLangs.includes(lang)) {
          lang = 'en'; // Язык по умолчанию
      }
  }

  // Устанавливаем выбранный язык в выпадающем списке
  languageSelect.value = lang;

  // Применяем язык на странице
  applyLanguage(lang);

  // Устанавливаем слушатели
  setupLanguageSelect();
  setupGoogleButton();
  setupAppleButton();
});

function setupLanguageSelect() { // Устанавливаем слушатель на селектор языка
  const languageSelect = document.getElementById('languageSelect');

  languageSelect.addEventListener('change', (e) => {
    const selectedLang = e.target.value;
    localStorage.setItem('language', selectedLang); // Сохраняем выбранный язык
    applyLanguage(selectedLang);
  });
}

function setupGoogleButton() { // Слушатель кнопки гугл
  const googleBtn = document.querySelector('button[data-i18n="continueGoogle"]');
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      window.location.href = "dummy.html";
    });
  }
}

function setupAppleButton() { // Слушатель кнопки эппл
  const appleBtn = document.querySelector('button[data-i18n="continueApple"]');
  if (appleBtn) {
    appleBtn.addEventListener("click", () => {
      window.location.href = "dummy.html";
    });
  }
}

document.getElementById('login_form').addEventListener('submit', function (event) {
  // Получаем элемент поле ввода логина
  const inputLogin = event.target.querySelector(`[${dataI18nPlaceholder}='emailPhone']`);
  const loginValue = inputLogin.value.trim(); // Достаём значение, введённое пользователем
  inputLogin.classList.remove('animationPingPongFill'); // Убираем визаульное выделение поля для актуального отображения

  const inputPassword = event.target.querySelector(`[${dataI18nPlaceholder}='passwordPlaceholder'`)
  const passwordValue = inputPassword.value.trim();
  inputPassword.classList.remove('animationPingPongFill');

  let loginResult = "";
  let passwordResult ="";
  // Определяем тип логина, чтобы отображать точное сообщение об ошибке / проверять форматы
  if (isEmail(loginValue.trim())) {
    loginResult = processEmail(loginValue.trim()); // Проверяем почту
  } else {
    loginResult = processPhoneNumber(loginValue.trim()); // Проверяем телефон
  }

  if ((loginResult === ET.EMAIL_OK) || (loginResult === ET.PHONE_OK)) { // При верном логине проверяем пароль
    passwordResult = processPassword(passwordValue.trim());
    if (passwordResult != ET.PASSWORD_OK) { // Если пароль неверный или пустой, отображаем сообщение об ошибке
      formError(event, inputPassword, passwordResult);
    } else {
      saveLoginData(loginValue, passwordValue);
    }
  } else { // Иначе отображаем сообщение об ошибке в поле логина пользователю
    formError(event, inputLogin, loginResult);
  }
  // На пустое значение пароль проверяем всегда
  if (passwordValue.trim() === "") {
    formError(event, inputPassword, ET.PASSWORD_EMTY);
  }
});

// Обработчик ошибок с формы
function formError (event, element, errorType) {
  event.preventDefault(); // Остановка отправки формы

  const errorPrefix = errorType.split("_")[0]; // Получение префикса ошибки (password/phone/email)
  // phone и email сводятся к login
  let errorAtr = (errorPrefix === 'password') ? 'password' : 'login';

  // Отображение ошибок пользователю
  showErrorMessage(document.getElementById(`${errorAtr}ErrorField`), errorType);
  showErrorAnimation(element);
}

async function showErrorMessage(element, errorType){
  // Подгрузка языкового файла и получение перевода сообщения об ошибке
  let lang = localStorage.getItem('language');
  const translations = await loadLanguage(lang);
  const errorMessage = translations[errorType];
  
  // Отображение сообщения об ошибке
  element.setAttribute(dataI18n, errorType); // Установка атрибута текущей ошибки, чтобы работал перевод
  element.innerText = errorMessage;
  element.style.visibility = 'visible';
}

function showErrorAnimation(element){
  // Сброс класса, чтобы перезапустить анимацию
  element.classList.remove('animationPingPongFill');
  element.classList.add('animationPingPongFill');
}

function isEmail(rawInput) {
  // Если есть буквы, сабака, точка или прочерк, то это не номер телефона
  const regex = /[A-Za-z.@_]/;
  return regex.test(rawInput);
}

function processEmail(emailInput) {
  if (emailInput === "") {
    return ET.EMAIL_EMPTY;
  }

  mockEmail = "chain@ed.up";
  // Протестировал регекс на 36 строках на regex101.com, хотел вставить их куда-нибудь в ридми, но забыл 
  const emailRegex = /^(?!.*\.\.)(?:[A-Za-z]|[A-Za-z](?:[A-Za-z0-9_-]|\.(?!\.))*[A-Za-z0-9])@(?:[A-Za-z0-9]|[A-Za-z0-9](?:[A-Za-z0-9]|\.(?!\.))*[A-Za-z0-9])$/;
  if (!emailRegex.test(emailInput)) {
    return ET.EMAIL_FORMAT;
  } else {
    if (emailInput === mockEmail){
      return ET.EMAIL_OK;
    } else {
      return ET.EMAIL_WRONG;
    }
  }
}

function processPhoneNumber(rawInput) {
  if (rawInput === "") {
    return ET.PHONE_EMPTY;
  }

  // Шаг 1: Удаляем все символы, кроме цифр и знака +
  // Сначала оставляем только цифры и плюс
  let cleanedPhoneNumber = rawInput.replace(/[^\d+]/g, '');
  
  // Если плюс встречается не в начале, удаляем его
  if (cleanedPhoneNumber.charAt(0) === '+') {
    cleanedPhoneNumber = '+' + cleanedPhoneNumber.slice(1).replace(/\+/g, '');
  } else {
    // Если первый символ не '+', то удаляем все плюсы
    cleanedPhoneNumber = cleanedPhoneNumber.replace(/\+/g, '');
  }
  
  // Проверяем соответствие регулярному выражению
  // 11 символов, первый символ 8 или +, далее 10 цифр
  const phoneRegex = /^(?:8|\+)\d{10}$/;
  if (!phoneRegex.test(cleanedPhoneNumber)) {
    return ET.PHONE_FORMAT;
  }
  
  // Удаляем первый символ и сравниваем с мок номером
  cleanedPhoneNumber = cleanedPhoneNumber.slice(1);
  const mockPhoneNumber = "9523315527";
  if (cleanedPhoneNumber === mockPhoneNumber) {
    return ET.PHONE_OK;
  } else {
    return ET.PHONE_WRONG;
  }
}

function processPassword(passwordInput) {
  const mockPassword = "papassword:)"

  if (passwordInput === "") {
    return ET.PASSWORD_EMTY;
  }

  if (passwordInput === mockPassword) {
    return ET.PASSWORD_OK;
  } else {
    return ET.PASSWORD_WRONG;
  }
}

function saveLoginData(loginValue, passwordValue) {
  const chexbox = document.querySelector(`[name='keepLoggedIn']`);
  if (chexbox.checked) {
    localStorage.setItem('keepLoggedIn', 'yes');
    localStorage.setItem('savedLogin', loginValue);
    localStorage.setItem('savedPassword', passwordValue);
  } else {
    localStorage.setItem('keepLoggedIn', 'no');
    localStorage.setItem('savedLogin', '');
    localStorage.setItem('savedPassword', '');
  }
}