import { useGetUsers } from "@/features/user/hooks/use-user";
import { UsersList } from "./users-list";
import { Spinner } from "@/components/ui/spinner";
import { Users } from "lucide-react";

const AdminUsers = () => {
  const { data: users, isLoading, error } = useGetUsers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-destructive">
        <p>Error loading users: {error.message}</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <Users className="h-16 w-16 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No users found</h3>
        <p>There are no users to display at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 pb-20">
      <UsersList users={users} />
    </div>
  );
};

export default AdminUsers;
