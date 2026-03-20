import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPasswordResetToken,
  fetchAdminUsers,
  suspendUser,
  unsuspendUser,
  updateUserRole,
} from "../lib/api-admin";
import type { AuthRole } from "../types/auth";

const KEY = ["admin-users"];
const key = (page: number, limit: number) => [...KEY, page, limit];

export function useAdminUsers(enabled: boolean, page: number, limit: number) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: key(page, limit),
    queryFn: () => fetchAdminUsers(page, limit),
    enabled,
  });

  const role = useMutation({
    mutationFn: ({ id, role }: { id: string; role: AuthRole }) => updateUserRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const suspend = useMutation({
    mutationFn: ({ id, suspended }: { id: string; suspended: boolean }) =>
      suspended ? unsuspendUser(id) : suspendUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const resetToken = useMutation({
    mutationFn: (id: string) => createPasswordResetToken(id),
  });

  return { query, role, suspend, resetToken };
}
