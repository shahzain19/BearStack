# 🐻 BearStacks

A cozy, magical online library where readers discover beautiful books, authors write and publish stories, and the community gathers around shared tales.

Built with ❤️ using Vite, React, Tailwind CSS, TypeScript, and Supabase.

---

## ✨ Features

### 📚 Library
- Smart search & filtering by genre, title, and author
- Cozy UI with animated book covers and detailed BookCards
- Supports bookmarks and personalized reading experience

### 🧑‍💻 Author Tools
- Dedicated **Author Profiles** showcasing their books
- Rich **Book Writing UI** (Markdown + rich text support)
- Book management dashboard for editing and publishing

### 🔮 Magic Badges
- Unique collectible badges with rarity effects (`common`, `rare`, `epic`, `legendary`)
- Awarded for actions like joining, writing, exploring
- Fully customizable with glowing ring effects and icon themes

### 🏡 BookNooks
- Community reading groups
- Each Nook has posts, members, and a cozy discussion space
- Built for social reading and mini book clubs

### 📖 Reading Experience
- `/book/:id` route renders beautifully formatted chapters
- Rich Markdown content with image, links, and text styles
- Focused, distraction-free UI

### ⚙️ Admin & User Roles
- Reader, Author, Admin role system
- Admin Dashboard for approving or rejecting book submissions
- Author-only routes and UI elements

---

## 🧱 Tech Stack

- **Frontend**: Vite, React, TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Backend**: Supabase (auth, database, storage)
- **Editor**: Tiptap

---

## 📁 Project Structure

```bash
/src
│
├── components        # Reusable UI components (BookCard, MagicBadge, etc.)
├── pages             # React Router pages (Library, Profile, BookDetails, etc.)
├── lib               # Supabase client, utils
├── models            # Tailwind base styles and theme config
└── contexts
└── hooks            # TypeScript interfaces and types
