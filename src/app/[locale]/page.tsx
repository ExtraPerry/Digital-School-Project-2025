import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppleLogo from "@/components/icons/apple-logo";
import GoogleLogo from "@/components/icons/google-logo";
import Navbar from "@/components/navbar";

export default function Home() {
  const t = useTranslations("Pages.Home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t("title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
              {t("subtitle")}
            </p>
            <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold italic">
              &ldquo;{t("motto")}&rdquo;
            </p>
            
            {/* Download Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("download.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {t("download.subtitle")}
              </p>
              <p className="text-base text-blue-600 dark:text-blue-400 font-semibold mb-8">
                {t("download.comingSoon")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-black text-white hover:bg-gray-800 px-8 py-4 h-auto opacity-100 cursor-not-allowed"
                >
                  <AppleLogo className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </Button>
                
                <Button 
                  size="lg" 
                  className="bg-black text-white hover:bg-gray-800 px-8 py-4 h-auto opacity-100 cursor-not-allowed"
                >
                  <GoogleLogo className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero Description */}
        <section className="mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t("hero.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {t("hero.subtitle")}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-400">
              {t("hero.description")}
            </p>
          </div>
        </section>

        {/* How it Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t("services.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <CardTitle className="text-xl">{t("services.step1.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t("services.step1.description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
                </div>
                <CardTitle className="text-xl">{t("services.step2.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t("services.step2.description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <CardTitle className="text-xl">{t("services.step3.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t("services.step3.description")}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">{t("pricing.title")}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {t("pricing.unlock")}
                </div>
                <div className="text-xl text-gray-600 dark:text-gray-300">
                  {t("pricing.perMinute")}
                </div>
                <div className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                  {t("pricing.example")}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Charging Program */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-green-800 dark:text-green-200">
                {t("charging.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                {t("charging.description")}
              </p>
              <p className="text-base text-green-600 dark:text-green-400 font-medium">
                {t("charging.benefits")}
              </p>
            </CardContent>
          </Card>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold mb-2">Zypp</p>
          <p className="text-gray-400">
            Electric mobility for Montpellier • Coming January 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
