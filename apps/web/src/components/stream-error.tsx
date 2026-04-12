import { useRouter } from "@tanstack/react-router";
import { parseGeoRestriction } from "../lib/geo-restriction";
import { isMemberOnlyMessage } from "../lib/member-only";
import { FlagIcon } from "./flag-icon";

type Props = {
  message: string;
  onRetry?: () => void;
};

export function StreamError({ message, onRetry }: Props) {
  const router = useRouter();
  const countryCode = parseGeoRestriction(message);
  const isMemberOnly = isMemberOnlyMessage(message);

  return (
    <div className="fixed inset-0 bg-app flex flex-col items-center justify-center gap-5">
      <img
        src={isMemberOnly ? "/member-only-source.gif" : "/error-cat.gif"}
        width="220"
        height="220"
        alt=""
        className="rounded-2xl"
      />
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-white text-base font-semibold tracking-tight">
          Couldn't load this video
        </p>
        <div className="flex items-center gap-2">
          {countryCode && <FlagIcon code={countryCode} className="w-5 h-4 rounded-sm shrink-0" />}
          <p className="text-fg-muted text-sm max-w-xs text-center">{message}</p>
        </div>
      </div>
      <div className="flex gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2 rounded-full bg-white hover:bg-fg text-app text-sm font-medium transition-colors cursor-pointer"
          >
            Retry
          </button>
        )}
        <button
          type="button"
          onClick={() => router.history.back()}
          className="px-5 py-2 rounded-full bg-surface-strong hover:bg-surface-soft text-fg text-sm font-medium transition-colors cursor-pointer"
        >
          Go back
        </button>
      </div>
    </div>
  );
}
