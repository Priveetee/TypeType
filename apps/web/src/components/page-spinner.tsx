type Props = {
  fullScreen?: boolean;
};

export function PageSpinner({ fullScreen = true }: Props) {
  const size = fullScreen ? 120 : 88;
  const wrapperClass = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black"
    : "flex h-full w-full items-center justify-center bg-black";

  return (
    <div className={wrapperClass}>
      <img src="/loader.gif" width={size} height={size} alt="" />
    </div>
  );
}
