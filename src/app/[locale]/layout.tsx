import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { ReactQueryClientProvider } from "@/app/contexts/react-query-provider";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-roboto",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${roboto.className} font-roboto antialiased`}>
        <ReactQueryClientProvider>
          <NextIntlClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
          </NextIntlClientProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
