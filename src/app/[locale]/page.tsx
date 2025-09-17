import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppleLogo from "@/components/icons/apple-logo";
import GoogleLogo from "@/components/icons/google-logo";
import Navbar from "@/components/navbar";
import Image from "next/image";

export default function Home() {
  const t = useTranslations("Pages.Home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[92svh] flex items-center justify-center text-center pb-28 md:pb-40">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/zy.png"
            alt="Zypp Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Overlay pour lisibilité du texte (radial + linear) */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_80%_at_20%_40%,rgba(2,6,23,.85)_0%,rgba(2,6,23,.55)_50%,rgba(2,6,23,.25)_75%,transparent_100%)]" />
          {/* Fondu bas pour transition harmonieuse */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-b from-transparent to-[rgba(17,24,39,0.85)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-[0_3px_16px_rgba(0,0,0,.35)] max-w-[16ch] mx-auto">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-3">
            {t("subtitle")}
          </p>
          <p className="text-lg text-blue-300 font-semibold italic">
            &ldquo;{t("motto")}&rdquo;
          </p>

          {/* Download Section */}
          <div className="mt-10">
            {/* Badge coming soon (remplace le <p> par un pill plus lisible) */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/90 text-sm font-medium shadow backdrop-blur-[2px]">
              {t("download.comingSoon")}
            </span>

            <h2 className="text-2xl font-bold text-white mt-5 mb-2">
              {t("download.title")}
            </h2>
            <p className="text-lg text-gray-200 mb-6">
              {t("download.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="h-14 rounded-xl bg-black text-white hover:bg-neutral-900 px-7 shadow-lg border border-white/10 transition-transform duration-150 hover:-translate-y-0.5"
              >
                <AppleLogo className="w-6 h-6 mr-3" />
                <div className="text-left leading-tight">
                  <div className="text-[11px] opacity-80">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </Button>

              <Button
                size="lg"
                className="h-14 rounded-xl bg-black text-white hover:bg-neutral-900 px-7 shadow-lg border border-white/10 transition-transform duration-150 hover:-translate-y-0.5"
              >
                <GoogleLogo className="w-6 h-6 mr-3" />
                <div className="text-left leading-tight">
                  <div className="text-[11px] opacity-80">GET IT ON</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content (espacé du hero) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 mt-6 md:mt-12">
        {/* Hero Description */}
        <section className="mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t("hero.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {t("hero.subtitle")}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-400 mb-10">
              {t("hero.description")}
            </p>

            {/* Images grid améliorée (ratio + hover subtil) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { src: "/mtp1.jfif", alt: "Trottinettes en ville" },
                { src: "/mtp4.jfif", alt: "Stationnement en zone autorisée" },
                { src: "/mtp2.jfif", alt: "Application Zypp" },
              ].map((img) => (
                <div
                  key={img.src}
                  className="group relative w-full overflow-hidden rounded-2xl shadow-lg border border-black/5"
                >
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="services" className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t("services.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center rounded-2xl shadow-lg">
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

            <Card className="text-center rounded-2xl shadow-lg">
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

            <Card className="text-center rounded-2xl shadow-lg">
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
        <section id="pricing" className="mb-16">
          <Card className="max-w-2xl mx-auto rounded-2xl shadow-lg">
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
        <section id="charging" className="mb-16">
          <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
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
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Zypp</p>
            <p className="text-gray-400">
              Electric mobility for Montpellier • Coming January 2025
            </p>
          </div>

          {/* CGU condensées + menu déroulant (10 articles) */}
          <div className="text-xs text-gray-400 max-w-5xl mx-auto leading-relaxed text-justify">
            <h3 className="font-semibold text-white mb-2 text-center">
              Conditions Générales d’Utilisation (CGU)
            </h3>

            {/* Résumé court */}
            <div className="space-y-2 mb-3">
              <p>
                L’usage de l’app Zypp est réservé aux 18+ avec compte et moyen de paiement enregistré.
                Service : trottinettes en libre-service 24h/24 à Montpellier (1000 unités).
              </p>
              <p>
                Tarifs : 1€ déverrouillage + 0,15€/min (ex. 15 min = 3,25€). Paiement via l’app.
              </p>
              <p>
                Obligations : respecter le Code de la route, stationner en zone autorisée, verrouiller en fin de trajet.
                Interdit : passager, prêt de compte, sortie des zones.
              </p>
              <p>
                Responsabilités : l’utilisateur est responsable durant le trajet (perte/vol/dégradations à sa charge).
                Zypp assure entretien & recharge (21h–6h) selon disponibilité.
              </p>
              <p>
                Données : traitement RGPD (droits d’accès/rectif/supp/portabilité) – DPO : contact@dpo.com.
              </p>
            </div>

            {/* Détails complets */}
            <details className="mt-2">
              <summary className="cursor-pointer text-white font-medium">
                Voir les CGU complètes (10 articles)
              </summary>
              <div className="mt-3 space-y-2">
                <ol className="list-decimal list-inside space-y-2">
                  <li><span className="font-semibold">Article 1 – Objet :</span> définit les modalités et conditions d’accès et d’utilisation du service de location de trottinettes proposé par Zypp via l’application mobile.</li>
                  <li><span className="font-semibold">Article 2 – Définitions :</span> <span className="underline">Utilisateur</span> : personne utilisant l’app pour louer une trottinette ; <span className="underline">Service</span> : mise à disposition 24h/24 à Montpellier (1000 trottinettes) ; <span className="underline">Trajet</span> : du déverrouillage au verrouillage via l’app.</li>
                  <li><span className="font-semibold">Article 3 – Accès au service :</span> appli sur smartphone compatible ; création d’un compte avec informations exactes ; âge minimum 18 ans ; moyens de paiement acceptés (carte, etc.).</li>
                  <li><span className="font-semibold">Article 4 – Tarifs :</span> 1€ pour déverrouiller, puis 0,15€/min ; exemple : 15 min = 3,25€ ; paiement via l’app sur le moyen enregistré.</li>
                  <li><span className="font-semibold">Article 5 – Utilisation du service :</span> respect du Code de la route et de la réglementation locale ; stationnement uniquement dans les zones autorisées (affichées dans l’app) ; obligation de verrouiller la trottinette en fin de trajet ; interdictions : transporter un passager, prêter son compte, sortir des zones autorisées.</li>
                  <li><span className="font-semibold">Article 6 – Responsabilités :</span> <span className="underline">Utilisateur</span> : responsable du véhicule durant le trajet, frais en cas de perte/vol/dégradations ; <span className="underline">Zypp</span> : entretien et recharge chaque nuit (21h–6h), fourniture du service sous réserve de disponibilité, responsabilité civile professionnelle couverte par Allianz.</li>
                  <li><span className="font-semibold">Article 7 – Suspension / résiliation :</span> Zypp peut suspendre ou supprimer un compte en cas de fraude, non-paiement, usage abusif ou non-respect des CGU.</li>
                  <li><span className="font-semibold">Article 8 – Données personnelles :</span> responsable de traitement : Zypp ; finalités : gestion des comptes, facturation, géolocalisation pour l’usage du service ; droits RGPD (accès, rectification, suppression, portabilité) ; contact DPO : contact@dpo.com.</li>
                  <li><span className="font-semibold">Article 9 – Propriété intellectuelle :</span> application, logo, textes et visuels protégés ; toute reproduction non autorisée est interdite.</li>
                  <li><span className="font-semibold">Article 10 – Droit applicable :</span> droit français ; en cas de litige, compétence exclusive des tribunaux de Montpellier.</li>
                </ol>
              </div>
            </details>
          </div>
        </div>
      </footer>
    </div>
  );
}
