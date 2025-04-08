## «Нативные» технологии (27+ баллов)
Сайт можно открыть [**здесь**](https://peter-v-bazanov.github.io/hse_web_auth_form/native/index.html "пипипупу").

<table>
  <tr>
    <td>Мок почта</td>
    <td>chain@ed.up</td>
  </tr>
  <tr>
    <td>Мок телефон</td>
    <td>89523315527</td>
  </tr>
  <tr>
    <td>Мок пароль</td>
    <td>papassword:)</td>
  </tr>
</table>

### HTML (10+ баллов)
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
    - *Все текстовые элементы соответствует стандартам WCAG AA для доступного текста;*
    - *Инспектор поддержки доступности в Firefox ругается на то, что у полей ввода логина и пароля нету \<label\>, но их нету в нашем референсе, поэтому я их не добавляю;*
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
- [x]  (+4Б) Использовать media queries для адаптивной вёрстки;
    - [x] ❓объяснить выбор брейкпоинтов❓
    - *Сделал адаптивный футер (ссылки сворачиваются в выпадающий список). Брейкпоинт - 78rem (78\*16px), потому что в меньшую ширину раскрытый футер (на русском) не влезает;*
    - *Сделал адаптивную card (в ней весь основной контент). Брейкпоинт - 40rem (40*16x), потому что так рекомендует дока tailwinds (наверно умные люди), также проверил на своём телефоне (galaxy a34) - работает. При изменении размера окна на десктопном браузере тоже работает;*
    - *Футер на телефоне тоже отображается корректно (ссылки сворачиваются в выпадающий список). При изменении размера окна на десктопном браузере тоже;*
    - *Почему 1rem - это 16px: так рекомендует дока tailwinds (наверно умные люди)(если я правильно понял);*
    - *Пока что rem больше нигде не используются, потому что об адаптивности я задумался поздно. В доках tailwinds и bootstrap рекомендуют базовой вёрсткой делать мобильную, а потом по брейкпоинтам увеличивать масштаб. У меня уже не так, может быть переделаю на 2 части самостоятельной;*
    - *Страничка на мобилке отображается юзабельно, но не оптимально;*
- [ ]  (+3/5Б)При работе со стилями использовать:
    - [x] (+1Б) Селектор по классу;
    - [ ] (+1Б) Селектор по атрибуту;
        - *Есть в скриптах, считается?*
    - [ ] (+1Б) Селектор по идентификатору;
        - *Есть в скриптах, считается?*
    - [x] (+1Б) Селектор по тегу;
    - [x] (+1Б) 3-4 псевдоселектора по классу;
- [x] (+999Б) Повеселиться и добавить снежинки/конфетти на фон, пасхалку и т.п;
    - *Добавил снежинки😁*

### JS (9+ баллов)
- [x] (+1Б) Использовать js для валидации полей ввода — установить ограничения пароля, почты или телефона;
- [x] (+1Б) Использовать js для условного вывода сообщений пользователю;
- [x] (+1Б) Использовать js для проверки правильности введённых данных (захардкодить верную комбинацию данных и сравнить ввод);
- [x]  (+4Б) Использовать js для сохранения введённых данных, их последующего отображения 
    - [x] ❓Объяснить почему выбрали тот или иной способ хранения данных, помним, что это пара логин-пароль❓
    - *Сохраняю в localStorage*
    - *Почему не куки: по хорошему сессионные токены так и хранят (если я правильно понял), куки автоматически отправляются с каждым запросом (если я правильно понял). Но какие сессионные токены в первом фронтенд проекте?😁😁😁*
    - *Почему не sessionStorage: потому что нужно внесессионное хранилище. Сессионные данные удаляются при закрытии вкладки;*
    - *Почему не кеш: я нищий💸🤲🏻. (Кеш используется для ускорения загрузки ресурсов, для оффлайн доступа к контенту. Для логина/пароля это совсем не подходит.)*
    - *Почему не IndexDB: это noSQL БД, используется для работы с большими объёмами данных, поддерживает запросы и т.д., Также используют для оффлайн режима. (Если я всё правильно понял). Оверкилл для сохранения двух пар ключ-значение;*
- [x] (+1Б) Использовать обработчики событий;
- [x] (+1Б) Использовать стрелочные и именованные функции 
    - [ ]❓поделиться, какие больше понравились, почему?❓
    - *Видимо я не понимаю вопроса... ну, вместе с  .forEach удобно, не нужно лишний раз объявлять функцию. В слушателях так же. В общем, удобно, когда нужно функцию параметром передавать, и эта функцию в других местах не используется.*
- [x]  (+999Б) Повеселиться и добавить снежинки/конфетти на фон, пасхалку и т.п;
    - *Добавил снежинки😁*