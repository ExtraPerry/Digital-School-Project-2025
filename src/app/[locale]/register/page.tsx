"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type SignupFormData,
  SignupFormSchema,
} from "@/types/supabase/zod-schema/signup-form-schema";
import { signup } from "@/lib/supabase/auth/signup";

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupFormSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const result = await signup(data);

      if (result.error) {
        console.log(result.error);
        toast.error(result.error);
      } else {
        toast.success(t("Messages.signupSuccess"));
        router.push("/login");
        router.refresh();
      }
    } catch {
      toast.error(t("Messages.signupError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/tr.jpg')" }}
    >
      <div className="max-w-md w-full space-y-8">
        <Card className="bg-gradient-to-br from-slate-900 to-gray-800 text-white shadow-lg border border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">
              {t("Pages.Register.title")}
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              {t("Pages.Register.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  {t("Pages.Register.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  disabled={isLoading}
                  className="bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400"
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-200">
                  {t("Pages.Register.username")}{" "}
                  <span className="text-gray-400 text-sm">(optional)</span>
                </Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  {...register("username")}
                  disabled={isLoading}
                  className="bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400"
                />
                {errors.username && (
                  <p className="text-sm text-red-400">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  {t("Pages.Register.password")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  disabled={isLoading}
                  className="bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400"
                />
                {errors.password && (
                  <p className="text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">
                  {t("Pages.Register.confirmPassword")}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                  className="bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading
                  ? "Creating account..."
                  : t("Pages.Register.createAccount")}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-300">
                  {t("Pages.Register.hasAccount")}{" "}
                </span>
                <Link
                  href="/login"
                  className="font-medium text-blue-400 hover:underline"
                >
                  {t("Pages.Register.signIn")}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
