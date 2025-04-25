# Student-Teacher Platform API

Backend-приложение для образовательной платформы   
с использованием Express, MongoDB и JWT аутентификации.

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
