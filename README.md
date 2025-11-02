# YouTube Clone

A full-featured YouTube clone built with Next.js, React, tRPC, Drizzle ORM, Clerk authentication, and more.  
This project is for educational purposes and gives credit to the original YouTube platform.

---

## Features

- **User Authentication:** Secure login/signup using Clerk.
- **Video Upload & Playback:** Upload videos, stream with Mux, and view with Mux Player.
- **Playlists & Subscriptions:** Create playlists, subscribe to channels, and manage your content.
- **Comments & Reactions:** Like, comment, and interact with videos.
- **Responsive UI:** Built with Radix UI, Tailwind CSS, and custom components.
- **Infinite Scrolling & Pagination:** Efficient data fetching with TanStack React Query and tRPC.
- **Admin & Studio Views:** Manage your channel and videos.
- **Modern Stack:** Next.js 15, React 19, TypeScript, Drizzle ORM, Zod validation, and more.

---

## Getting Started

### 1. Install dependencies

With **bun**:
```sh
bun install
```

Or with **npm**:
```sh
npm install
```

### 2. Run the development server

```sh
bun run dev
# or
npm run dev
```

### 3. Build for production

```sh
bun run build
# or
npm run build
```

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Radix UI
- **Backend:** tRPC, Drizzle ORM, NeonDB, Upstash Redis
- **Auth:** Clerk
- **Video:** Mux
- **Forms & Validation:** React Hook Form, Zod
- **Other:** Sonner (notifications), SuperJSON, UploadThing, Svix (webhooks)

---

## Credits

This project is inspired by [YouTube](https://youtube.com) and built for learning purposes.  
All trademarks and copyrights belong to their respective owners.

### Special Thanks

**Credit:** [Antonio Erdeljac](https://www.codewithantonio.com/)  
**GitHub:** [antonioerdeljac](https://github.com/antonioerdeljac)

This YouTube clone is heavily based on Antonio Erdeljac's excellent tutorials and open-source work.  
If you want to learn how to build modern full-stack apps, check out his content!

#### YouTube Video Series

- **Part 1:**  [Build a YouTube Clone with Next.js 15: React, Tailwind, Drizzle, tRPC (2025)](https://www.youtube.com/watch?v=ArmPzvHTcfQ)
- **Part 2:**  [Build a YouTube Clone with Next.js 15: React, Tailwind, Drizzle, tRPC (Part 2/2)](https://www.youtube.com/watch?v=ig26iRcMavQ)

Thank you, Antonio, for sharing your knowledge and resources with the community!

## Deployment Notes

- Run the following command to push your schema to the database:
  ```sh
  bunx drizzle-kit push
  ```
- After deployment, update the `NEXT_PUBLIC_APP_URL` and `UPSTASH_WORKFLOW_URL` environment variables to your actual domain values.
- After deployment, configure a new webhook in Clerk with your actual domain, granting all user permissions.  
  After creating the webhook, update the `CLERK_WEBHOOK_SIGNING_SECRET` environment variable with the new Signing Secret.

## License

MIT
