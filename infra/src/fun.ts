// Функция, которая создаёт один элемент серпа и молота:
function createFallingItem() {
  const container = document.getElementById('fallingContainer');

  // Создаём снежинку
  const item = document.createElement('span');
  item.textContent = '☭'; 
  item.classList.add('falling-item');

  // Случайная горизонтальная позиция
  const randomLeft = Math.random() * 100; 
  item.style.left = randomLeft + 'vw';

  // Случайный размер шрифта
  const randomSize = Math.floor(Math.random() * 20) + 20; // от 20px до 40px
  item.style.fontSize = randomSize + 'px';

  // Случайная длительность падения
  const randomDuration = Math.floor(Math.random() * 5) + 5; // от 5 до 10 секунд
  item.style.animationDuration = randomDuration + 's';

  // Добавляем снежинку в контейнер
  container.appendChild(item);

  // По окончании анимации удаляем элемент
  item.addEventListener('animationend', () => {
    item.remove();
  });
}

// Запускаем снежинки раз в n миллисекунд
function startFalling() {
  setInterval(() => {
    createFallingItem();
  }, 200);
}

document.addEventListener('DOMContentLoaded', () => {
  startFalling();
});
  