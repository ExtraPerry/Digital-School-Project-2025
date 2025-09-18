"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";
import { useUpdateUser } from "@/hooks/use-update-user";
import { Tables } from "@/types/supabase/database.types";
import { toast } from "sonner";

export default function UserSettings() {
  const t = useTranslations("Settings");
  const { data: user } = useAuthenticatedUser() as { 
    data: Tables<"users"> | undefined; 
  };
  const updateUserMutation = useUpdateUser();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!user?.id) {
      toast.error("User ID not found. Please refresh the page and try again.");
      return;
    }

    updateUserMutation.mutate({
      userId: user.id,
      username: formData.username,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      address: formData.address,
    }, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Profile updated successfully!");
          setIsEditing(false);
        } else {
          toast.error(result.error || "Failed to update profile");
        }
      },
      onError: (error) => {
        toast.error("Failed to update profile. Please try again.");
        console.error("Error updating profile:", error);
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{t("personalInfo.title")}</CardTitle>
              <CardDescription>
                {t("personalInfo.description")}
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t("personalInfo.edit")}
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSave}
                  disabled={updateUserMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  {updateUserMutation.isPending ? (
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292zm0 0V1m0 3.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {updateUserMutation.isPending ? "Saving..." : t("personalInfo.save")}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleCancel}
                >
                  {t("personalInfo.cancel")}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{t("personalInfo.username")}</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              disabled={!isEditing}
              placeholder={t("personalInfo.usernamePlaceholder")}
              className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("personalInfo.firstName")}</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("personalInfo.lastName")}</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("personalInfo.email")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("personalInfo.phone")}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
              placeholder={t("personalInfo.phonePlaceholder")}
              className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t("personalInfo.address")}</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={!isEditing}
              placeholder={t("personalInfo.addressPlaceholder")}
              className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{t("preferences.title")}</CardTitle>
          <CardDescription>
            {t("preferences.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t("preferences.pushNotifications")}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t("preferences.pushNotificationsDesc")}</p>
            </div>
            <Button variant="outline" size="sm">
              {t("preferences.enable")}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t("preferences.emailNotifications")}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t("preferences.emailNotificationsDesc")}</p>
            </div>
            <Button variant="outline" size="sm">
              {t("preferences.enabled")}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t("preferences.locationServices")}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t("preferences.locationServicesDesc")}</p>
            </div>
            <Button variant="outline" size="sm">
              {t("preferences.enabled")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="rounded-2xl shadow-lg border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-2xl text-red-600 dark:text-red-400">{t("accountActions.title")}</CardTitle>
          <CardDescription>
            {t("accountActions.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="destructive">
              {t("accountActions.deleteAccount")}
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("accountActions.deleteWarning")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
