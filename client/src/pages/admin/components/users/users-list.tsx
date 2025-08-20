import { useState } from "react";
import { UserCard } from "./user-card";
import { UserTable } from "./user-table";
import { ViewToggle } from "./view-toggle";
import type { UserAdmin } from "@/features/user/interfaces/user.interface";

interface UsersListProps {
  users: UserAdmin[];
}

export const UsersList = ({ users }: UsersListProps) => {
  const [currentView, setCurrentView] = useState<"card" | "table">("card");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Users Management</h2>
        <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
      </div>

      {currentView === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <UserCard key={user.uuid} user={user} />
          ))}
        </div>
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
};
