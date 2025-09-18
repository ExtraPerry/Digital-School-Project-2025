"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";
import logout from "@/lib/supabase/auth/logout";
import { Tables } from "@/types/supabase/database.types";
import Image from "next/image";

export default function Navbar() {
  const t = useTranslations("Pages");
  const router = useRouter();
  const { data: user, isLoading } = useAuthenticatedUser() as {
    data: Tables<"users"> | undefined;
    isLoading: boolean;
  };

  const handleLogin = () => {
    router.push("/login"); // ✅ uniquement pour le bouton "Se connecter"
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Brand */}
          <div className="flex items-center space-x-2">
            <Image
              src="/zypplogo.svg"
              alt="Zypp Logo"
              width={65}
              height={65}
              className="rounded-md"
              priority
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              
            </h1>

            {/* Liens navigation (publiques, pas besoin d’être loggé) */}
            <div className="ml-8 flex space-x-6">
              <Link
                href="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
              >
                À propos
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right side - Auth */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">
                  Welcome, {user?.first_name || user?.username || user?.email || "User"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t("Login.signIn")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
