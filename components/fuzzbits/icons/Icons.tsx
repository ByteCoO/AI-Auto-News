
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const LogoIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M15.5 12c0-1.93-1.57-3.5-3.5-3.5S8.5 10.07 8.5 12s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5zm-5.41-1.41L12 12.59l1.91-1.91-1.41-1.41-1.91 1.91zm4.82 4.82L13.59 14l-1.91 1.91 1.41 1.41 1.91-1.91z" />
    <circle cx="9.5" cy="10.5" r="0.5" fill="white" />
    <circle cx="14.5" cy="10.5" r="0.5" fill="white" />
    <path d="M12 15c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z" fill="white" />
  </svg>
);

export const ShoppingBagIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export const FuzzbitIcon1: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#6A44FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 14.5C9 14.5 10 16.5 12 16.5C14 16.5 15 14.5 15 14.5" stroke="#6A44FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.5 9.5C15.7761 9.5 16 9.27614 16 9C16 8.72386 15.7761 8.5 15.5 8.5C15.2239 8.5 15 8.72386 15 9C15 9.27614 15.2239 9.5 15.5 9.5Z" fill="#6A44FF"/>
    <path d="M8.5 9.5C8.77614 9.5 9 9.27614 9 9C9 8.72386 8.77614 8.5 8.5 8.5C8.22386 8.5 8 8.72386 8 9C8 9.27614 8.22386 9.5 8.5 9.5Z" fill="#6A44FF"/>
  </svg>
);

export const FuzzbitIcon2: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#6A44FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 10H8" stroke="#6A44FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 14L14 16L12 14L10 16L8 14" stroke="#6A44FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CrownIcon: React.FC<IconProps> = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2.5 11l5-5 4 4 4.5-4.5L21.5 11l-9.5 9.5z" />
  </svg>
);

export const DiscordIcon: React.FC<IconProps> = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8258-.6672 1.2835-1.9443-.3762-3.6822-.3762-5.4682 0-.2317-.4692-.48-1.02-.689-1.3902a.0741.0741 0 00-.077-.0379 19.74 19.74 0 00-4.8852 1.5152.068.068 0 00-.0216.0613c0 1.632.7937 3.1612 2.1816 4.3168-1.2898.8787-2.1582 1.9443-2.1582 1.9443s.4463.7816 1.4485 1.4485c-1.0729.8058-1.4485 1.59-1.4485 1.59s2.8427 1.6983 5.4682 1.6983c2.6255 0 5.4682-1.6983 5.4682-1.6983s-.3756-.7842-1.4485-1.59c1.0022-.6669 1.4485-1.4485 1.4485-1.4485s-.8684-1.0656-2.1582-1.9443c1.3879-1.1556 2.1816-2.6848 2.1816-4.3168a.068.068 0 00-.0216-.0613zM8.0202 15.3312c-.9333 0-1.6983-.732-1.6983-1.632s.765-1.632 1.6983-1.632c.9333 0 1.6983.732 1.6983 1.632.0001.9-.765 1.632-1.6983 1.632zm7.9596 0c-.9333 0-1.6983-.732-1.6983-1.632s.765-1.632 1.6983-1.632c.9333 0 1.6983.732 1.6983 1.632s-.765 1.632-1.6983 1.632z" />
    </svg>
);

export const XIcon: React.FC<IconProps> = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export const OpenSeaIcon: React.FC<IconProps> = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3-8c.83 0 1.5-.67 1.5-1.5S9.83 9 9 9s-1.5.67-1.5 1.5S8.17 12 9 12zm3-4c.83 0 1.5-.67 1.5-1.5S12.83 5 12 5s-1.5.67-1.5 1.5S11.17 8 12 8zm3 4c.83 0 1.5-.67 1.5-1.5S15.83 9 15 9s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-3 8c-2.04 0-3.83-1.14-4.65-2.85.34.09.68.15 1.03.15 1.9 0 3.55-1.16 4.22-2.78.68 1.62 2.32 2.78 4.23 2.78.35 0 .69-.06 1.02-.15C15.83 18.86 14.04 20 12 20z" />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = (props) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export const EthereumIcon: React.FC<IconProps> = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM5.75 13.25L12 22.25l6.25-9-6.25 3.75-6.25-3.75z" />
  </svg>
);

export const FireIcon: React.FC<IconProps> = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M17.65 9.35A8.001 8.001 0 005.47 13.52c.79 3.53 3.51 6.48 6.53 6.48 3.54 0 6.5-2.96 6.5-6.5 0-1.89-1.04-3.6-2.85-4.15zM12 18c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity=".3" />
    </svg>
);
