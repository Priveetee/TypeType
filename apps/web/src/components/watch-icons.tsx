function SvgIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

export function ThumbUpIcon() {
  return (
    <SvgIcon label="Likes">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </SvgIcon>
  );
}

export function ThumbDownIcon() {
  return (
    <SvgIcon label="Dislikes">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
      <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
    </SvgIcon>
  );
}

export function ShareIcon() {
  return (
    <SvgIcon label="Share">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </SvgIcon>
  );
}

export function ListPlusIcon() {
  return (
    <SvgIcon label="Save to playlist">
      <path d="M11 12H3" />
      <path d="M16 6H3" />
      <path d="M16 18H3" />
      <path d="M18 9v6" />
      <path d="M21 12h-6" />
    </SvgIcon>
  );
}

export function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <SvgIcon label="Like">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={filled ? "currentColor" : "none"}
      />
    </SvgIcon>
  );
}

export function ClockIcon() {
  return (
    <SvgIcon label="Watch Later">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </SvgIcon>
  );
}

export function BanIcon() {
  return (
    <SvgIcon label="Block">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </SvgIcon>
  );
}

export function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <SvgIcon label="Favorite">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill={filled ? "currentColor" : "none"}
      />
    </SvgIcon>
  );
}

export function DanmakuIcon() {
  return (
    <SvgIcon label="Bullet comments">
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="14" y2="12" />
      <line x1="3" y1="17" x2="17" y2="17" />
    </SvgIcon>
  );
}

export function VerifiedBadgeIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-3 h-3 text-zinc-400 flex-shrink-0"
      fill="currentColor"
      aria-label="Verified"
    >
      <path d="M8 1L9.8 3.2L12.5 2.5L12.5 5.3L15 6.5L13.5 9L15 11.5L12.5 12.7L12.5 15.5L9.8 14.8L8 17L6.2 14.8L3.5 15.5L3.5 12.7L1 11.5L2.5 9L1 6.5L3.5 5.3L3.5 2.5L6.2 3.2Z" />
      <polyline
        points="5,9 7,11 11,7"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
