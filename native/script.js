const dataI18n = "data-i18n";
const dataI18nPlaceholder = dataI18n + "-placeholder";

document.getElementById('togglePassword').addEventListener('click', function () {
  togglePasswordVisibility(lang);
});

function togglePasswordVisibility(lang) {
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

  // Устанавливаем слушатель изменения выбора языка пользователем
  languageSelect.addEventListener('change', (e) => {
      const selectedLang = e.target.value;
      localStorage.setItem('language', selectedLang); // Сохраняем выбранный язык
      applyLanguage(selectedLang);
  });
});


  