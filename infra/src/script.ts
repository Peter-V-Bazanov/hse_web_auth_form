interface Translations {
  [key: string]: string;
}

const dataI18n = "data-i18n";
const dataI18nPlaceholder = dataI18n + "-placeholder";

// Коды статусов для валидации логина (email/телефон)
const LoginValidationCodes = {
  EMAIL_FORMAT: "email_FormatErr",
  EMAIL_WRONG: "email_WrongErr",
  EMAIL_EMPTY: "email_EmptyErr",
  EMAIL_OK: "email_Ok",
  PHONE_FORMAT: "phone_FormatErr",
  PHONE_WRONG: "phone_WrongErr",
  PHONE_EMPTY: "phone_EmptyErr",
  PHONE_OK: "phone_Ok"   
} as const;

// Коды статусов для валидации пароля
const PasswordValidationCodes = {
  PASSWORD_WRONG: "password_WrongErr",
  PASSWORD_EMTY: "password_EmptyErr",
  PASSWORD_OK: "password_Ok"
} as const;

type LoginResult = typeof LoginValidationCodes[keyof typeof LoginValidationCodes];
type PasswordResult = typeof PasswordValidationCodes[keyof typeof PasswordValidationCodes];

//Получение DOM элементов
const passwordInputElement = document.getElementById('passwordInput') as HTMLInputElement;
const togglePasswordButton = document.getElementById('togglePassword') as HTMLButtonElement;
const loginForm = document.getElementById('login_form') as HTMLFormElement;
const languageSelect = document.getElementById('languageSelect') as HTMLSelectElement;
const keepLoggedInCheckbox = document.querySelector<HTMLInputElement>('input[name="keepLoggedIn"]');

//Инициализация страницы
export function initializeApp(): void {
  const supportedLangs = ['en', 'ru'];

  // Пытаемся получить сохранённый язык из localStorage
  let lang = localStorage.getItem('language');
  // Если язык не сохранён ранее, то определяем язык браузера
  if (!lang || !supportedLangs.includes(lang)) {
      lang = (navigator.language).slice(0, 2); // "en-GB" "en-US"
      if (!supportedLangs.includes(lang)) {
          lang = 'en'; // Язык по умолчанию
      }
  }

  // Устанавливаем выбранный язык в выпадающем списке
  languageSelect.value = lang;

  // Применяем язык на странице
  applyLanguage(lang);

  // Устанавливаем все слушатели событий
  setupEventListeners();

  // Устанавливаем значения полей логин/пароль, если они сохранены
  if (setKeepLoggedInState()) {
    setInputValues();
  }
};

//Установка слушателей
function setupEventListeners(): void {
  // Слушатель кнопки шоу/хайд
  togglePasswordButton.addEventListener('click', togglePasswordVisibility);
  // Выпадающий список
  languageSelect.addEventListener('change', handleLanguageChange);
  // Кнопки "Продолжить с гугл/эпл"
    const googleBtn = document.querySelector<HTMLButtonElement>('button[data-i18n="continueGoogle"]');
  if (googleBtn) {
    googleBtn.addEventListener("click", () => { window.location.href = "dummy.html"; });
  }

  const appleBtn = document.querySelector<HTMLButtonElement>('button[data-i18n="continueApple"]');
  if (appleBtn) {
    appleBtn.addEventListener("click", () => { window.location.href = "dummy.html"; });
  }

  // Отправка формы входа
  loginForm.addEventListener('submit', handleFormSubmit);
}

/**
 * Обработчики событий
 */
// Переключение видимости пароля
function togglePasswordVisibility(): void {
  const lang = localStorage.getItem('language') || 'en';
  
  if (passwordInputElement.type === 'password') { // инпут тайп пароль означает, что сейчас пароль скрыт точками
    passwordInputElement.type = 'text'; // Меняем на текст и пароль показывается
    togglePasswordButton.setAttribute(dataI18n, 'togglePasswordHide'); // Меняем атрибут, чтобы устанавливать нужную надпись при переводе страницы
  } else { // Иначе наоборот
    passwordInputElement.type = 'password';
    togglePasswordButton.setAttribute(dataI18n, 'togglePasswordShow');
  }

  setPasswordButtonText(lang);
}

function handleLanguageChange(event: Event): void {
  const selectedLang = (event.target as HTMLSelectElement).value;
  applyLanguage(selectedLang);
}

async function loadLanguage(lang: string): Promise<Translations> {
    const response = await fetch(`${lang}.json`);
    return await response.json();
}
 
