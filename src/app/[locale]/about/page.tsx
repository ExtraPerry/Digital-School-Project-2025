"use client";

import { useTranslations } from "next-intl";
import Navbar from "../../../components/navbar"; // ✅ chemin relatif correct

export default function AboutPage() {
  const t = useTranslations("Pages.About");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0A1A2F] text-blue-100">
        <section className="mx-auto max-w-5xl px-6 py-16 space-y-6">
          <h1 className="text-4xl font-bold text-white">{t("title")}</h1>

          <p className="leading-relaxed">
            {t("subtitle")}
          </p>

          <p className="leading-relaxed">
            <strong>{t("mission.title")}</strong> : {t("mission.description")}
          </p>

          <p className="leading-relaxed">
            Dès <strong>{t("launch.date")}</strong>, un parc de <strong>{t("launch.fleet")}</strong> sera déployé dans la
            ville, accessible <strong>{t("launch.price")}</strong>, directement depuis votre smartphone.
            {t("launch.description")}
          </p>

          <p className="leading-relaxed">
            {t("sustainability.description")}
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white mb-3">{t("ambition.title")}</h2>
            <ul className="list-disc pl-6 space-y-2">
              {t.raw("ambition.goals").map((goal: string, index: number) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>
          </div>

          <p className="leading-relaxed text-white">
            {t("conclusion")}
          </p>
        </section>
      </main>
    </>
  );
}
