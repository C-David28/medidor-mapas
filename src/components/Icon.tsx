import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  map: (
    <>
      <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
      <path d="M9 3v15M15 6v15" />
    </>
  ),
  route: (
    <>
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M7 5h9a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8h7" />
    </>
  ),
  radius: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="1" />
      <path d="m12 12 6-6M15 6h3v3" />
    </>
  ),
  pen: <path d="m15 4 5 5M4 20l5-1L20 8a2.8 2.8 0 0 0-4-4L5 15l-1 5Z" />,
  stop: <rect x="6" y="6" width="12" height="12" rx="2" />,
  trash: <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />,
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2.5 2-2.5 3.5M12 17h.01" />
    </>
  ),
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  layers: <path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5" />,
  area: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="m8 16 8-8M8 11v5h5" />
    </>
  ),
  pointer: <path d="m4 3 7 18 3-7 7-3L4 3Z" />,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
};

export default function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      className={`icon ${className}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.map}
    </svg>
  );
}
