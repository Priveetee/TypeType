import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ProfileAvatar } from "../components/profile-avatar";
import { ProfileAvatarSettings } from "../components/profile-avatar-settings";
import { Toast } from "../components/toast";
import { useAuth } from "../hooks/use-auth";
import { useProfile } from "../hooks/use-profile";
import { parseProfileServerError } from "../lib/profile-errors";
import { normalizeField, validateBio, validatePublicUsername } from "../lib/profile-validation";

function ProfilePage() {
  const { me } = useAuth();
  const { save } = useProfile();
  const [publicUsername, setPublicUsername] = useState("");
  const [bio, setBio] = useState("");
  const [serverUsernameError, setServerUsernameError] = useState<string | null>(null);
  const [serverBioError, setServerBioError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!me) return;
    setPublicUsername(me.publicUsername ?? "");
    setBio(me.bio ?? "");
  }, [me]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const normalizedUsername = normalizeField(publicUsername);
  const normalizedBio = normalizeField(bio);
  const usernameError = serverUsernameError ?? validatePublicUsername(normalizedUsername);
  const bioError = serverBioError ?? validateBio(normalizedBio);
  const hasError = usernameError !== null || bioError !== null;

  const isDirty = useMemo(() => {
    const currentUsername = me?.publicUsername ?? null;
    const currentBio = me?.bio ?? null;
    return currentUsername !== normalizedUsername || currentBio !== normalizedBio;
  }, [me, normalizedUsername, normalizedBio]);

  return (
    <div className="flex flex-col gap-6 [animation:page-fade-in_0.2s_ease-out]">
      <h1 className="text-lg font-semibold text-zinc-100">Profile</h1>
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-5">
        {me && (
          <div className="flex items-center gap-3">
            <ProfileAvatar me={me} className="h-12 w-12" />
            <div>
              <p className="text-sm text-zinc-100">{me.publicUsername ?? "No public username"}</p>
              <p className="text-xs text-zinc-500">{me.id}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="publicUsername" className="text-xs text-zinc-400">
            Public username
          </label>
          <input
            id="publicUsername"
            value={publicUsername}
            onChange={(event) => setPublicUsername(event.target.value)}
            onFocus={() => setServerUsernameError(null)}
            placeholder="john.doe"
            className="h-9 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100"
          />
          <p className={`text-xs ${usernameError ? "text-red-300" : "text-zinc-500"}`}>
            {usernameError ?? "3-32 chars, letters/numbers/._-"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="bio" className="text-xs text-zinc-400">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            onFocus={() => setServerBioError(null)}
            placeholder="Tell people who you are"
            maxLength={280}
            rows={4}
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 resize-none"
          />
          <div className="flex items-center justify-between text-xs">
            <p className={bioError ? "text-red-300" : "text-zinc-500"}>
              {bioError ?? "Up to 280 chars"}
            </p>
            <p className="text-zinc-500">{bio.length}/280</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={save.isPending || hasError || !isDirty}
            onClick={() => {
              setServerUsernameError(null);
              setServerBioError(null);
              save.mutate(
                { publicUsername: normalizedUsername, bio: normalizedBio },
                {
                  onSuccess: () => setToast("Profile updated"),
                  onError: (error) => {
                    const parsed = parseProfileServerError(error);
                    if (parsed.field === "publicUsername") {
                      setServerUsernameError(parsed.message);
                      return;
                    }
                    if (parsed.field === "bio") {
                      setServerBioError(parsed.message);
                      return;
                    }
                    setToast(parsed.message);
                  },
                },
              );
            }}
            className="h-9 rounded-md bg-zinc-100 px-3 text-xs font-medium text-zinc-900 disabled:opacity-50"
          >
            Save profile
          </button>
        </div>
      </section>
      {me && !me.id.startsWith("guest:") && (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-100">Password</p>
            <p className="text-xs text-zinc-500">Reset your account password</p>
          </div>
          <Link
            to="/reset-password"
            className="h-9 rounded-md border border-zinc-700 bg-zinc-900 px-3 inline-flex items-center text-xs text-zinc-200 hover:border-zinc-500"
          >
            Reset password
          </Link>
        </section>
      )}
      <ProfileAvatarSettings />
      <Toast message={toast} />
    </div>
  );
}

export const Route = createFileRoute("/profile")({ component: ProfilePage });
