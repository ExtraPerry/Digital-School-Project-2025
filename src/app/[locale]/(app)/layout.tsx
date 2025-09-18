"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";
import { Tables } from "@/types/supabase/database.types";
import Navbar from "@/components/navbar";
import { useRouter } from "@/i18n/navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("UserApp");
  const router = useRouter();
  const { data: user, isLoading } = useAuthenticatedUser() as { 
    data: Tables<"users"> | undefined; 
    isLoading: boolean; 
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 bg-blue-600 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {(user?.username?.[0] || user?.first_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
              </span>
            </div>
             <div>
               <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                 {t("welcome", {  name: user?.username || user?.first_name || user?.username || "User" })}
               </h1>
               <p className="text-lg text-gray-600 dark:text-gray-300">
                 {t("subtitle")}
               </p>
             </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="mb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
