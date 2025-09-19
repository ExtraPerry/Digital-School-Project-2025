"use client";

import { useTranslations } from "next-intl";
import Navbar from "../../../components/navbar"; // adapte si besoin

export default function ContactPage() {
  const t = useTranslations("Pages.Contact");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0A1A2F] text-blue-100 px-6 py-16 flex items-center justify-center">
        <div className="max-w-3xl w-full space-y-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">{t("title")}</h1>
            <p className="text-lg text-blue-200">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Adresse */}
            <div className="rounded-lg bg-white/5 p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">{t("address.title")}</h2>
              <p className="text-blue-200">
                {t("address.value").split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < t("address.value").split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>

            {/* Téléphone */}
            <div className="rounded-lg bg-white/5 p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">{t("phone.title")}</h2>
              <p className="text-blue-200">{t("phone.value")}</p>
            </div>

            {/* Email */}
            <div className="rounded-lg bg-white/5 p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">{t("email.title")}</h2>
              <p>
                <a
                  href="mailto:contact@zyppmobility.com"
                  className="text-blue-400 hover:text-blue-500 underline"
                >
                  {t("email.value")}
                </a>
              </p>
            </div>

            {/* Horaires */}
            <div className="rounded-lg bg-white/5 p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">{t("hours.title")}</h2>
              <ul className="text-blue-200 space-y-1">
                <li>{t("hours.weekdays")}</li>
                <li>{t("hours.saturday")}</li>
                <li>{t("hours.sunday")}</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
