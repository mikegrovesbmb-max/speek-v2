# Speek v2

Modern accessible speech and TTS communication app built with Nuxt 4.

## Features

- Text-to-Speech with multiple providers (Native, Deepgram, Speechify)
- Programmable quick phrase tiles
- Audio recording and playback
- Speech history
- PWA support for offline use
- Mobile-first responsive design

## Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Environment Variables

Create a `.env.local` file with:

```
NUXT_DEEPGRAM_API_KEY=your_key
NUXT_SPEECHIFY_API_KEY=your_key
NUXT_OPENAI_API_KEY=your_key
```

## Development

- **Framework**: Nuxt 4
- **UI**: Nuxt UI (Tailwind CSS)
- **State**: Pinia
- **Forms**: Vee-Validate + Zod
```

### **11. Test the Setup**

```bash
# Start dev server
pnpm dev

# Visit http://localhost:3000
```

### **12. Commit and Push**

```bash
git add .
git commit -m "Add basic project structure and placeholder UI"
git push