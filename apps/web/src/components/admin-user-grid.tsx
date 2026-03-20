import { formatCreatedAt } from "../lib/admin-console";
import type { AuthUser } from "../types/auth";
import { AdminUserRow } from "./admin-user-row";

type AdminUserGridProps = {
  users: AuthUser[];
  selectedUserId: string | null;
  onSelectUser: (id: string) => void;
};

export function AdminUserGrid({ users, selectedUserId, onSelectUser }: AdminUserGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {users.map((user, index) => (
        <div
          key={user.id}
          className="animate-card-pop-in"
          style={{ animationDelay: `${Math.min(index * 35, 280)}ms` }}
        >
          <AdminUserRow
            user={user}
            selected={selectedUserId === user.id}
            createdAtLabel={formatCreatedAt(user.createdAt)}
            onSelect={(id) => onSelectUser(id)}
          />
        </div>
      ))}
    </div>
  );
}
