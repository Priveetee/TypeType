import { lazy, Suspense } from "react";

const ShortsCommentsSheet = lazy(() =>
  import("../components/shorts-comments-sheet").then((module) => ({
    default: module.ShortsCommentsSheet,
  })),
);

type Props = {
  videoUrl: string;
  anchorEl: HTMLDivElement | null;
  open: boolean;
  onClose: () => void;
};

export function ShortsCommentsSheetSlot({ videoUrl, anchorEl, open, onClose }: Props) {
  return (
    <Suspense fallback={null}>
      <ShortsCommentsSheet videoUrl={videoUrl} anchorEl={anchorEl} open={open} onClose={onClose} />
    </Suspense>
  );
}
