import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth.store";
import type { User } from "@/features/user/interfaces/user.interface";
import { useUpdateUser } from "@/features/user/hooks/use-user";

interface EditUsernameFormProps {
  onBack: () => void;
  user: User;
}

const EditUsernameForm = ({ onBack, user }: EditUsernameFormProps) => {
  const [newUsername, setNewUsername] = useState(user.username);
  const { toast } = useToast();
  const { updateUser: updateAuthStore } = useAuthStore();
  const { mutate: updateUserMutation, isPending: isLoading } = useUpdateUser();

  useEffect(() => {
    setNewUsername(user.username);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newUsername.trim() === "") {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (newUsername === user.username) {
      toast({
        title: "Info",
        description: "Username is the same as current",
      });
      return;
    }

    if (newUsername.length < 3) {
      toast({
        title: "Error",
        description: "Username must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }

    updateUserMutation(
      {
        uuid: user.uuid,
        username: newUsername.trim(),
      },
      {
        onSuccess: () => {
          updateAuthStore({ username: newUsername.trim() });
          onBack();
        },
      }
    );
  };

  const handleBack = () => {
    setNewUsername(user.username);
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Edit Username</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newUsername">New Username</Label>
              <Input id="newUsername" type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Enter new username" required minLength={3} maxLength={20} />
            </div>

            <div className="text-sm text-muted-foreground">Username must be between 3 and 20 characters long.</div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading || newUsername.trim() === user.username}>
                {isLoading ? "Updating..." : "Update Username"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditUsernameForm;
