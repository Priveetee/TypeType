type Props = {
  path: string;
  color: string;
  label: string;
};

export function ServiceIcon({ path, color, label }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={color}
      role="img"
      aria-label={label}
    >
      <path d={path} />
    </svg>
  );
}
