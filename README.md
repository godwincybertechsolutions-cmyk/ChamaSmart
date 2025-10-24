# ChamaSmart Frontend

A modern, production-ready frontend for managing Kenyan chamas (savings groups) with MPesa integration, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **MPesa Integration**: Accept contributions and process payouts via MPesa STK Push
- **Member Management**: Track members, contributions, and loan statuses
- **Real-time Dashboard**: Monitor group finances with interactive charts
- **Mobile-First Design**: Optimized for low-bandwidth mobile users
- **Dark Mode**: Built-in theme switching with next-themes
- **Internationalization**: Support for English and Swahili (scaffold ready)
- **Type-Safe**: Full TypeScript implementation with Zod validation
- **Secure Authentication**: Phone number + OTP authentication flow

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand + React Query (TanStack)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **UI Components**: Custom components with Radix UI primitives
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier + Husky

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-org/chamasmart-frontend.git
cd chamasmart-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# MPesa Configuration (Production)
NEXT_PUBLIC_MPESA_CONSUMER_KEY=your_consumer_key
NEXT_PUBLIC_MPESA_CONSUMER_SECRET=your_consumer_secret
NEXT_PUBLIC_MPESA_SHORTCODE=your_shortcode
NEXT_PUBLIC_MPESA_PASSKEY=your_passkey
NEXT_PUBLIC_MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_TIMEOUT=30000

# Feature Flags
NEXT_PUBLIC_ENABLE_MOCK_MPESA=true  # Set to false in production
```

## 📱 MPesa Integration

### Development Mode

The app includes mock MPesa endpoints for development:

- **STK Push**: `/api/mpesa/stk-push` - Initiates mock payment
- **Status Check**: `/api/mpesa/status` - Polls payment status

To use mock mode, set `NEXT_PUBLIC_ENABLE_MOCK_MPESA=true`.

### Production Setup

1. Register for MPesa Daraja API at https://developer.safaricom.co.ke
2. Get your credentials (Consumer Key, Secret, Shortcode, Passkey)
3. Update environment variables with production credentials
4. Implement backend endpoints for:
   - OAuth token generation
   - STK Push initiation
   - Callback handling
   - Payment verification

## 🏗️ Project Structure

```
chamasmart-frontend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── mpesa/        # MPesa endpoints
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard page
│   └── layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── layouts/          # Layout components
├── features/             # Feature-specific modules
│   ├── auth/            # Authentication features
│   ├── dashboard/       # Dashboard features
│   └── mpesa/           # MPesa integration
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── services/            # API services
├── stores/              # Zustand stores
├── types/               # TypeScript types
└── i18n/                # Internationalization
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm run format       # Format code with Prettier
npm test            # Run tests
```

## 🎨 Design Tokens

The app uses a comprehensive design system with:

- **Colors**: Primary, Accent, Neutral, Success, Warning, Danger
- **Typography**: Inter font with predefined sizes
- **Spacing**: Consistent spacing scale
- **Border Radius**: 2xl (1rem) for modern rounded corners
- **Shadows**: Soft shadows for depth

Access tokens in Tailwind config: `tailwind.config.ts`

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy

```bash
# Manual deployment
npx vercel --prod
```

### Docker

```bash
# Build image
docker build -t chamasmart-frontend .

# Run container
docker run -p 3000:3000 chamasmart-frontend
```

## 🔐 Security Considerations

- Never expose API credentials in frontend code
- Implement rate limiting for API endpoints
- Use HTTPS in production
- Validate all user inputs
- Implement proper CORS policies
- Use environment variables for sensitive data
- Regular security audits

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Commit Convention

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues and questions:

- GitHub Issues: [Create an issue](https://github.com/your-org/chamasmart-frontend/issues)
- Documentation: [View docs](https://docs.chamasmart.com)

## 🙏 Acknowledgments

- Built for Kenyan chamas
- MPesa integration powered by Safaricom Daraja API
- UI components inspired by shadcn/ui

---

Built with ❤️ by the ChamaSmart Team
