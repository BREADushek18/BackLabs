# Student-Teacher Platform API

Backend-приложение для образовательной платформы
с использованием Express, MongoDB и JWT аутентификации.

---

## Возможности API

### Аутентификация пользователей

- \`POST /api/auth/signup\` — регистрация пользователя (студент или преподаватель)
- \`POST /api/auth/signin\` — авторизация пользователя
- \`GET /api/auth/me\` — получение профиля авторизованного пользователя
- \`DELETE /api/auth/me\` — удаление аккаунта пользователя

### Управление курсами

- \`POST /api/courses\` — создание нового курса (только для преподавателей)
- \`GET /api/courses\` — получение всех курсов с поддержкой поиска, фильтрации и пагинации
- \`GET /api/courses/:id\` — получение конкретного курса по его \`id\`
- \`PATCH /api/courses/:id\` — обновление курса по его \`id\` (только автор курса)
- \`DELETE /api/courses/:id\` — удаление курса по его \`id\` (только автор курса)

### Избранные курсы

- \`POST /course-favourites/:id\` — добавить курс в избранное
- \`DELETE /course-favourites/:id\` — удалить курс из избранного
- \`GET /course-favourites/my/all\` — получить все избранные курсы пользователя
- \`GET /course-favourites/top/all\` — получить самые популярные курсы по количеству добавлений в избранное

### Работа с тегами

- \`POST /api/tags\` — создать новый тег
- \`DELETE /api/tags/:id\` — удалить тег по его \`id\`
- \`GET /api/tags\` — получить все теги
- \`POST /api/courses/:id/tags/:tagId\` — добавить тег к курсу
- \`DELETE /api/courses/:id/tags/:tagId\` — удалить тег из курса

### Уроки

- \`POST /api/lessons\` — создать урок (только преподаватель — автор курса)
- \`GET /api/lessons\` — список всех уроков с поддержкой поиска, фильтрации и пагинации
- \`GET /api/lessons/:id\` — получить урок по ID
- \`PATCH /api/lessons/:id\` — обновить урок (только автор)
- \`DELETE /api/lessons/:id\` — удалить урок (только автор)

### Комментарии (с полиморфной ссылкой на автора)

- \`POST /api/comments\` — создать комментарий к уроку (студент или преподаватель)
- \`GET /api/comments/lesson/:lessonId\` — получить комментарии к уроку (с информацией об уроке)
- \`GET /api/comments/:id\` — получить комментарий по ID
- \`PATCH /api/comments/:id\` — обновить комментарий (только автор)
- \`DELETE /api/comments/:id\` — удалить комментарий (автор или преподаватель курса)

### Записи на курсы

- \`POST /api/enrollments/enroll/:courseId\` — записаться на курс
- \`GET /api/enrollments/my-enrollments\` — получить список всех своих записей на курсы
- \`DELETE /api/enrollments/enroll/:courseId\` — отменить запись на курс
- \`POST /api/enrollments/progress/:courseId/lesson/:lessonId\` — отметить урок завершённым (только студент, записанный на курс)
- \`DELETE /api/enrollments/progress/:courseId/lesson/:lessonId\` — отменить завершение урока (только студент, записанный на курс)
- \`GET /api/enrollments/progress/:courseId\` — получить прогресс по курсу (только студент, записанный на курс)
- \`GET /api/enrollments/course/:courseId/students\` — получить количество студентов, записанных на курс

---

## Установка

### 1. Копирование репозитория и установка зависимостей

Для клонирования репозитория используйте команду:

```bash
git clone https://github.com/your-username/project-name.git
cd project-name
```

Введите команду для установки зависимостей с помощью **npm**:

```bash
npm i
```

### 2. Настройка базы данных

Запустите MongoDB в Docker:

```bash
docker run -d -p 27017:27017 --name mongo mongo:latest
```

Подключитесь к контейнеру:

```bash
docker exec -it mongo bash
```

Внутри контейнера выполните:

```bash
mongosh
```

### 3. Настройка окружения

Создайте файл .env в корне проекта:

```bash
MONGO_URI=mongodb://localhost:27017/student-platform
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

Запуск приложения

```bash
npm run dev
```

---

## Дополнительная информация

- Все защищенные маршруты требуют передачи **JWT токена** в заголовке \`Authorization: Bearer <token>\`.
- При загрузке курсов преподаватели могут прикреплять изображения. Изображения автоматически обрабатываются через \`sharp\` (сжатие и наложение водяного знака).

---
