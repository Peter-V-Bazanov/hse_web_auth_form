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
 
  