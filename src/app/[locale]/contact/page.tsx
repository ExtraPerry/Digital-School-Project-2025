import type { Metadata } from "next";
import Navbar from "../../../components/navbar"; // adapte si besoin

export const metadata: Metadata = {
  title: "Contact | Zypp",
  description: "Contactez-nous pour un devis ou toute demande.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0A1A2F] text-blue-100 px-6 py-16 flex items-center justify-center">
        <div className="max-w-3xl w-full space-y-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Contactez-nous</h1>
            <p className="text-lg text-blue-200">
              Une question, un projet ou besoin d’assistance ? Notre équipe est là pour vous aider.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Adresse */}
            <div className="rounded-lg bg-white/5 p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">📍 Adresse</h2>
              <p className="text-blue-200">
                2 rue du Faubourg Saint-Honoré <br />
                34000 Montpellier, France
              </p>
            </div>

            {/* Téléphone */}
            <div className="rounded-lg bg-white/5 p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">📞 Téléphone</h2>
              <p className="text-blue-200">+33 (0)4 67 12 34 56</p>
            </div>

            {/* Email */}
            <div className="rounded-lg bg-white/5 p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">✉️ Email</h2>
              <p>
                <a
                  href="mailto:contact@zyppmobility.com"
                  className="text-blue-400 hover:text-blue-500 underline"
                >
                  contact@zyppmobility.com
                </a>
              </p>
            </div>

            {/* Horaires */}
            <div className="rounded-lg bg-white/5 p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">🕒 Horaires</h2>
              <ul className="text-blue-200 space-y-1">
                <li>Lundi – Vendredi : 9h00 – 18h00</li>
                <li>Samedi : 10h00 – 14h00</li>
                <li>Dimanche : Fermé</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
