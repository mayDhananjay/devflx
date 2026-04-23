# Flux Code Editor

A modern, full-stack code editor application built with Next.js, featuring authentication with Google and GitHub OAuth providers.

## Technologies

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB Atlas
- **ORM:** Prisma 5
- **Authentication:** Auth.js (NextAuth v5)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Package Manager:** pnpm

## Prerequisites

- Node.js 18+ 
- pnpm 8+
- MongoDB Atlas account
- Google Cloud Console account (for OAuth)
- GitHub Developer account (for OAuth)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/flux-code-editor.git
cd flux-code-editor
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add the following environment variables:

```env
# Database
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority"

# Auth.js
AUTH_SECRET="your-auth-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 4. Generate AUTH_SECRET

```bash
npx auth secret
```

Or use OpenSSL:

```bash
openssl rand -base64 32
```

### 5. Set up MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write permissions
3. Whitelist your IP address (or use `0.0.0.0/0` for development)
4. Copy the connection string and add it to `DATABASE_URL`

### 6. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)
7. Copy the Client ID and Client Secret

### 7. Set up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the application details:
   - **Application name:** Flux Code Editor
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**
5. Copy the Client ID and generate a Client Secret

### 8. Generate Prisma Client and push schema

```bash
pnpm exec prisma generate
pnpm exec prisma db push
```

### 9. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   └── auth/
│   │       ├── layout.tsx
│   │       └── sign-in/
│   │           └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
├── lib/
│   ├── db.ts
│   └── utils.ts
├── modules/
│   └── auth/
│       ├── actions/
│       │   └── index.ts
│       └── components/
│           ├── logout-button.tsx
│           ├── sign-in-form-client.tsx
│           └── user-button.tsx
├── prisma/
│   └── schema.prisma
├── auth.config.ts
├── auth.ts
├── middleware.ts
├── next-auth.d.ts
└── routes.ts
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm exec prisma generate` | Generate Prisma Client |
| `pnpm exec prisma db push` | Push schema to database |
| `pnpm exec prisma studio` | Open Prisma Studio |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy

### Other Platforms

Make sure to:
1. Set all required environment variables
2. Run `pnpm exec prisma generate` during build
3. Ensure MongoDB Atlas IP whitelist includes your deployment platform

## License

MIT License
