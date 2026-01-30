# SpaceAids Storefront - Envato Demo Version

This is the demo version of SpaceAids Storefront, specifically configured for Envato live preview.

## Demo Mode Features

✅ **Fully Functional:**
- 3D Product Viewer with React Three Fiber
- Interactive material/part selection
- Real-time color customization
- Skin tone matching & selection
- Product browsing & filtering
- Responsive design

⚠️ **Disabled in Demo:**
- Add to Cart functionality (shows demo modal)
- Checkout process
- Payment processing
- Order management

## Quick Deploy to Vercel

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel:**
   ```bash
   npx vercel
   ```

   Or connect this folder to Vercel via GitHub for automatic deployments.

## Environment Variables

The demo uses the following environment variables (already configured in `.env`):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_DEMO_MODE` | Set to `true` to enable demo mode |
| `NEXT_PUBLIC_DEFAULT_REGION` | Default region (UAE) |
| `MEDUSA_BACKEND_URL` | Medusa backend URL |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Medusa publishable key |
| `NEXT_PUBLIC_BASE_URL` | Base URL of the deployed demo |

## Customization

### Update Envato Item URL

Edit `src/lib/demo-config.ts` and update the `ENVATO_ITEM_URL`:

```typescript
export const ENVATO_ITEM_URL = "https://codecanyon.net/item/your-item-name/12345678"
```

### Modify Demo Messages

All demo messages can be customized in `src/lib/demo-config.ts`:

```typescript
export const demoMessages = {
  addToCart: "Your custom message...",
  checkout: "Your custom message...",
  // ...
}
```

### Demo Banner Configuration

Customize the floating demo banner in `src/lib/demo-config.ts`:

```typescript
export const demoBannerConfig = {
  enabled: true,
  position: "bottom", // "top" | "bottom"
  dismissible: true,
  message: "Your custom banner message",
  // ...
}
```

## Project Structure

```
demo-storefront/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── lib/
│   │   ├── demo-config.ts      # Demo mode configuration
│   │   └── ...
│   ├── modules/
│   │   ├── common/components/
│   │   │   ├── demo-banner/    # Floating demo banner
│   │   │   └── demo-modal/     # Demo restriction modal
│   │   ├── products/           # Full 3D customization (preserved)
│   │   └── ...
├── .env                        # Demo environment variables
├── vercel.json                 # Vercel deployment config
└── package.json
```

## Support

For the full version with all e-commerce features enabled, visit the Envato item page.
