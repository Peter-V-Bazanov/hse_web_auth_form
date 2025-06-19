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

/*
  -= ОБРАБОТЧИКИ СОБЫТИЙ =-
*/

/**
 * Переключение видимости пароля.
 */
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
/**
 * Обработка смены языка.
 * @param event Событие.
 */
function handleLanguageChange(event: Event): void {
  const selectedLang = (event.target as HTMLSelectElement).value;
  applyLanguage(selectedLang);
}
/**
 * Обработка отправки формы.
 * @param event  Событие отправки формы.
 */
function handleFormSubmit(event: SubmitEvent): void {
  event.preventDefault();

  // Получаем элемент поле ввода логина
  const inputLogin = loginForm.querySelector<HTMLInputElement>(`[${dataI18nPlaceholder}='emailPhone']`);
  
  if (!inputLogin || !passwordInputElement) {
    console.error("Не найдены поля для логина или пароля!");
    return;
  }

  const loginValue = inputLogin.value.trim(); // Достаём значение, введённое пользователем
  const passwordValue = passwordInputElement.value.trim();

  inputLogin.classList.remove('animationPingPongFill'); // Убираем визаульное выделение поля для актуального отображения
  passwordInputElement.classList.remove('animationPingPongFill');

  // Валидация логина и пароля
  const loginResult = isEmail(loginValue) ? processEmail(loginValue) : processPhoneNumber(loginValue);

  if ((loginResult === LoginValidationCodes.EMAIL_OK) || (loginResult === LoginValidationCodes.PHONE_OK)) { // Если логин верный проверяем пароль
    const passwordResult = processPassword(passwordValue.trim());
    if (passwordResult === PasswordValidationCodes.PASSWORD_OK) { // Если пароль верный
      saveLoginData(loginValue, passwordValue);
      loginForm.submit();
    } else {
      formError(passwordInputElement, passwordResult);
    }
  } else { // Если логин неверный/некорректный — сообщаем пользователю
    formError(inputLogin, loginResult);
  }

  // На пустое значение пароль проверяем всегда
  if (passwordValue.trim() === "") {
    formError(passwordInputElement, PasswordValidationCodes.PASSWORD_EMTY);
  }
};

/*
  -= ФУНКЦИИ ВАЛИДАЦИИ И ОБРАБОТКИ ДАННЫХ =-
*/
/**
 * Проверяет, похож ли ввод на email.
 * @param rawInput Строка для проверки.
 * @returns True/False.
 */
function isEmail(rawInput: string): boolean {
  // Если есть буквы, собака, точка или прочерк, то это не номер телефона
  const regex = /[A-Za-z.@_]/;
  return regex.test(rawInput);
}

/**
 * Валидирует email.
 * @param emailInput Email для проверки.
 * @returns Код результата проверки.
 */
function processEmail(emailInput: string): LoginResult {
  if (emailInput === "") return LoginValidationCodes.EMAIL_EMPTY;

  const mockEmail = "chain@ed.up";
  // Протестировал регекс на 36 строках на regex101.com, хотел вставить их куда-нибудь в ридми, но забыл 
  const emailRegex = /^(?!.*\.\.)(?:[A-Za-z]|[A-Za-z](?:[A-Za-z0-9_-]|\.(?!\.))*[A-Za-z0-9])@(?:[A-Za-z0-9]|[A-Za-z0-9](?:[A-Za-z0-9]|\.(?!\.))*[A-Za-z0-9])$/;

  if (!emailRegex.test(emailInput)) return LoginValidationCodes.EMAIL_FORMAT;
  return emailInput === mockEmail ? LoginValidationCodes.EMAIL_OK : LoginValidationCodes.EMAIL_WRONG;
}

/**
 * Валидирует номер телефона.
 * @param rawInput Номер телефона для проверки.
 * @returns Код результата проверки.
 */
function processPhoneNumber(rawInput: string): LoginResult {
  if (rawInput === "") return LoginValidationCodes.PHONE_EMPTY;

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
    return LoginValidationCodes.PHONE_FORMAT;
  }
  
  // Удаляем первый символ и сравниваем с мок номером
  cleanedPhoneNumber = plus ? cleanedPhoneNumber.slice(2) : cleanedPhoneNumber.slice(1); 
  const mockPhoneNumber = "9523315527";
  if (cleanedPhoneNumber === mockPhoneNumber) {
    return LoginValidationCodes.PHONE_OK;
  } else {
    return LoginValidationCodes.PHONE_WRONG;
  }
}

/**
 * Валидирует пароль.
 * @param passwordInput Строка для проверки.
 * @returns Код результата проверки.
 */
function processPassword(passwordInput: string): PasswordResult {
  if (passwordInput === "") return PasswordValidationCodes.PASSWORD_EMTY;
  const mockPassword = "papassword:)"
  return passwordInput === mockPassword ? PasswordValidationCodes.PASSWORD_OK : PasswordValidationCodes.PASSWORD_WRONG
}

/*
  -= УПРАВЛЕНИЕ ОТОБРАЖЕНИЕМ =-
*/

