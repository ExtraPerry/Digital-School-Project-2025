"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("CookieBanner");

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem("cookie-consent");
    if (!cookieChoice) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl bg-background/95 backdrop-blur-sm border shadow-lg">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">
                {t("title")}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAcceptAll}
                  variant="default"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  {t("acceptAll")}
                </Button>
                <Button
                  onClick={handleAcceptNecessary}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  {t("acceptNecessary")}
                </Button>
              </div>
            </div>
            <Button
              onClick={handleAcceptNecessary}
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8"
              aria-label={t("close")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
