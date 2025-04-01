const dataI18n = "data-i18n";
const dataI18nPlaceholder = dataI18n + "-placeholder";
const ET = Object.freeze({
  PASSWORD_WRONG_ERR: "passwordErongErr",
  EMAIL_FORMAT_ERR: "emailFormatErr",
  EMAIL_WRONG_ERR: "emailWrongErr",
  PHONE_FORMAT_ERR: "phoneFormatErr",
  PHONE_WRONG_ERR: "phoneWrongErr",
});


document.getElementById('togglePassword').addEventListener('click', function () {
  togglePasswordVisibility();
});

function togglePasswordVisibility() {
  let lang = localStorage.getItem('language');
  const passwordInput = document.getElementById('passwordInput');
  const togglePasswordElement = document.getElementById('togglePassword');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePasswordElement.setAttribute(dataI18n, 'togglePasswordHide');
  } else {
    passwordInput.type = 'password';
    togglePasswordElement.setAttribute(dataI18n, 'togglePasswordShow');
  }

  setPasswordButtonText(lang);
}

async function setPasswordButtonText(lang) {
  const translations = await loadLanguage(lang);
  const togglePasswordElement = document.getElementById('togglePassword');
  const key = togglePasswordElement.getAttribute(dataI18n);
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

function setupLanguageSelect() {
  const languageSelect = document.getElementById('languageSelect');

  languageSelect.addEventListener('change', (e) => {
    const selectedLang = e.target.value;
    localStorage.setItem('language', selectedLang); // Сохраняем выбранный язык
    applyLanguage(selectedLang);
  });
}

function setupGoogleButton() {
  const googleBtn = document.querySelector('button[data-i18n="continueGoogle"]');
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      window.location.href = "dummy.html";
    });
  }
}

function setupAppleButton() {
  const appleBtn = document.querySelector('button[data-i18n="continueApple"]');
  if (appleBtn) {
    appleBtn.addEventListener("click", () => {
      window.location.href = "dummy.html";
    });
  }
}

document.getElementById('login_form').addEventListener('submit', function (e) {
  const input = e.target.querySelector('input[type="text"]');
  const passwordValue = input.value.trim();
  const emailOrPhoneRegex = /^((\+\d{1,3}\d{7,12})|(8\d{10})|[^@\s]+@[^@\s]+\.[^@\s]+)$/;
  const mockEmail = "pvbazanov@gmail.com";
  const mockPhone = "9523315516";

  if (!emailOrPhoneRegex.test(passwordValue)) {
    e.preventDefault(); // остановить отправку формы
    input.classList.remove('animationPingPongFill'); // сброс, чтобы перезапустить анимацию
    void input.offsetWidth; // триггер перерисовки
    input.classList.add('animationPingPongFill');
  } 
});

async function formError (scope, errorType) {
  let lang = localStorage.getItem('language');
  const translations = await loadLanguage(lang);
  const errorMessage = translations(errorType);
  const errorElement = errorType.split("_"[0]);
  let errorAtr = 'password';

  if (errorElement != "password") {
    errorAtr = 'login'
  }
  
  showErrorMessage(scope.target.querySelector(`[${dataI18n}='${errorAtr}ErrorField]`), errorMessage);
}

function showErrorMessage(scope, errorMessage){
  scope.style.visibility = 'visible';
  scope.innerText = errorMessage;
}
