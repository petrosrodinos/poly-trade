import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CredentialsSchema } from "../../validation-schemas/credentials";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateCredentials } from "@/features/credentials/hooks/use-credentials";
import { type CredentialsFormValues, CredentialsType as CredentialsTypeEnum } from "@/features/credentials/interfaces/credentials.interface";
import { useAuthStore } from "@/stores/auth.store";
import { Routes } from "@/routes/routes";
import { useNavigate } from "react-router-dom";

const CredentialsPage = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const { verified, isLoggedIn, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateCredentials();

  const form = useForm<CredentialsFormValues>({
    resolver: zodResolver(CredentialsSchema),
    defaultValues: {
      api_key: "",
      api_secret: "",
      type: CredentialsTypeEnum.BINANCE,
    },
  });

  const onSubmit = (data: CredentialsFormValues) => {
    mutate(
      {
        api_key: data.api_key,
        api_secret: data.api_secret,
        type: data.type || CredentialsTypeEnum.BINANCE,
      },
      {
        onSuccess: () => {
          updateUser({
            verified: true,
          });
        },
      }
    );
  };

  useEffect(() => {
    if (verified && isLoggedIn) {
      navigate(Routes.dashboard.root);
    }
  }, [verified, isLoggedIn]);

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="flex flex-col space-y-2 text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Binance Credentials</h1>
        <p className="text-sm text-muted-foreground">Add your Binance API credentials to start trading</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="api_key"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} type={showApiKey ? "text" : "password"} placeholder="Enter your Binance API key" className="pr-10" />
                    <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors">
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="api_secret"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>API Secret</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} type={showApiSecret ? "text" : "password"} placeholder="Enter your Binance API secret" className="pr-10" />
                    <button type="button" onClick={() => setShowApiSecret(!showApiSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors">
                      {showApiSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg p-4 border bg-yellow-100/10">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Security Notice</p>
              <p>Your API credentials are encrypted and stored securely. Make sure your Binance API has only futures trading permissions enabled.</p>
            </div>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isPending} loading={isPending}>
            {"Save Credentials"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default CredentialsPage;
