import { DateDiffCalculator } from "../components";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 sm:p-10">
      <header className="w-full max-w-3xl text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Calcolatore differenza tra date
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          Inserisci due date/ore e ottieni la differenza in giorni, ore, minuti e
          secondi.
        </p>
      </header>

      <main className="w-full mt-6 sm:mt-8">
        <DateDiffCalculator />
      </main>

      <footer className="w-full max-w-3xl mt-10 text-center text-xs text-foreground/60">
        Realizzato con Next.js, React e Tailwind CSS.
      </footer>
    </div>
  );
}
