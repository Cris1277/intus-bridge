# 🌿 IntusBridge

**IntusBridge** is a safe, supportive web application designed to help users navigate moments of stress, anxiety, and emotional difficulty through guided tools, journaling, and self-reflection.

It provides a private space to check in with emotions, track wellbeing, and access practical resources — always with a calm and supportive tone.

---

## 🚀 Live Demo

👉 **Coming soon — production link will be added here**

---

## ✨ Features

* 🧠 Daily emotional check-in with mood tracking
* 📓 Secure personal journal (CRUD with tagging and mood context)
* 📊 Emotional trends visualization
* 🛠 Practical calming tools and guides
* 🔐 Secure authentication system
* ⚙️ User profile management
* 🗑 Full data deletion (GDPR-style)
* 📦 Export data (foundation ready)
* 💬 Chat interface (currently mock-powered)

---

## 🤖 About AI Features

Some areas of the interface reference AI-powered insights and support.

At this stage:

* AI functionality is **not active in production**
* Chat responses are powered by **mock data**
* This decision ensures the project remains sustainable while avoiding unnecessary operational costs

The interface is designed to seamlessly enable real AI integration in future iterations.

---

## 🧰 Tech Stack

**Frontend**

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* Lucide Icons

**Backend**

* Next.js Route Handlers
* Prisma ORM
* PostgreSQL

**Authentication**

* NextAuth (Credentials provider)
* JWT sessions
* bcrypt password hashing

**State / Data**

* Server components + client hooks
* Secure API routes

---

## 🏗 Architecture Overview

```
app/
 ├─ api/            → Backend endpoints
 ├─ auth/           → Authentication pages
 ├─ app/            → Protected application area
components/         → UI components
lib/                → Utilities (Prisma, auth helpers)
prisma/             → Database schema & migrations
```

---

## 🔐 Security

* Passwords hashed with bcrypt
* Session authentication via NextAuth JWT
* User-scoped queries enforced server-side
* Prisma ORM protects against SQL injection
* Cascade deletion ensures data integrity
* Sensitive environment variables excluded from version control

---

## ⚙️ Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Required variables include:

* DATABASE_URL
* NEXTAUTH_SECRET
* NEXTAUTH_URL

---

## 🧪 Local Development

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run database migrations

```bash
npx prisma migrate dev
```

### 3️⃣ Start development server

```bash
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## 🗄 Database

PostgreSQL with Prisma schema including:

* Users
* Journal entries
* Check-ins
* Conversations
* Messages
* Tools
* Resources

Relations enforce ownership and cascade cleanup.

---

## 🧹 Data Deletion

Users can permanently delete all personal data via Settings.

This includes:

* Journal entries
* Check-ins
* Conversations
* Messages
* Account record

Designed with privacy in mind.

---

## 📌 Current Limitations

* AI services not connected yet
* Chat uses mock responses
* Export functionality scaffolded
* Notifications not implemented
* No password reset flow (planned)

---

## 🛣 Roadmap / Future Improvements

### 🔮 Product

* Real AI emotional support integration
* Pattern detection across journal entries
* Smart recommendations
* Crisis escalation flows
* Guided reflection journeys

### 🔐 Security

* Rate limiting on auth routes
* Email verification
* Password reset
* Session rotation
* Audit logging

### ⚡ Performance

* Query caching
* Edge deployment optimizations
* Streaming UI updates

### 📱 UX

* Mobile polish
* Accessibility improvements
* Dark mode refinements
* Offline support (PWA)

### 📊 Insights

* Emotional analytics dashboard
* Long-term wellbeing trends

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.

Feel free to open issues or pull requests.

---

## 👤 Author

**Cristian**
GitHub: https://github.com/Cris1277

---

## 📄 License

This project is open source and available under the MIT License.

---

## 💙 Disclaimer

IntusBridge provides emotional support tools and reflection spaces.

It is **not a medical or therapeutic service** and does not replace professional help.

If you are in immediate danger, please contact local emergency services.

---

## 🌱 Vision

To build a calm digital space where people feel supported, understood, and empowered — especially during difficult moments.

---
