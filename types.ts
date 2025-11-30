
export enum AspectRatio {
  SixteenNine = '16:9',
  NineSixteen = '9:16',
  OneOne = '1:1',
}

export enum ImageStyle {
  Anime = 'Anime',
  Realistic = 'Realistic',
  Cinematic = 'Cinematic',
  Cartoon = 'Cartoon',
  Gamer = 'Gamer',
  Photography = 'Photography',
  Retro = 'Retro',
}

export interface Plan {
  name: string;
  price: number;
  thumbnails: number | string;
  features: string[];
  bestFor: string;
  cta: string;
}

export interface User {
  isLoggedIn: boolean;
  isSubscribed: boolean;
  subscriptionTier: 'Free Trial' | 'Basic' | 'Pro' | 'Agency';
}

export interface TextOverlay {
  id: number;
  text: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
  fontFamily: string;
}
