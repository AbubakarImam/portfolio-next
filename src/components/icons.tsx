type IconProps = { className?: string };

const base = "block";

export function GithubIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      className={`${base} ${className ?? ""}`}
    >
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2-.2 4.5-1 4.5-4.5 0-1-.4-1.9-1-2.6.1-.3.4-1.4 0-2.9 0 0-.9-.3-2.9 1a10 10 0 0 0-5.2 0c-2-1.3-2.9-1-2.9-1-.4 1.5-.1 2.6 0 2.9-.6.7-1 1.5-1 2.6 0 3.5 2.5 4.3 4.5 4.5-.4.4-.4.9-.5 1.5V21" />
    </svg>
  );
}

export function LinkedinIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      className={`${base} ${className ?? ""}`}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
      <line x1="7.5" y1="10" x2="7.5" y2="17" />
      <circle cx="7.5" cy="7" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11.5 17v-4.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V17" />
      <line x1="11.5" y1="10" x2="11.5" y2="17" />
    </svg>
  );
}

export function TwitterIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      className={`${base} ${className ?? ""}`}
    >
      <path d="M4 4l7.5 9.5L4.3 20H6l6-5.8L16.5 20H20l-8-9.9L19.2 4H17.5l-5.6 5.4L7.5 4z" />
    </svg>
  );
}

export function WhatsappIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      className={`${base} ${className ?? ""}`}
    >
      <path d="M6 19l-1.4 1.4L4 20l1-3.4A8 8 0 1 1 8.6 19L6 20z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.5.9-1l-.4-1.6a1 1 0 0 0-1-.7l-1 .2a5 5 0 0 1-2-2l.2-1a1 1 0 0 0-.7-1L9 7.6c-.5-.1-1 .3-1 .9z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      className={`${base} ${className ?? ""}`}
    >
      <rect x="3.5" y="5.5" width="17" height="13" rx="1" />
      <path d="M4 6.5l8 6.5 8-6.5" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      className={`${base} ${className ?? ""}`}
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function PlaqueArrow({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      className={`${base} ${className ?? ""}`}
    >
      <path d="M12 4v14M6 13l6 6 6-6" />
    </svg>
  );
}
