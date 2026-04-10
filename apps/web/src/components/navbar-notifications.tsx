import { lazy, Suspense } from "react";

const NotificationsDropdown = lazy(() =>
  import("./notifications-dropdown").then((module) => ({
    default: module.NotificationsDropdown,
  })),
);

export function NavbarNotifications() {
  return (
    <Suspense fallback={null}>
      <NotificationsDropdown />
    </Suspense>
  );
}