async function applyLanguage(lang: string): Promise<void> {
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

if (loginForm){
  loginForm.addEventListener('submit', function (event) {
    // Получаем элемент поле ввода логина
    const inputLogin = event.target.querySelector(`[${dataI18nPlaceholder}='emailPhone']`);
    const loginValue = inputLogin.value.trim(); // Достаём значение, введённое пользователем
    inputLogin.classList.remove('animationPingPongFill'); // Убираем визаульное выделение поля для актуального отображения

    const inputPassword = event.target.querySelector(`[${dataI18nPlaceholder}='passwordPlaceholder']`)
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
}

// Обработчик ошибок с формы
function formError (event: SubmitEvent, element: HTMLElement, errorType: LoginResult | PasswordResult) {
  event.preventDefault(); // Остановка отправки формы

  const errorPrefix = errorType.split("_")[0]; // Получение префикса ошибки (password/phone/email)
  // phone и email сводятся к login
  let errorAtr = (errorPrefix === 'password') ? 'password' : 'login';

  // Отображение ошибок пользователю
  showErrorMessage(document.getElementById(`${errorAtr}ErrorField`), errorType);
  showErrorAnimation(element);
}

async function showErrorMessage(element: HTMLElement, errorType: LoginResult | PasswordResult): Promise<void>{
  // Подгрузка языкового файла и получение перевода сообщения об ошибке
  let lang = localStorage.getItem('language');
  const translations = await loadLanguage(lang);
  const errorMessage = translations[errorType];
  
  // Отображение сообщения об ошибке
  element.setAttribute(dataI18n, errorType); // Установка атрибута текущей ошибки, чтобы работал перевод
  element.innerText = errorMessage;
  element.style.visibility = 'visible';
}

function showErrorAnimation(element: HTMLElement){
  // Сброс класса, чтобы перезапустить анимацию
  element.classList.remove('animationPingPongFill');
  element.classList.add('animationPingPongFill');
}

function isEmail(rawInput: string): boolean {
  // Если есть буквы, сабака, точка или прочерк, то это не номер телефона
  const regex = /[A-Za-z.@_]/;
  return regex.test(rawInput);
}

function processEmail(emailInput: string): LoginResult {
  if (emailInput === "") {
    return ET.EMAIL_EMPTY;
  }

  const mockEmail = "chain@ed.up";
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

function processPhoneNumber(rawInput: string): LoginResult {
  if (rawInput === "") {
    return ET.PHONE_EMPTY;
  }
  let plus = false;

  // Шаг 1: Удаляем все символы, кроме цифр и знака +
  // Сначала оставляем только цифры и плюс
  let cleanedPhoneNumber = rawInput.replace(/[^\d+]/g, '');
  
  // Если плюс встречается не в начале, удаляем его
  if (cleanedPhoneNumber.charAt(0) === '+') {
    plus = true;
    cleanedPhoneNumber = '+' + cleanedPhoneNumber.slice(1).replace(/\+/g, '');
  } else {
    // Если первый символ не '+', то удаляем все плюсы
    cleanedPhoneNumber = cleanedPhoneNumber.replace(/\+/g, '');
  }
  
  // Проверяем соответствие регулярному выражению
  // 11 символов, первый символ 8 или +, далее 10 цифр
  const phoneRegex = /^(?:8|\+7)\d{10}$/;
  if (!phoneRegex.test(cleanedPhoneNumber)) {
    return ET.PHONE_FORMAT;
  }
  
  // Удаляем первый символ и сравниваем с мок номером
  cleanedPhoneNumber = plus ? cleanedPhoneNumber.slice(2) : cleanedPhoneNumber.slice(1); 
  const mockPhoneNumber = "9523315527";
  if (cleanedPhoneNumber === mockPhoneNumber) {
    return ET.PHONE_OK;
  } else {
    return ET.PHONE_WRONG;
  }
}

function processPassword(passwordInput: string): PasswordResult {
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

function saveLoginData(loginValue: string, passwordValue: string) {
  if (keepLoggedInCheckbox.checked) {
    localStorage.setItem('keepLoggedIn', 'yes');
    localStorage.setItem('savedLogin', loginValue);
    localStorage.setItem('savedPassword', passwordValue);
  } else {
    localStorage.setItem('keepLoggedIn', 'no');
    localStorage.setItem('savedLogin', '');
    localStorage.setItem('savedPassword', '');
  }
}

function setKeepLoggedInState() {
  let keepLoggedInState = localStorage.getItem('keepLoggedIn');
  if (keepLoggedInState === 'yes') {
    keepLoggedInCheckbox.checked = true;
  } else {
    keepLoggedInCheckbox.checked = false;
  }
  return keepLoggedInCheckbox.checked;
}

function setInputValues() {
  const inputLogin = document.querySelector(`[${dataI18nPlaceholder}='emailPhone']`) as HTMLInputElement;
  //const inputPassword = document.querySelector(`[${dataI18nPlaceholder}='passwordPlaceholder'`) as HTMLLabelElement;
  const loginValue = localStorage.getItem('savedLogin');
  const passwordValue = localStorage.getItem('savedPassword');
  if(inputLogin && loginValue) {
    inputLogin.value = loginValue;
  }
  if (passwordValue){
    passwordInputElement.value = passwordValue;
  }
}

/**
 * Управление отображением
 */

// Установка текста на кнопке "показать/скрыть" (пароль)
async function setPasswordButtonText(lang: string): Promise<void> { // Установка текста на кнопку шоу/хайд
  const translations = await loadLanguage(lang);
  const key = togglePasswordButton.getAttribute(dataI18n); // Смотрим какую надпись нужно установить (шоу/хайд)
  if (key){
    togglePasswordButton.innerText = translations[key];
  }
}