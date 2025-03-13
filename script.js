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
  