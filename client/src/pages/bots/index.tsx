import { BotsStatus, BotsGrid } from "../dashboard/components";
import { useBots } from "@/features/bot/hooks/use-bot";
import { RoleTypes } from "@/features/user/interfaces/user.interface";
import { useAuthStore } from "@/stores/auth.store";

const BotsPage = () => {
  const { role } = useAuthStore();
  const isUser = role === RoleTypes.user;
  const { data: bots, isLoading: isLoading, refetch, isRefetching: isRefetchingBots } = useBots(isUser ? { visible: true } : undefined);

  return (
    <div className="space-y-6 p-4 pb-20">
      <div className="max-w-7xl mx-auto space-y-6">
        <BotsStatus bots={bots || []} className={isUser ? "hidden" : ""} />
        <BotsGrid bots={bots || []} isLoading={isLoading} isRefetching={isRefetchingBots} refetch={refetch} />
      </div>
    </div>
  );
};

export default BotsPage;
