# OmPay 💳

OmPay is a full-stack payment application built with **Next.js, Express, Prisma, and PostgreSQL**.  
It supports secure authentication, wallet balance, money transfers, and transaction history.

---

## 🌐 Live

- Frontend: https://ompay.vercel.app  
- Backend: https://ompay-backend-a17n.onrender.com  

---

## 🛠 Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Express, Prisma, PostgreSQL
- **Auth:** JWT + HTTP-only cookies
- **Deployment:** Vercel (frontend), Render (backend)

---

## ✨ Features

- Secure signup & signin
- Wallet balance
- Send & receive money
- Transaction history
- Cookie-based authentication
- **Clean backend architecture using Express routers**

---

## ⚙️ Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_LOCAL_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_RENDER_API_URL=https://ompay-backend-a17n.onrender.com/api/v1
