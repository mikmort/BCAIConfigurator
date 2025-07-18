import React from 'react';

export function InfoIcon() {
  return (
    <svg className="menu-svg-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="11" y="11" width="2" height="5" fill="currentColor" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

export function CompanyIcon() {
  return (
    <svg className="menu-svg-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 21V9l8-6 8 6v12h-6v-5h-4v5H4z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function BoxIcon() {
  return (
    <svg className="menu-svg-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 7l9-5 9 5v10l-9 5-9-5V7z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M3 7l9 5 9-5" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M12 12v10" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function MoneyIcon() {
  return (
    <svg className="menu-svg-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 7h16v10H4z" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function BookIcon() {
  return (
    <svg className="menu-svg-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 4h7v16H4zM13 4h7v16h-7z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function CartIcon() {
  return (
    <svg className="menu-svg-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
      <path d="M5 6h15l-2 9H7z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg className="menu-svg-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function FactoryIcon() {
  return (
    <svg className="menu-svg-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 21V9l6 3V9l6 3V9l6 3v9H3z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function CubeIcon() {
  return (
    <svg className="menu-svg-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M3 7l9 4 9-4M12 11v10" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function LightbulbIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className={props.className ? props.className + ' menu-svg-icon' : 'menu-svg-icon'}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9 18h6m-5 2h4M12 2a6 6 0 00-3 11v3h6v-3a6 6 0 00-3-11z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className={props.className ? props.className + ' menu-svg-icon' : 'menu-svg-icon'}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l1.76 5.41L19 9l-5.24 1.59L12 16l-1.76-5.41L5 9l5.24-1.59L12 2z" />
    </svg>
  );
}

export function ExcelIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className={props.className ? props.className + ' excel-icon' : 'excel-icon'}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#107C41" />
      <path d="M10 9l2 3-2 3m4-6l-2 3 2 3" stroke="#fff" strokeWidth="2" fill="none" />
    </svg>
  );
}