/**
 * Определяет элемент для отображения ошибки и запускает анимацию.
 */
function formError (element: HTMLElement, errorType: LoginResult | PasswordResult) {
  const errorPrefix = errorType.split("_")[0]; // Получение префикса ошибки (password/phone/email)
  // phone и email сводятся к login
  const errorAtr = (errorPrefix === 'password') ? 'password' : 'login';
  const errorField = document.getElementById(`${errorAtr}ErrorField`)

  // Отображение ошибок пользователю
  if (errorField) {
    showErrorMessage(errorField, errorType);
  }
  showErrorAnimation(element);
}

/**
 * Отображает сообщение об ошибке на нужном языке.
 * @param element Элемент, в котором отображается ошибка.
 * @param errorType Тип ошибки.
 */
async function showErrorMessage(element: HTMLElement, errorType: LoginResult | PasswordResult): Promise<void>{
  // Подгрузка языкового файла и получение перевода сообщения об ошибке
  const lang = localStorage.getItem('language') || 'en';
  const translations = await loadLanguage(lang);
  const errorMessage = translations[errorType];
  
  // Отображение сообщения об ошибке
  element.setAttribute(dataI18n, errorType); // Установка атрибута текущей ошибки, чтобы работал перевод
  element.innerText = errorMessage;
  element.style.visibility = 'visible';
}

/**
 * Устанавливает анимацию ошибки на нужный элемент.
 * @param element Анимируемый элемент.
 */
function showErrorAnimation(element: HTMLElement){
  // Сброс класса, чтобы перезапустить анимацию
  element.classList.remove('animationPingPongFill');
  element.classList.add('animationPingPongFill');
}

/**
 * Устанавливает текст на кнопке "показать/скрыть" (пароль) на нужном языке.
 * @param lang Нужный язык.
 */
async function setPasswordButtonText(lang: string): Promise<void> {
  const translations = await loadLanguage(lang);
  const key = togglePasswordButton.getAttribute(dataI18n); // Смотрим какую надпись нужно установить (шоу/хайд)
  if (key){
    togglePasswordButton.innerText = translations[key];
  }
}

/**
  -= ☭ ИНТЕРНАЦИОНАЛИЗАЦИЯ ☭ =-
 */

/**
 * Загрузка языкового файла.
 * @param lang Код языка, который нужно загрузить (напр. 'ru').
 * @returns Словарь со значениями на нужном языке для всех элементов интерфейса.
 */
async function loadLanguage(lang: string): Promise<Translations> {
    const response = await fetch(`./${lang}.json`);
    return await response.json();
}
 
/**
 * Применяет переводы ко всем элементам на странице.
 * @param lang Язык.
 */
async function applyLanguage(lang: string): Promise<void> {
  const translations = await loadLanguage(lang);

  // Заменяем текстовые значения
  document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && translations[key] && el instanceof HTMLElement) {
          el.innerText = translations[key];
      }
  });

  // Заменяем значения placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && translations[key] && el instanceof HTMLInputElement) {
          el.placeholder = translations[key];
      }
  });

  // Обновляем текст на кнопке "показать/скрыть" (пароль)
  setPasswordButtonText(lang);

  // Сохраняем установленный язык в localStorage
  localStorage.setItem('language', lang);
}

/**
  -= УПРАВЛЕНИЕ localStorage =-
*/

/**
 * Сохраняет данные для входа, если стоит галочка "Запомнить меня".
 * @param loginValue Логин для записис в память.
 * @param passwordValue Пароль для записис в память.
 */
function saveLoginData(loginValue: string, passwordValue: string) {
  if (keepLoggedInCheckbox?.checked) {
    localStorage.setItem('keepLoggedIn', 'yes');
    localStorage.setItem('savedLogin', loginValue);
    localStorage.setItem('savedPassword', passwordValue);
  } else {
    localStorage.setItem('keepLoggedIn', 'no');
    localStorage.setItem('savedLogin', '');
    localStorage.setItem('savedPassword', '');
  }
}

/**
 * Устанавливает состояние галочки "Запомнить меня" при загрузке страницы.
 * @returns Состояние чекбокса.
 */
function setKeepLoggedInState(): boolean {
  if (!keepLoggedInCheckbox) return false;
  const keepLoggedInState = localStorage.getItem('keepLoggedIn');
  keepLoggedInCheckbox.checked = keepLoggedInState === 'yes'
  return keepLoggedInCheckbox.checked;
}

/**
 * Подставляет сохраненные логин и пароль в поля ввода.
 */
function setInputValues(): void {
  const inputLogin = document.querySelector(`[${dataI18nPlaceholder}='emailPhone']`) as HTMLInputElement;
  const loginValue = localStorage.getItem('savedLogin');
  const passwordValue = localStorage.getItem('savedPassword');

  if(inputLogin && loginValue) {
    inputLogin.value = loginValue;
  }
  if (passwordValue){
    passwordInputElement.value = passwordValue;
  }
}

