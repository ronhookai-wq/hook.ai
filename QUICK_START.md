# Quick Start Guide

## Backend Already Configured ✅

Your Hook.ai backend is fully set up and ready to use!

### What's Already Done

✅ **Database Tables Created:**
- user_profiles
- subscription_tiers (with 4 plans pre-populated)
- user_subscriptions
- usage_tracking
- generated_images

✅ **Edge Functions Deployed:**
- stripe-webhook (for payment processing)
- create-checkout-session (for subscriptions)
- track-usage (for monitoring usage)
- get-user-data (for user information)

✅ **Security Configured:**
- Row Level Security enabled on all tables
- Users can only access their own data
- Automatic profile creation on signup
- Free trial auto-assigned

✅ **Client Libraries Created:**
- /lib/supabase.ts - Database client
- /lib/api.ts - API functions
- /lib/AuthContext.tsx - React auth provider

## Testing Your Backend

### 1. Test User Registration

Create a test account to verify everything works:

```javascript
// In browser console or component
import { signUp } from './lib/api';

await signUp('test@example.com', 'password123', 'Test User');
```

This will automatically:
- Create user account
- Create user profile
- Assign Free Trial subscription
- Set 5 thumbnail limit

### 2. Test Authentication

```javascript
import { signIn } from './lib/api';

await signIn('test@example.com', 'password123');
```

### 3. Test User Data Retrieval

```javascript
import { getUserData } from './lib/api';

const data = await getUserData();
console.log(data);
// Shows: profile, subscription, usage, limits, recentImages
```

### 4. Test Usage Tracking

```javascript
import { trackUsage } from './lib/api';

await trackUsage({
  operationType: 'generate',
  imageUrl: 'https://example.com/image.png',
  prompt: 'A cool image',
  style: 'Cinematic',
  aspectRatio: '16:9'
});
```

## Integration with Frontend

### Step 1: Update package.json

Already done! Dependencies installed.

### Step 2: Wrap App with AuthProvider

Update your main entry file:

```tsx
// index.tsx or main.tsx
import { AuthProvider } from './lib/AuthContext';

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

### Step 3: Use Authentication in Components

```tsx
import { useAuth } from './lib/AuthContext';

function MyComponent() {
  const { user, userData, loading, refreshUserData } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return (
    <div>
      <p>Email: {user.email}</p>
      <p>Tier: {userData?.subscription?.tier}</p>
      <p>Usage: {userData?.usage?.thumbnails_generated} / {userData?.limits?.thumbnailsPerMonth}</p>
    </div>
  );
}
```

### Step 4: Track Image Generation

When user generates an image:

```tsx
import { trackUsage } from './lib/api';
import { useAuth } from './lib/AuthContext';

async function handleGenerate() {
  try {
    // Generate image...
    const imageUrl = await generateImage(prompt, style, aspectRatio);

    // Track usage
    await trackUsage({
      operationType: 'generate',
      imageUrl,
      prompt,
      style,
      aspectRatio,
    });

    // Refresh user data to update limits
    await refreshUserData();
  } catch (error) {
    if (error.message.includes('Monthly limit reached')) {
      alert('Upgrade to continue!');
    }
  }
}
```

## API Endpoints

Your Supabase project URL: `https://frpjdlksccqgffyawmmg.supabase.co`

### Edge Functions:
- `POST /functions/v1/stripe-webhook` - Stripe events
- `POST /functions/v1/create-checkout-session` - Start subscription
- `POST /functions/v1/track-usage` - Record usage
- `GET /functions/v1/get-user-data` - Get user info

## Available API Functions

### Authentication
```typescript
import { signUp, signIn, signOut, signInWithGoogle, signInWithFacebook } from './lib/api';

// Email/Password
await signUp(email, password, fullName);
await signIn(email, password);
await signOut();

// OAuth
await signInWithGoogle();
await signInWithFacebook();
```

### User Data
```typescript
import { getUserData, getCurrentUsage, getRecentImages } from './lib/api';

const userData = await getUserData();
const usage = await getCurrentUsage();
const images = await getRecentImages(20);
```

### Subscriptions
```typescript
import { getSubscriptionTiers, createCheckoutSession } from './lib/api';

const tiers = await getSubscriptionTiers();
const { url } = await createCheckoutSession(tierId, priceId);
window.location.href = url; // Redirect to Stripe
```

### Usage Tracking
```typescript
import { trackUsage } from './lib/api';

await trackUsage({
  operationType: 'generate' | 'magic_edit' | 'upscale' | 'remove_bg' | 'upload',
  imageUrl: string,
  prompt?: string,
  style?: string,
  aspectRatio?: string,
  metadata?: object
});
```

## Subscription Tiers

Pre-configured in database:

| Tier | Price | Thumbnails/Month |
|------|-------|------------------|
| Free Trial | $0 | 5 |
| Basic | $15 | 30 |
| Pro | $25 | 100 |
| Agency | $59 | 300 |

## Next Steps

### For Development
1. Test authentication flow
2. Integrate with frontend components
3. Add usage tracking to image operations
4. Test limit enforcement

### For Production
1. **Configure OAuth providers** in Supabase Dashboard
2. **Set up Stripe account** and add price IDs
3. **Configure webhook** in Stripe Dashboard
4. **Test payment flow** with Stripe test mode
5. **Update environment variables** for production

## Troubleshooting

### "Not authenticated" errors
Make sure user is signed in:
```typescript
const { user } = useAuth();
if (!user) {
  // Show login modal
}
```

### "Monthly limit reached" errors
User has hit their plan limit:
```typescript
// Check usage before operations
const { usage, limits } = userData;
if (usage.thumbnails_generated >= limits.thumbnailsPerMonth) {
  // Show upgrade modal
}
```

### Database connection issues
Check environment variables in `.env`:
```
VITE_SUPABASE_URL=https://frpjdlksccqgffyawmmg.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

## Support

For detailed integration instructions, see:
- **INTEGRATION_GUIDE.md** - Step-by-step frontend integration
- **README.md** - Complete backend documentation
- **BACKEND_SUMMARY.md** - Overview of all features

Your backend is production-ready! Just add Stripe credentials and configure OAuth for a complete solution.
