# Деплой на Railway — пошаговая инструкция

## Что тебе понадобится
- Аккаунт на [railway.app](https://railway.app) (можно войти через GitHub)
- OpenRouter API key — уже есть
- GSC client_secret.json — уже есть
- authorizedcreds.dat — получить у разработчика (шаг 0 ниже)

---

## Шаг 0 — Получить authorizedcreds.dat (разработчик делает один раз)

Разработчик (Сергей/Кирилл) запускает локально:

```bash
git clone https://github.com/101rtpteam/seodashboard
cd seodashboard
pip3 install google-api-python-client oauth2client httplib2
mkdir credentials
# кладёт client_secret.json в ./credentials/
python3 authorize_gsc.py
```

После авторизации в браузере появляется файл `credentials/authorizedcreds.dat`.
Этот файл нужно передать тебе (например через Telegram).

---

## Шаг 1 — Закодировать credentials в base64

На маке открой Terminal (Spotlight → Terminal) и выполни:

```bash
base64 -i ~/Downloads/client_secret.json | tr -d '\n'
```
→ скопируй результат, это значение для `GSC_CLIENT_SECRET_B64`

```bash
base64 -i ~/Downloads/authorizedcreds.dat | tr -d '\n'
```
→ скопируй результат, это значение для `GSC_AUTHORIZED_CREDS_B64`

---

## Шаг 2 — Создать проект на Railway

1. Зайди на [railway.app](https://railway.app) → **New Project**
2. Выбери **Deploy from GitHub repo**
3. Выбери репо `101rtpteam/seodashboard`
4. Railway автоматически создаст один сервис

---

## Шаг 3 — Настроить Backend сервис

В Railway кликни на созданный сервис → вкладка **Settings**:

| Поле | Значение |
|------|----------|
| **Root Directory** | `/` (оставь пустым) |
| **Dockerfile Path** | `Dockerfile.backend` |
| **Port** | `5001` |

Вкладка **Variables** → добавь переменные:

| Переменная | Значение |
|------------|---------|
| `GSC_CLIENT_SECRET_B64` | (base64 из шага 1) |
| `GSC_AUTHORIZED_CREDS_B64` | (base64 из шага 1) |
| `OPENROUTER_API_KEY` | `sk-or-v1-b0825fb3...` (твой ключ) |
| `ALLOWED_ORIGINS` | (оставь пустым пока, заполним после деплоя фронта) |

Нажми **Deploy** → подожди пока соберётся (3-5 мин).

После деплоя скопируй URL бэкенда — выглядит как:
`https://seodashboard-backend-production-xxxx.up.railway.app`

---

## Шаг 4 — Добавить Frontend сервис

В том же Railway проекте → **+ New Service** → **GitHub Repo** → тот же репо.

Вкладка **Settings**:

| Поле | Значение |
|------|----------|
| **Dockerfile Path** | `Dockerfile.frontend` |
| **Port** | `3000` |

Вкладка **Variables**:

| Переменная | Значение |
|------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | URL бэкенда из шага 3 |

Нажми **Deploy**.

После деплоя получишь URL фронтенда:
`https://seodashboard-frontend-production-xxxx.up.railway.app`

---

## Шаг 5 — Финальная связка

Вернись в **Backend сервис** → Variables → добавь:

| Переменная | Значение |
|------------|---------|
| `ALLOWED_ORIGINS` | URL фронтенда из шага 4 |

Railway автоматически передеплоит бэкенд.

---

## Готово

Открывай URL фронтенда → дашборд должен работать.

Если в Settings видишь "Credentials are authorized" — всё ок.
Если нет — проверь что `GSC_AUTHORIZED_CREDS_B64` заполнен правильно.

---

## Стоимость Railway

Free tier: 500 часов в месяц (хватит на один проект).
Hobby план: $5/мес — без ограничений по времени, рекомендую.
