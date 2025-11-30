import React from 'react';

export const AndroidIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.3,13.3c0-1.8-1.5-3.3-3.3-3.3h-4c-1.8,0-3.3,1.5-3.3,3.3v4.4h10.7V13.3z M8.1,13.3c0-1,0.8-1.8,1.8-1.8h4 c1,0,1.8,0.8,1.8,1.8v0.4H8.1V13.3z" />
    <path d="M15.5,6.5c0.6,0,1-0.4,1-1s-0.4-1-1-1s-1,0.4-1,1S14.9,6.5,15.5,6.5z" />
    <path d="M8.5,6.5c0.6,0,1-0.4,1-1s-0.4-1-1-1s-1,0.4-1,1S7.9,6.5,8.5,6.5z" />
    <path d="M19.4,12.2c0.2,0,0.5-0.1,0.6-0.3c0.3-0.4,0.1-0.9-0.3-1.2L17,9.1V5.7c0-2.3-1.9-4.2-4.2-4.2h-1.6 c-2.3,0-4.2,1.9-4.2,4.2v3.4L4.3,10.7c-0.4,0.3-0.5,0.8-0.3,1.2c0.2,0.4,0.7,0.6,1.1,0.3l2.8-2v0.1c-2.4,0.8-4.2,3-4.2,5.6v4.4 c0,0.8,0.7,1.5,1.5,1.5h11.3c0.8,0,1.5-0.7,1.5-1.5v-4.4c0-2.6-1.8-4.8-4.2-5.6v-0.1l2.8,2C19,12.2,19.2,12.2,19.4,12.2z M17.8,17.7c0,0.1-0.1,0.2-0.2,0.2H6.4c-0.1,0-0.2-0.1-0.2-0.2v-4.4c0-2.8,2.3-5.1,5.1-5.1h1.3c2.8,0,5.1,2.3,5.1,5.1V17.7z" />
  </svg>
);

export const GoogleIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 174 58.7L385.9 143c-35.1-33.5-83.3-53.5-137.9-53.5-101.6 0-184.4 82.8-184.4 184.4s82.8 184.4 184.4 184.4c108.9 0 162.3-73.4 168.1-112.4H248V261.8h239.9c.1 0 .1.1.1.1v.1z"></path></svg>
);

export const FacebookIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>
);

export const InstagramIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="instagram" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9 26.3 26.2 58 34.4 93.9 36.2 37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>
);

export const XIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>
);

export const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);

export const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);
