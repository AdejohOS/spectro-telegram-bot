# Spectro Telegram Bot

A production-ready Telegram escrow platform built with **Node.js**, **Telegraf**, **PostgreSQL**, and **Drizzle ORM**. Spectro enables secure cryptocurrency transactions through escrow, wallet management, and powerful admin tools.

## ✨ Features

- 🔐 Telegram authentication
- 💰 User wallet management
- 💵 Admin wallet credit & debit
- ₿ BTC & TRC20 deposit support
- 🤝 Secure escrow transactions
- 🔒 Fund locking and release
- 📦 Order management
- ⚖️ Dispute handling
- 🔔 Real-time Telegram notifications
- 📜 Wallet transaction history
- 👨‍💼 Admin dashboard & moderation
- 📝 Structured logging
- 🗄 PostgreSQL with Drizzle ORM

---

## 🛠 Tech Stack

- Node.js
- Telegraf
- PostgreSQL
- Drizzle ORM
- Pino Logger
- Docker (optional)

---

## 📂 Project Structure

```
src/
├── config/
├── database/
├── modules/
│   ├── admin/
│   ├── auth/
│   ├── escrow/
│   ├── wallet/
│   ├── orders/
│   └── users/
├── repositories/
├── services/
├── utils/
├── keyboards/
└── bot.js
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/spectro-telegram-bot.git

cd spectro-telegram-bot
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file.

```env
BOT_TOKEN=
DATABASE_URL=
ADMIN_TELEGRAM_IDS=
```

### Run database migrations

```bash
npm run db:migrate
```

### Start the bot

```bash
npm run dev
```

or

```bash
npm start
```

---

## 📌 Roadmap

- [x] User wallets
- [x] Admin wallet management
- [x] Wallet transaction history
- [x] Escrow creation
- [x] Escrow release
- [x] Escrow cancellation
- [x] Dispute workflow
- [ ] Withdrawal requests
- [ ] Multi-currency support
- [ ] Admin analytics dashboard
- [ ] Web dashboard

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the project, submit issues, or open pull requests.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built by **AOS**.
