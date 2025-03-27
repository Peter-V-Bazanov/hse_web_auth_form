document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('passwordInput');
    
    // Переключение между типами 'password' и 'text'
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      this.textContent = 'Hide';
    } else {
      passwordInput.type = 'password';
      this.textContent = 'Show';
    }
  });

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

  localStorage.setItem('language', lang);
}



  