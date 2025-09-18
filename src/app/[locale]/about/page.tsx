import type { Metadata } from "next";
import Navbar from "../../../components/navbar"; // ✅ chemin relatif correct

export const metadata: Metadata = {
  title: "À propos | Zypp",
  description: "Zypp réinvente la mobilité urbaine à Montpellier.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0A1A2F] text-blue-100">
        <section className="mx-auto max-w-5xl px-6 py-16 space-y-6">
          <h1 className="text-4xl font-bold text-white">À propos</h1>

          <p className="leading-relaxed">
            Chez Zypp Mobilty, nous croyons qu’il est temps de repenser la mobilité urbaine.
          </p>

          <p className="leading-relaxed">
            <strong>Notre mission</strong> : offrir à tous les habitants de Montpellier
            un moyen de transport simple, rapide et écologique grâce à un service de
            trottinettes électriques disponibles 24h/24 et sans borne d’attache.
          </p>

          <p className="leading-relaxed">
            Dès <strong>janvier 2025</strong>, un parc de <strong>1000 trottinettes</strong> sera déployé dans la
            ville, accessible <strong>à partir de 1&nbsp;€</strong>, directement depuis votre smartphone.
            Une fois votre trajet terminé, il vous suffira de déposer la trottinette
            dans une zone dédiée et de la verrouiller via l’application.
          </p>

          <p className="leading-relaxed">
            Parce que nous pensons aussi à l’avenir de notre planète, nous avons
            mis en place un système intelligent de recharge et d’entretien, réalisé la
            nuit. Nous collaborons également avec des particuliers qui souhaitent
            participer à l’aventure en rechargeant les trottinettes chez eux, en
            échange d’une rémunération ou de réductions.
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white mb-3">Notre ambition</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Rendre la mobilité urbaine plus <strong>pratique</strong></li>
              <li>La rendre plus <strong>abordable</strong></li>
              <li>Et durable pour la <strong>planète</strong></li>
            </ul>
          </div>

          <p className="leading-relaxed text-white">
            Avec Zypp Mobility, <strong>la liberté se prend en un clic</strong>.
          </p>
        </section>
      </main>
    </>
  );
}
