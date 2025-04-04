## «Нативные» технологии (27+ баллов)
Сайт можно открыть [**здесь**](https://peter-v-bazanov.github.io/hse_web_auth_form/native/index.html "пипипупу").
### HTML (10 баллов)
Используя технологии HTML, разработайте форму авторизации, содержащую:
- [x] (+1Б) «Шапку» и «подвал» страницы
- [x] (+4/4Б) Форму логина, состоящую из: 
    - [x] (+1Б) Кнопок входа через соцсети;
    - [x] (+1Б) Полей для логина и пароля;
    - [x] (+1Б) Галочки «сохранять сессию»;
    - [x] (+1Б) Кнопки входа;
- [x] (+1Б) Использовать семантические теги; *Использованы:*
    - *\<footer\>*
    - *\<header\>*
    - *\<main\>*
    - *\<fieldset\>*
- [x] (+3Б) Сделать форму доступной для людей с ограниченными возможностями (accessibility)
    - [x] ❓Объяснить как сделали❓
    - *При наведении курсора на любой интерактивный элемент меняется оттенок его фона, а также форма курсора;*
    - *Сделал русскоязычную версию, Windows Narrator кое-как читает элементы;*
- [x] (+4Б) ❓Обосновать использование подхода к верстке (блочная, flex, grid)❓:
    - *Для данного проекта Flexbox оптимален:*
    - *Он упрощает вертикальную структуру (header–main–footer) и выравнивание по центру;*
    - *Он позволяет управлять отступами и позиционированием без ручной подгонки;*
    - *Grid для этой страницы - оверкилл, поскольку здесь нет сложной сетки. Все элементы в main расположены вертикльно;*

### CSS (8+ баллов)
- [x] (+1Б) Улучшить стили, не использовать стили нативных HTML-элементов (переопределить стили для всех заголовков, текста, контролов);
- [x] (+1Б) Добавить transition-анимацию на поля ввода/кнопки (примеры: подсветка некорректного ввода, загрузка после нажатия конпки “логин”, переливающийся градиент блока);
- [x] (+1Б) Добавить keyframe-анимацию; Примеры:
    - Анимация фона окна;
    - Загрузка кнопки;
    - “Сворачивание” окна;
    - “Дрожащий” инпут на неверный ввод;
- [ ]  (+4Б) Использовать media queries для адаптивной вёрстки;
    - [ ] ❓объяснить выбор брейкпоинтов❓
- [ ]  (+0/5Б)При работе со стилями использовать:
    - [x] (+1Б) Селектор по классу;
    - [ ] (+1Б) Селектор по атрибуту;
    - [ ] (+1Б) Селектор по идентификатору;
    - [x] (+1Б) Селектор по тегу;
    - [x] (+1Б) 3-4 псевдоселектора по классу;
- [ ] (+999Б) Повеселиться и добавить снежинки/конфетти на фон, пасхалку и т.п;

### JS (9+ баллов)
- [ ] (+1Б) Использовать js для валидации полей ввода — установить ограничения пароля, почты или телефона;
- [ ] (+1Б) Использовать js для условного вывода сообщений пользователю;
- [ ] (+1Б) Использовать js для проверки правильности введённых данных (захардкодить верную комбинацию данных и сравнить ввод);
- [ ]  (+4Б) Использовать js для сохранения введённых данных, их последующего отображения  ❓объяснить почему выбрали тот или иной способ хранения данных, помним, что это пара логин-пароль❓
- [x] (+1Б) Использовать обработчики событий;
- [ ] (+1Б) Использовать стрелочные и именованные функции ❓поделиться, какие больше понравились, почему?❓
- [ ]  (+999Б) Повеселиться и добавить снежинки/конфетти на фон, пасхалку и т.п;
