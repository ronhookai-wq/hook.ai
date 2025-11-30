import { Plan, ImageStyle, AspectRatio } from './types';

export const PRICING_PLANS: Plan[] = [
  {
    name: 'Free Trial',
    price: 0,
    thumbnails: 5,
    features: ['Watermarked thumbnails', 'HD upscaling', 'Basic background removal', 'Try without credit card'],
    bestFor: 'New users, casual creators',
    cta: 'Start Free Trial',
  },
  {
    name: 'Basic',
    price: 15,
    thumbnails: 30,
    features: ['HD thumbnail generation', 'Background removal', 'HD upscaling', 'AI style suggestions', 'Limited batch processing'],
    bestFor: 'Small YouTubers, hobbyists',
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: 25,
    thumbnails: 100,
    features: ['4K thumbnail generation', 'Advanced background removal', '4K upscaling', 'AI style variations', 'Batch uploads', 'Priority support'],
    bestFor: 'Frequent creators, influencers',
    cta: 'Go Pro',
  },
  {
    name: 'Agency',
    price: 59,
    thumbnails: 300,
    features: ['4K+ thumbnail generation', 'Unlimited style variations', 'Full batch uploads', 'Multi-seat / team access', 'API access & white label', 'Priority support'],
    bestFor: 'Agencies, studios, multi-channel editors',
    cta: 'Contact Us',
  },
];

export const STYLES: ImageStyle[] = Object.values(ImageStyle);
export const ASPECT_RATIOS: AspectRatio[] = Object.values(AspectRatio);

export const FONT_FACES = [
  'Inter',
  'Arial',
  'Courier New',
  'Georgia',
  'Times New Roman',
  'Verdana',
  'Lobster',
  'Roboto',
];