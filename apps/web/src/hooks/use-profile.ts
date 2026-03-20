import { useMutation } from "@tanstack/react-query";
import { fetchMe } from "../lib/api-auth";
import { type ProfilePatch, updateProfile } from "../lib/api-profile";
import { useAuthStore } from "../stores/auth-store";

async function refreshMe(): Promise<void> {
  const { token, me, setSession } = useAuthStore.getState();
  if (!token || !me) return;
  const updated = await fetchMe(token);
  setSession(token, updated);
}

export function useProfile() {
  const save = useMutation({
    mutationFn: (patch: ProfilePatch) => updateProfile(patch),
    onSuccess: refreshMe,
  });

  return { save };
}
