import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { href: "#jak-pomagam", label: "Jak pomagam" },
  { href: "#oferta", label: "Oferta" },
  { href: "#proces", label: "Proces" },
  { href: "#o-mnie", label: "O mnie" },
  { href: "#opinie", label: "Opinie" },
  { href: "#wiedza", label: "Wiedza" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontakt", label: "Kontakt" },
];

function useInView<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Section({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("relative scroll-mt-20", className)}>
      {children}
    </section>
  );
}

function FadeIn({ children, className, delay = 0, direction = "up" }: { children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "down" | "left" | "right" }) {
  const { ref, visible } = useInView<HTMLDivElement>();
  const translate = { up: "translate-y-8", down: "-translate-y-8", left: "translate-x-8", right: "-translate-x-8" };
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("transition-all duration-700 ease-out will-change-transform", visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${translate[direction]}`, className)}
    >
      {children}
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-teal-200/60 bg-teal-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800 backdrop-blur-sm", className)}>
      {children}
    </span>
  );
}

function Button({ children, href, variant = "primary", className, onClick, type = "button" }: { children: React.ReactNode; href?: string; variant?: "primary" | "secondary" | "outline"; className?: string; onClick?: () => void; type?: "button" | "submit" }) {
  const base = "inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-200/50 focus-visible:ring-4 active:scale-[0.98]";
  const styles = {
    primary: "bg-teal-700 text-white shadow-lg shadow-teal-900/15 hover:bg-teal-800 hover:shadow-xl",
    secondary: "bg-slate-900 text-white shadow-lg shadow-slate-900/15 hover:bg-slate-800",
    outline: "border-2 border-slate-200 bg-white/80 text-slate-700 hover:border-teal-300 hover:text-teal-800 hover:bg-teal-50/50 backdrop-blur-sm",
  };
  const combined = cn(base, styles[variant], className);
  if (href) return <a href={href} className={combined}>{children}</a>;
  return <button type={type} onClick={onClick} className={combined}>{children}</button>;
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Ocena ${rating} na 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={cn("h-4 w-4", i < rating ? "text-amber-400" : "text-slate-200")} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function AISnippet({ question, short, children }: { question: string; short: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white p-6 my-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">Odpowiedź dla wyszukiwarek AI</p>
      <h4 className="text-lg font-bold text-slate-900 mb-2">{question}</h4>
      <p className="font-semibold text-teal-800 mb-3">{short}</p>
      <div className="text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}

function ConnectionVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = rect.top + window.scrollY - windowHeight;
      const end = rect.bottom + window.scrollY - windowHeight * 0.3;
      const p = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const distance = 200 - progress * 180;
  const lineOpacity = progress;
  const scale = 0.9 + progress * 0.1;
  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-75" style={{ width: `${distance + 140}px`, transform: `translate(-50%, -50%) scale(${scale})` }}>
        <svg viewBox="0 0 400 200" className="h-auto w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="figureGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={progress > 0.5 ? "#0d9488" : "#64748b"} />
              <stop offset="100%" stopColor={progress > 0.5 ? "#14b8a6" : "#64748b"} />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <line x1="60" y1="100" x2="340" y2="100" stroke="#14b8a6" strokeWidth="2" strokeDasharray="6 4" opacity={lineOpacity * 0.6} />
          <path d={`M ${200 - distance / 2 - 18} 138 Q ${200 - distance / 2} 165 ${200 - distance / 2 + 18} 138`} fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" opacity={lineOpacity} />
          <path d={`M ${200 + distance / 2 - 18} 138 Q ${200 + distance / 2} 165 ${200 + distance / 2 + 18} 138`} fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" opacity={lineOpacity} />
          {progress > 0.8 && (
            <path d="M 170 100 L 185 100 M 215 100 L 230 100" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" opacity={(progress - 0.8) * 5}>
              <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
            </path>
          )}
        </svg>
      </div>
    </div>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
      <a href="#main-content" className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform focus:translate-y-0">Przejdź do treści</a>

      <header className={cn("fixed left-0 right-0 top-0 z-50 transition-all duration-300", scrolled ? "bg-white/95 py-2.5 shadow-sm backdrop-blur-xl" : "bg-transparent py-5")}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 rounded-lg">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-lg text-white shadow-md">🤝</span>
            <div className="leading-tight">
              <span className="block text-sm font-bold tracking-tight text-slate-900">Terapia Par</span>
              <span className="block text-xs font-medium text-teal-700">Gdańsk · Sopot · Gdynia</span>
            </div>
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Główna nawigacja">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">{link.label}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href="tel:+48512345678" className="text-sm font-semibold text-slate-700 hover:text-teal-800">+48 512 345 678</a>
            <Button href="#kontakt">Umów spotkanie</Button>
          </div>

          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              {mobileOpen ? <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /> : <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div id="mobile-menu" className="border-t border-slate-100 bg-white px-6 pb-6 pt-4 shadow-lg lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobilna nawigacja">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-800">{link.label}</a>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
              <a href="tel:+48512345678" className="text-base font-semibold text-slate-700">+48 512 345 678</a>
              <Button href="#kontakt" onClick={() => setMobileOpen(false)}>Umów spotkanie</Button>
            </div>
          </div>
        )}
      </header>

      <main id="main-content">
        <Section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-24 pb-20">
          <div className="absolute inset-0 bg-gradient-to-b from-teal-50/80 via-white to-slate-50" />
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#0f766e_1px,transparent_1px)] [background-size:20px_20px]" />
          <ConnectionVisual />

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center lg:px-8">
            <FadeIn><Badge>Terapia par · Gdańsk · Online w całej Polsce</Badge></FadeIn>

            <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
              Odbudujmy bliskość,
              <br />
              <span className="bg-gradient-to-r from-teal-700 to-teal-500 bg-clip-text text-transparent">która się zatraciła</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              Profesjonalna <strong className="text-slate-900"><a href="#oferta" className="hover:text-teal-700 transition-colors">terapia par w Gdańsku</a></strong> oraz <strong className="text-slate-900"><a href="#oferta" className="hover:text-teal-700 transition-colors">terapia online dla par</a></strong> z całej Polski. Pomagam partnerom ponownie usłyszeć siebie nawzajem, przezwyciężyć kryzys i odzyskać poczucie bezpieczeństwa w związku.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="#kontakt">🗓️ Bezpłatna konsultacja 15 min</Button>
              <Button href="#jak-pomagam" variant="outline">Dowiedz się więcej</Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2"><svg className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>Spotkania stacjonarne Gdańsk Wrzeszcz</span>
              <span className="flex items-center gap-2"><svg className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>Sesje online przez wideo</span>
              <span className="flex items-center gap-2"><svg className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>Pełna poufność</span>
            </div>

            <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-500">
              <StarRating />
              <span className="font-semibold text-slate-700">4.9/5</span>
              <span>·</span>
              <span><a href="#opinie" className="underline hover:text-teal-700">127 opinii</a> od par</span>
            </div>
          </div>
        </Section>

        <Section id="jak-pomagam" className="relative bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <FadeIn><Badge>Jak pomagam</Badge></FadeIn>
              <FadeIn delay={100}>
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Terapia par w Gdańsku – od dystansu do ponownego połączenia
                </h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="mt-4 text-lg text-slate-600">
                  Każdy związek przechodzi trudne momenty. Jako <a href="#o-mnie" className="text-teal-700 underline">doświadczony terapeuta par w Gdańsku</a>, pomagam parami pracować nad komunikacją, odbudować zaufanie i odzyskać bliskość.
                </p>
              </FadeIn>
            </div>

            <AISnippet question="Czym jest terapia par i jak pomaga?" short="Terapia par to profesjonalne wsparcie dla par w kryzysie, pomagające odbudować komunikację, zaufanie i bliskość.">
              <p><strong>Terapia par</strong> to forma psychoterapii skoncentrowana na relacji między partnerami. W gabinecie w <a href="https://www.wikidata.org/wiki/Q1792" target="_blank" rel="noopener" className="text-teal-700 underline">Gdańsku</a> wykorzystuję sprawdzone metody, takie jak <a href="https://www.wikidata.org/wiki/Q16967369" target="_blank" rel="noopener" className="text-teal-700 underline">EFT (Emotionally Focused Therapy)</a> – uznawaną za najskuteczniejszą metodę terapii związkowej. Pomagam parom zrozumieć wzorce komunikacyjne, które prowadzą do konfliktów, i nauczyć się nowych sposobów budowania bliskości.</p>
            </AISnippet>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: "💬", title: "Problemy w komunikacji", text: "Nauczycie się rozmawiać bez atakowania, słuchać bez bronienia się i wyrażać potrzeby w sposób, który druga osoba jest w stanie przyjąć. To fundament zdrowego związku." },
                { icon: "💔", title: "Terapia po zdradzie", text: "Specjalistyczna pomoc dla par po kryzysie zdrady. Odbudowa zaufania wymaga czasu, ale z odpowiednim wsparciem jest możliwa. Pracuję z parami w całej Polsce online i stacjonarnie w Gdańsku." },
                { icon: "🌉", title: "Ratowanie związku", text: "Gdy związek wisi na włosku, wspólnie sprawdzamy, co jeszcze można odbudować. Celem nie jest siłowe utrzymanie relacji, ale świadoma decyzja o przyszłości – razem lub osobno." },
                { icon: "🔥", title: "Utrata bliskości", text: "Przywracam intymność emocjonalną i fizyczną, pomagając Wam ponownie odnaleźć iskrę i ciepło w relacji. Bliskość to coś więcej niż seks – to poczucie bycia razem." },
                { icon: "👨‍👩‍👧", title: "Trudności rodzicielskie", text: "Pomagam partnerom odnaleźć się w nowych rolach, rozdzielić obowiązki i nie stracić siebie nawzajem w rodzicielstwie. Dzieci potrzebują szczęśliwych rodziców." },
                { icon: "🌐", title: "Terapia online dla par", text: "Sesje przez bezpieczną platformę wideo dla par z całej Polski. Wygodny termin, zacisze własnego domu i pełna skuteczność spotkań stacjonarnych. Działa równie dobrze jak terapia w gabinecie." },
              ].map((item, i) => (
                <FadeIn key={item.title} delay={i * 100}>
                  <article className="group relative h-full rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:bg-white hover:shadow-xl">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm ring-1 ring-slate-100 group-hover:ring-teal-200">{item.icon}</div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-slate-600 leading-relaxed text-sm">{item.text}</p>
                  </article>
                </FadeIn>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-slate-600">Niezależnie od tego, czy mieszkacie w <a href="#kontakt" className="text-teal-700 underline font-semibold">Gdańsku</a>, <a href="#kontakt" className="text-teal-700 underline font-semibold">Sopocie</a>, <a href="#kontakt" className="text-teal-700 underline font-semibold">Gdyni</a> czy gdziekolwiek indziej w Polsce – mogę Wam pomóc. <a href="#oferta" className="text-teal-700 underline font-semibold">Sprawdź moją ofertę →</a></p>
            </div>
          </div>
        </Section>

        <Section id="oferta" className="relative overflow-hidden bg-slate-900 py-24 text-white lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950" />
          <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-teal-600/10 blur-3xl" />
          <div className="absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-teal-400/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <FadeIn><Badge className="border-teal-400/30 bg-teal-900/40 text-teal-200">Oferta</Badge></FadeIn>
              <FadeIn delay={100}>
                <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                  Terapia dla par i małżeńska dopasowana do Waszych potrzeb
                </h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="mt-4 text-lg text-slate-300">
                  Oferuję indywidualne podejście do każdej pary. Sesje dostępne w gabinecie w Gdańsku (Wrzeszcz) oraz online dla par z całej Polski.
                </p>
              </FadeIn>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {[
                { title: "Pierwsza konsultacja", detail: "Individually tailored plan — contact for details.", features: ["Krótka rozmowa wstępna", "Omówienie trudności", "Dobór formy pracy", "Bez zobowiązań"], cta: "Dowiedz się więcej", highlighted: false },
                { title: "Sesja terapii par", detail: "Individually tailored plan — contact for details.", features: ["Praca nad komunikacją", "Rozwiązywanie konfliktów", "Sesje w gabinecie Gdańsk", "Materiały i prace domowe"], cta: "Dowiedz się więcej", highlighted: true },
                { title: "Terapia online dla par", detail: "Individually tailored plan — contact for details.", features: ["Sesje przez bezpieczny wideo", "Elastyczne terminy", "Dla par z całej Polski", "Poufność i komfort"], cta: "Dowiedz się więcej", highlighted: false },
              ].map((plan, i) => (
                <FadeIn key={plan.title} delay={i * 100}>
                  <article className={cn("relative flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1", plan.highlighted ? "bg-gradient-to-b from-teal-700 to-teal-900 shadow-2xl shadow-teal-950/40 ring-1 ring-teal-400/30" : "border border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:border-teal-500/30")}>
                    {plan.highlighted && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-400 px-3 py-1 text-xs font-bold text-teal-950">Najczęściej wybierana</span>}
                    <h3 className="text-xl font-bold">{plan.title}</h3>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-lg font-semibold leading-snug text-slate-100">{plan.detail}</span>
                    </div>
                    <ul className="mt-6 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-slate-200">
                          <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button href="#kontakt" variant={plan.highlighted ? "primary" : "outline"} className={cn("mt-8 w-full", !plan.highlighted && "border-slate-600 text-white hover:bg-slate-700 hover:text-white")}>{plan.cta}</Button>
                  </article>
                </FadeIn>
              ))}
            </div>

          </div>
        </Section>

        <Section id="proces" className="relative bg-slate-50 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <FadeIn><Badge>Proces terapii</Badge></FadeIn>
              <FadeIn delay={100}>
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Droga od oddalenia do ponownego zbliżenia
                </h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="mt-4 text-lg text-slate-600">
                  Terapia to proces, nie jednorazowa rada. Stopniowa odbudowa relacji w bezpiecznej przestrzeni.
                </p>
              </FadeIn>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              {[
                { step: "01", title: "Kontakt", text: "Napisz, zadzwoń lub umów się online. Odpowiadam w ciągu 24h.", id: "krok1" },
                { step: "02", title: "Konsultacja", text: "Bezpłatna rozmowa 15 min – poznaję Waszą sytuację bez zobowiązań.", id: "krok2" },
                { step: "03", title: "Diagnoza", text: "Pierwsze spotkanie 75-90 min – poznaję historię związku i cele.", id: "krok3" },
                { step: "04", title: "Praca", text: "Regularne sesje – nowe wzorce komunikacji i budowanie bliskości.", id: "krok4" },
                { step: "05", title: "Zmiana", text: "Wprowadzacie zmiany do życia. Utrwalamy efekty i planujemy przyszłość.", id: "krok5" },
              ].map((item, i) => (
                <FadeIn key={item.title} delay={i * 100}>
                  <article id={item.id} className="relative h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:shadow-lg">
                    <span className="text-4xl font-extrabold text-teal-100">{item.step}</span>
                    <h3 className="mt-3 text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.text}</p>
                  </article>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={500}>
              <div className="mt-12 rounded-2xl bg-teal-50 p-6 text-center">
                <p className="text-slate-700"><strong>TL;DR:</strong> Proces terapii trwa 3-12 miesięcy. Zaczynamy od bezpłatnej konsultacji, potem diagnoza, regularne sesje i wprowadzanie zmian do codziennego życia. <a href="#kontakt" className="text-teal-700 underline font-semibold">Zacznij od pierwszego kroku →</a></p>
              </div>
            </FadeIn>
          </div>
        </Section>

        <Section id="o-mnie" className="relative bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <FadeIn direction="left">
                <div className="relative">
                  <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-100 to-slate-100 shadow-2xl shadow-slate-900/10">
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-center p-8">
                        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white text-6xl shadow-lg mb-6">👩‍⚕️</div>
                        <p className="text-sm font-medium text-slate-500">Anna Kowalska</p>
                        <p className="text-xs text-slate-400 mt-1">Psychoterapeuta Par i Małżeństw</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-teal-700 p-5 text-white shadow-xl lg:block">
                    <p className="text-3xl font-extrabold">10+</p>
                    <p className="text-sm text-teal-100">lat doświadczenia</p>
                  </div>
                </div>
              </FadeIn>

              <div>
                <FadeIn><Badge>O mnie</Badge></FadeIn>
                <FadeIn delay={100}>
                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Anna Kowalska – Twój terapeuta par w Gdańsku
                  </h2>
                </FadeIn>
                <FadeIn delay={200}>
                  <p className="mt-4 text-lg text-slate-600">
                    Jestem <strong className="text-slate-900">certyfikowanym psychoterapeutą par</strong> z wieloletnim doświadczeniem w pracy z parami i małżeństwami. Specjalizuję się w terapii EFT, terapii po zdradzie i ratowaniu związków.
                  </p>
                </FadeIn>
                <FadeIn delay={300}>
                  <p className="mt-4 text-slate-600 leading-relaxed">
                    Ukończyłam psychologię na <a href="https://ug.edu.pl" target="_blank" rel="noopener" className="text-teal-700 underline">Uniwersytecie Gdańskim</a> oraz podyplomowe studium psychoterapii w <a href="https://www.psychoterapia.org.pl" target="_blank" rel="noopener" className="text-teal-700 underline">Polskim Towarzystwie Psychoterapii</a>. Regularnie podnoszę kwalifikacje uczestnicząc w szkoleniach i superwizjach u międzynarodowych ekspertów.
                  </p>
                </FadeIn>

                <FadeIn delay={400}>
                  <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
                    <h4 className="font-bold text-slate-900 mb-4">Dlaczego możesz mi zaufać?</h4>
                    <ul className="space-y-3">
                      {[
                        "✓ Certyfikowany Psychoterapeuta – Polskie Towarzystwo Psychoterapii",
                        "✓ Specjalista Terapii Par i Małżeństw z certyfikatem EFT",
                        "✓ 10 lat praktyki i ponad 1200 przeprowadzonych sesji",
                        "✓ Stała superwizja u międzynarodowych ekspertów",
                        "✓ Członek Polskiego Towarzystwa Terapii Par",
                      ].map((cred) => (
                        <li key={cred} className="flex items-start gap-2 text-sm text-slate-700">
                          {cred}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>

                <FadeIn delay={500}>
                  <div className="mt-6 flex gap-3">
                    <a href="https://www.linkedin.com/in/anna-kowalska-terapeuta" target="_blank" rel="noopener" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">LinkedIn</a>
                    <a href="https://www.psychoterapia.org.pl/terapeuci/anna-kowalska" target="_blank" rel="noopener" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">Profil PTP</a>
                  </div>
                </FadeIn>

                <FadeIn delay={600}>
                  <div className="mt-8">
                    <Button href="#kontakt">Porozmawiajmy o Twoim związku</Button>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </Section>

        <Section className="relative overflow-hidden bg-teal-700 py-20 text-white lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-900" />
          <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-teal-400/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "10+", label: "lat praktyki terapeutycznej" },
                { value: "1200+", label: "przeprowadzonych sesji" },
                { value: "92%", label: "par deklaruje poprawę" },
                { value: "4,9/5", label: "średnia ocena w Google" },
              ].map((stat) => (
                <FadeIn key={stat.label}>
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                    <p className="text-4xl font-extrabold">{stat.value}</p>
                    <p className="mt-1 text-teal-100">{stat.label}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </Section>

        <Section id="opinie" className="relative bg-slate-50 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <FadeIn><Badge>Opinie</Badge></FadeIn>
              <FadeIn delay={100}>
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Co mówią pary po terapii w Gdańsku
                </h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="mt-4 text-lg text-slate-600">
                  Wysłuchane historie, zmienione relacje i odzyskana nadzieja. Opinie par, które podjęły decyzję o wspólnej pracy.
                </p>
              </FadeIn>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Anna i Piotr", location: "Gdańsk", text: "Byliśmy na etapie rozstania. Terapia pomogła nam usłyszeć to, co do siebie czujemy, ale nie potrafiliśmy nazwać. Dziś jesteśmy bliżej niż kiedykolwiek." },
                { name: "Marta i Kamil", location: "Online, Warszawa", text: "Sesje online były dla nas zbawieniem. Mieszkamy w Warszawie, a jakość pracy była na najwyższym poziomie. Polecam każdej parze w kryzysie." },
                { name: "Joanna i Tomasz", location: "Sopot", text: "Po zdradzie nie wierzyliśmy, że da się jeszcze cokolwiek uratować. Dzięki terapii nauczyliśmy się na nowo ufać sobie nawzajem." },
                { name: "Kasia i Michał", location: "Gdynia", text: "Nasz problem to była ciągła kłótnia o błahostki. Terapeuta nauczył nas, jak rozmawiać, żeby się nie ranić. Nasz dom znów jest spokojny." },
                { name: "Natalia i Adam", location: "Online, Kraków", text: "Po narodzinach dziecka straciliśmy siebie. Terapia pomogła nam odnaleźć rolę partnerów obok roli rodziców." },
                { name: "Zofia i Jan", location: "Gdańsk", text: "Początkowo szliśmy na terapię, żeby sprawdzić, czy warto być razem. Dziś wiemy, że warto. Dziękujemy za profesjonalizm i ciepło." },
              ].map((review, i) => (
                <FadeIn key={review.name} delay={i * 100}>
                  <article className="h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:shadow-lg">
                    <StarRating />
                    <p className="mt-4 text-slate-700 leading-relaxed text-sm">"{review.text}"</p>
                    <footer className="mt-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">{review.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{review.name}</p>
                        <p className="text-xs text-slate-500">{review.location}</p>
                      </div>
                    </footer>
                  </article>
                </FadeIn>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a href="https://www.google.com/maps/place/Gdańsk,+Abrahama+20" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800">
                Zobacz wszystkie 127 opinii na Google Maps
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
        </Section>

        <Section id="wiedza" className="relative bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <FadeIn><Badge>Wiedza</Badge></FadeIn>
            <FadeIn delay={100}>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Kompletny przewodnik po terapii par w Gdańsku i online
              </h2>
            </FadeIn>

            <AISnippet question="Ile kosztuje terapia par w Gdańsku?" short="Koszt terapii ustalany jest indywidualnie podczas bezpłatnej konsultacji.">
              <p>Koszt terapii ustalany jest indywidualnie podczas bezpłatnej konsultacji.</p>
            </AISnippet>

            <FadeIn delay={200}>
              <div className="prose prose-slate mt-8 max-w-none">
                <p className="lead">
                  <strong>Terapia par w Gdańsku</strong> to jedna z najskuteczniejszych form wsparcia dla par przeżywających kryzys, konflikty lub utratę bliskości. Wartościową alternatywą jest <strong>terapia online dla par</strong>, dostępna dla mieszkańców całej Polski. W tym przewodniku znajdziesz kompleksowe informacje o terapii małżeńskiej, psychoterapii związkowej i wsparciu dla par w Gdańsku, Sopocie, Gdyni i online.
                </p>

                <h3>Czym jest terapia par i komu może pomóc?</h3>
                <p>
                  <a href="https://www.wikidata.org/wiki/Q1800293" target="_blank" rel="noopener" className="text-teal-700 underline">Terapia par</a> to forma psychoterapii skoncentrowana na relacji między partnerami. Jej celem nie jest wskazanie, kto ma rację, ale zrozumienie wzajemnych wzorców komunikacyjnych, emocjonalnych i behawioralnych prowadzących do dystansu.
                </p>
                <p>
                  <strong>Terapia dla par w Gdańsku</strong> może pomóc w sytuacjach takich jak: chroniczne kłótnie, brak intymności, zdrada, różnice w wychowaniu dzieci, problemy finansowe, stres zawodowy przenoszący się na związek, trudności seksualne oraz decyzja o pozostaniu razem lub rozstaniu.
                </p>

                <h3>Terapia małżeńska Gdańsk – różnice i podobieństwa</h3>
                <p>
                  Terminy "terapia małżeńska Gdańsk" i "terapia par" są często używane zamiennie. <a href="https://www.wikidata.org/wiki/Q6770004" target="_blank" rel="noopener" className="text-teal-700 underline">Terapia małżeńska</a> koncentruje się na specyfice relacji małżeńskiej, w tym na długofalowych wzorach, roli małżonka oraz wyzwaniach związanych z wieloletnim pożyciem. W praktyce dobry <a href="#o-mnie" className="text-teal-700 underline">terapeuta par w Gdańsku</a> dostosowuje metodę pracy do indywidualnej sytuacji pary.
                </p>

                <h3>Jak wygląda proces terapeutyczny?</h3>
                <p>
                  Proces rozpoczyna się od <a href="#proces" className="text-teal-700 underline">konsultacji wstępnej</a>, podczas której terapeuta poznaje historię związku i obecne trudności. Następnie odbywają się regularne sesje, podczas których para uczy się nowych sposobów komunikacji i rozwiązywania konfliktów bez eskalacji.
                </p>
                <p>
                  W terapii stosuję sprawdzone podejścia: <a href="https://www.wikidata.org/wiki/Q16967369" target="_blank" rel="noopener" className="text-teal-700 underline">Terapię Skoncentrowaną na Emocjach (EFT)</a>, terapię systemową, elementy terapii poznawczo-behawioralnej oraz narzędzia komunikacyjne oparte na dialogu. Wiele badań sugeruje, że EFT może być skuteczna dla wielu par.
                </p>

                <h3>Terapia po zdradzie – czy można odbudować zaufanie?</h3>
                <p>
                  <strong>Terapia po zdradzie</strong> nie polega na "zamiataniu problemu pod dywan", lecz na uczciwym przyjrzeniu się temu, co się wydarzyło. Osoba zdradzona potrzebuje przestrzeni na emocje, a osoba, która zdradziła, musi wziąć odpowiedzialność za swoje działania.
                </p>
                <p>
                  Dzięki profesjonalnemu wsparciu możliwa jest odbudowa zaufania, choć wymaga to czasu (zazwyczaj 6-12 miesięcy), konsekwencji i zaangażowania obojga partnerów. Nie każda para decyduje się na kontynuację związku, ale terapia pomaga podjąć tę decyzję świadomie i zminimalizować krzywdę.
                </p>

                <h3>Problemy w związku – wczesne sygnały</h3>
                <p>
                  Wiele par czeka z terapią do momentu, gdy relacja jest mocno nadszarpnięta. Tymczasem wczesne sygnały, takie jak unikanie trudnych rozmów, rosnące rozczarowanie, brak fizycznej bliskości czy permanentne poczucie samotności w związku, warto adresować jak najszybciej. Im wcześniej para zacznie pracować nad zmianą, tym większe szanse na trwałą poprawę.
                </p>

                <h3>Ratowanie związku czy rozstanie?</h3>
                <p>
                  <strong>Ratowanie związku</strong> nie oznacza siłowego utrzymania relacji za wszelką cenę. Celem terapii jest pomoc w podjęciu świadomej decyzji o przyszłości – czy to wspólne odbudowanie relacji, czy godne, pełne szacunku rozstanie, szczególnie gdy są dzieci.
                </p>

                <h3>Terapia komunikacji w związku</h3>
                <p>
                  Komunikacja jest fundamentem każdej bliskiej relacji. W <strong>terapii komunikacji</strong> uczycie się mówić o potrzebach bez oskarżania, słuchać bez przerywania, rozpoznawać emocje pod powierzchnią gniewu oraz reagować na potrzeby drugiej osoby. Te umiejętności przekładają się na poczucie bliskości i bezpieczeństwa.
                </p>

                <h3>Psychoterapia par Gdańsk – dlaczego warto?</h3>
                <p>
                  <a href="https://www.wikidata.org/wiki/Q1792" target="_blank" rel="noopener" className="text-teal-700 underline">Gdańsk</a> to miasto z rozwiniętą siecią specjalistycznej pomocy psychologicznej. Wybierając <strong>psychoterapię par Gdańsk</strong>, możecie liczyć na pracę z wykwalifikowanym terapeutą stosującym międzynarodowe standardy. Dla mieszkańców Trójmiasta dostępna jest terapia stacjonarna, a dla par z innych miast – <a href="#oferta" className="text-teal-700 underline">terapia online</a>.
                </p>

                <h3>Terapia online dla par – nowoczesna forma wsparcia</h3>
                <p>
                  <strong>Terapia online dla par</strong> to coraz popularniejsza forma pracy nad relacją. Sprawdza się u par mieszkających w różnych miastach, mających ograniczony czas lub preferujących komfort własnego domu. Metaanalizy pokazują, że efektywność terapii online jest porównywalna do sesji stacjonarnych.
                </p>

                <div className="rounded-2xl bg-teal-50 p-6 my-8">
                  <p className="font-semibold text-teal-900 mb-2">TL;DR – Podsumowanie</p>
                  <p className="text-slate-700 text-sm">
                    Terapia par w Gdańsku to forma wsparcia dla par przeżywających trudności w relacji. Dostępna stacjonarnie w Gdańsku/Trójmieście oraz online w całej Polsce. Wiele badań sugeruje, że może być skuteczna dla wielu par. Pierwsza konsultacja bezpłatna. Skontaktuj się, aby rozpocząć zmianę.
                  </p>
                </div>

                <p>
                  Jeśli szukasz <strong>terapeuty par w Gdańsku</strong> lub chcesz rozpocząć <a href="#oferta" className="text-teal-700 underline font-semibold">terapię online dla par</a>, zapraszam do <a href="#kontakt" className="text-teal-700 underline font-semibold">kontaktu</a>. Wspólnie możemy stworzyć przestrzeń, w której Wasz związek odzyska równowagę, bliskość i sens.
                </p>
              </div>
            </FadeIn>
          </div>
        </Section>

        <Section id="faq" className="relative bg-slate-50 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <FadeIn><Badge>FAQ</Badge></FadeIn>
              <FadeIn delay={100}>
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Najczęściej zadawane pytania o terapię par
                </h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="mt-4 text-lg text-slate-600">
                  Odpowiedzi na pytania, które najczęściej zadają pary przed rozpoczęciem terapii w Gdańsku lub online.
                </p>
              </FadeIn>
            </div>

            <div className="mt-16 space-y-3">
              {[
                { q: "Ile trwa terapia par w Gdańsku?", a: "Terapia par trwa zazwyczaj od 3 do 12 miesięcy, w zależności od zaawansowania problemów. Spotkania odbywają się raz w tygodniu i trwają 60 minut. W kryzysowych sytuacjach możliwe są sesje 90-minutowe lub dwa razy w tygodniu." },
                { q: "Czy terapia par jest skuteczna?", a: "Wiele badań sugeruje, że terapia par może być skuteczna dla wielu par. Sukces zależy od zaangażowania obojga partnerów i kompetencji terapeuty." },
                { q: "Jak wygląda pierwsza wizyta u terapeuty par?", a: "Pierwsza wizyta to spotkanie diagnostyczne 75-90 min. Poznaję historię związku, trudności, cele i oczekiwania. Omawiamy zasady współpracy, częstotliwość spotkań i metodę pracy (głównie EFT)." },
                { q: "Czy oferujesz terapię par online?", a: "Tak, terapia online dostępna dla par z całej Polski. Sesje przez Zoom/Google Meet. Jest równie skuteczna jak stacjonarna – potwierdzają to badania naukowe. Idealna dla par w różnych miastach." },
                { q: "Jak przygotować się do terapii małżeńskiej?", a: "Przyjdźcie z otwartością i gotowością do rozmowy. Warto przemyśleć: jakie obszary wymagają zmiany, jakie cele chcecie osiągnąć, co jest najważniejsze. Nie musicie mieć wszystkiego zaplanowanego." },
                { q: "Czy terapię par można odbywać samemu?", a: "Najlepsze efekty daje wspólne uczestnictwo. Czasem jedna osoba zaczyna indywidualnie, by przygotować się do wspólnych sesji. Zmiana jednej osoby często prowadzi do zmiany dynamiki związku." },
                { q: "Jakie problemy można rozwiązać w terapii?", a: "Komunikacja, konflikty, brak bliskości, zdrada, różnice w oczekiwaniach, trudności seksualne, stres rodzicielski, problemy finansowe, decyzja o byciu razem lub rozstaniu." },
                { q: "Czy terapia po zdradzie może uratować związek?", a: "Tak, może pomóc zrozumieć przyczyny, przeprocesować emocje i odbudować zaufanie. Sukces zależy od gotowości obojga do pracy. Nie każda para kontynuuje, ale terapia pomaga podjąć decyzję świadomie." },
                { q: "Jak często odbywają się spotkania?", a: "Standardowo raz w tygodniu. W kryzysie – dwa razy. W późniejszej fazie – raz na dwa tygodnie. Regularność jest kluczowa dla utrzymania dynamiki zmian." },
                { q: "Czy terapia par jest poufna?", a: "Tak, terapeuta ma obowiązek zachowania poufności. Wyjątkiem są sytuacje przewidziane prawem (zagrożenie życia). Każdy partner może mieć indywidualną rozmowę w ramach terapii par." },
                { q: "Ile kosztuje terapia par w Gdańsku?", a: "Koszt terapii ustalany jest indywidualnie podczas bezpłatnej konsultacji." },
                { q: "Czy terapia online jest równie skuteczna?", a: "Wiele badań sugeruje, że terapia online może być równie skuteczna jak tradycyjna. Warunkiem jest zapewnienie poufności, stabilne połączenie i komfortowa przestrzeń podczas sesji." },
                { q: "Czy na terapię mogą przyjść narzeczeni?", a: "Tak, terapia jest dla wszystkich par niezależnie od statusu: małżeństwa, narzeczeni, związki nieformalne, pary jednopłciowe. Ważne jest zaangażowanie emocjonalne, nie formalny status." },
                { q: "Co zrobić gdy partner nie chce iść na terapię?", a: "Rozmowa o znaczeniu terapii, propozycja jednorazowej konsultacji bez zobowiązań, lub rozpoczęcie pracy indywidualnej nad relacją. Zmiana jednej osoby często inspiruje drugą." },
                { q: "Jakie metody terapii stosujesz?", a: "Głównie EFT (Emotionally Focused Therapy) – najskuteczniejsza metoda. Elementy terapii systemowej, Terapii Schematu dla par, narzędzia Dialogu Imago. Dobieram metodę do potrzeb pary." },
                { q: "Czy terapia pomoże podjąć decyzję o rozstaniu?", a: "Tak, celem nie jest siłowe ratowanie związku, lecz świadoma decyzja. Czasem to odbudowa relacji, czasem wsparcie w godnym rozstaniu – szczególnie gdy są dzieci." },
                { q: "Gdzie odbywają się spotkania w Gdańsku?", a: "Gabinet w dzielnicy Wrzeszcz, ul. Abrahama 20/3. Dobre połączenie komunikacyjne, blisko tramwaje i autobusy. Parking w pobliżu. Łatwy dojazd z Sopotu i Gdyni." },
                { q: "Czy oferujesz terapię w języku angielskim?", a: "Tak, sesje dostępne w języku angielskim. Przydatne dla par mieszanych narodowościowo lub mieszkających za granicą. Proszę o wcześniejszą informację przy zapisie." },
                { q: "Czy można odwołać wizytę?", a: "Tak, bez kosztów do 24h przed spotkaniem. Późniejsze odwołanie lub nieobecność = opłata pełna, gdyż termin mógłby być wykorzystany przez inną parę." },
                { q: "Czy terapia jest refundowana przez NFZ?", a: "Prywatne gabinety zazwyczaj nie współpracują z NFZ." },
                { q: "Jak długo trwa jedna sesja?", a: "Standardowo 60 minut. W kryzysie – 90 minut. Pierwsza sesja diagnostyczna 75-90 minut, by dokładnie poznać sytuację pary i ustalić cele." },
                { q: "Czy terapia jest odpowiednia dla par LGBTQ+?", a: "Tak, terapia otwarta dla wszystkich par niezależnie od orientacji czy tożsamości płciowej. Bezpieczna, wolna od dyskryminacji przestrzeń. Doświadczenie w pracy z parami jednopłciowymi." },
                { q: "Co jeśli emocje będą zbyt silne?", a: "Terapeuta jest przeszkolony do pracy z silnymi emocjami. W EFT bezpieczeństwo emocjonalne jest priorytetem. Czasem silne emocje są potrzebne do zmiany, ale zawsze w bezpieczny sposób." },
                { q: "Czy terapia może pomóc w życiu seksualnym?", a: "Tak, odbudowa bliskości emocjonalnej to fundament satysfakcji seksualnej. Pracuję nad komunikacją o potrzebach. W razie specyficznych problemów kieruję do seksuologów." },
                { q: "Jakie są pierwsze efekty terapii?", a: "Zmniejszenie napięcia, większa otwartość w rozmowach, lepsze rozumienie perspektywy partnera. Trwałe zmiany wymagają 3-6 miesięcy, ale pierwsze sygnały pojawiają się po 3-4 sesjach." },
                { q: "Czy terapia par to mediacja?", a: "Nie. Mediacja koncentruje się na konkretnym sporze. Terapia par skupia się na emocjach, wzorcach relacyjnych i głębokiej zmianie. Terapeuta nie jest sędziem – wspiera oboje partnerów." },
                { q: "Czy mogę porozmawiać przed pierwszą wizytą?", a: "Tak, oferuję bezpłatną 15-min konsultację telefoniczną lub online. Możesz zadać pytania o metodę, terminy, czy wyjaśnić sytuację. Bez zobowiązań." },
                { q: "Czy terapia jest tylko dla związków w kryzysie?", a: "Nie, terapia służy również profilaktyce, rozwojowi komunikacji i pogłębianiu bliskości. Coraz więcej par traktuje terapię jako inwestycję w relację, jak siłownia dla zdrowia fizycznego." },
                { q: "Co przygotować przed pierwszą wizytą?", a: "Nie trzeba dokumentów. Warto przemyśleć: historię związku, obecne trudności, wcześniejsze próby rozwiązania, cele terapii. To pomoże nam skuteczniej pracować." },
                { q: "Czy terapia jest dostępna w weekendy?", a: "Tak, spotkania w soboty 10:00-14:00. Terminy weekendowe popularne – zalecam rezerwację z 2-3 tygodniowym wyprzedzeniem." },
                { q: "Czy terapeuta może przepisać leki?", a: "Psychoterapeuta nie przepisuje leków. W razie potrzeby farmakoterapii kieruję do współpracujących psychiatrów. Współpraca terapeuty i psychiatry zapewnia kompleksową opiekę." },
                { q: "Czy terapia par może odbywać się z terapią indywidualną?", a: "Tak, często zalecam wsparcie indywidualne obok terapii par, gdy jeden partner zmaga się z osobistymi trudnościami (trauma, depresja). Ważna koordynacja obu terapii." },
                { q: "Jak zapisać się na terapię par w Gdańsku?", a: "Formularz na stronie, telefon +48 512 345 678, email kontakt@terapiapargdansk.pl. Odpowiadam w ciągu 24h." },
                { q: "Czy oferujesz warsztaty dla par?", a: "Obecnie koncentruję się na pracy indywidualnej z parami w formie terapii." },
                { q: "Czy terapia online wymaga specjalnego oprogramowania?", a: "Nie, używam Zoom lub Google Meet. Wystarczy komputer/smartfon z kamerą i mikrofonem. Przed pierwszą sesją wysyłam instrukcję i link." },
                { q: "Czy będziemy mieć prace domowe?", a: "Tak, często zalecam proste ćwiczenia lub obserwacje między sesjami. Pomagają utrwalić nowe wzorce w codziennym życiu. Nie są oceniane – służą rozwojowi." },
                { q: "Co sprawia, że terapia jest skuteczna?", a: "Zaangażowanie obojga partnerów, otwartość na zmianę, regularność spotkań, dobry kontakt z terapeutą (alians terapeutyczny) oraz praktykowanie nowych umiejętności między sesjami." },
                { q: "Czy mogę napisać maila z pytaniem?", a: "Oczywiście, kontakt@terapiapargdansk.pl. Odpowiadam na pytania o terapię, terminy, metody. Czas odpowiedzi: 24h w dni robocze." },
                { q: "Czy terapia jest odpowiednia po wielu latach małżeństwa?", a: "Tak, terapia pomaga na każdym etapie – również po wielu latach. Wieloletnie pożycie często prowadzi do rutyny i utraty bliskości, które można odnowić." },
                { q: "Jakie są najczęstsze błędy w komunikacji?", a: "Krytykowanie zamiast mówienia o potrzebach, brak aktywnego słuchania, pogardliwy ton, defensywność, wycofywanie się z rozmów (stonewalling), porównywanie do innych." },
                { q: "Czy terapia może pomóc przy problemach z rodziną?", a: "Tak, trudności z teściami, rodziną pochodzenia, wychowaniem dzieci wpływają na relację. Pracujemy nad wspólnym stanowiskiem, granicami, decyzjami wychowawczymi." },
                { q: "Czy terapia działa jeśli tylko jedno chce zmian?", a: "Tak, zmiana możliwa nawet gdy początkowo tylko jedna osoba jest gotowa. Zmiana jednego prowadzi do zmiany dynamiki związku i często inspiruje partnera do dołączenia." },
              ].map((item, i) => (
                <FadeIn key={i} delay={(i % 5) * 50}>
                  <details className="group rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all open:border-teal-200 open:shadow-md">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-left font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 rounded-lg">
                      <span className="pr-4">{item.q}</span>
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-open:bg-teal-100 group-open:text-teal-800">
                        <svg className="h-4 w-4 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </span>
                    </summary>
                    <p className="mt-4 text-slate-600 leading-relaxed text-sm">{item.a}</p>
                  </details>
                </FadeIn>
              ))}
            </div>
          </div>
        </Section>

        <Section id="kontakt" className="relative overflow-hidden bg-slate-900 py-24 text-white lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950" />
          <div className="absolute -left-20 top-20 h-[500px] w-[500px] rounded-full bg-teal-600/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <FadeIn><Badge className="border-teal-400/30 bg-teal-900/40 text-teal-200">Kontakt</Badge></FadeIn>
                <FadeIn delay={100}>
                  <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                    Zacznij od pierwszego kroku
                  </h2>
                </FadeIn>
                <FadeIn delay={200}>
                  <p className="mt-4 text-lg text-slate-300">
                    Niech pierwsza rozmowa będzie najłatwiejszym krokiem. Napisz, zadzwoń lub wypełnij formularz. <strong>Odpowiadam w ciągu 24 godzin.</strong>
                  </p>
                </FadeIn>

                <FadeIn delay={300}>
                  <div className="mt-10 space-y-4">
                    <a href="tel:+48512345678" className="flex items-center gap-4 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700 text-xl">📞</span>
                      <div>
                        <p className="text-sm text-slate-400">Telefon</p>
                        <p className="text-lg font-semibold">+48 512 345 678</p>
                        <p className="text-xs text-slate-500">Dostępny pon-pt 9:00-20:00</p>
                      </div>
                    </a>
                    <a href="mailto:kontakt@terapiapargdansk.pl" className="flex items-center gap-4 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700 text-xl">✉️</span>
                      <div>
                        <p className="text-sm text-slate-400">Email</p>
                        <p className="text-lg font-semibold">kontakt@terapiapargdansk.pl</p>
                        <p className="text-xs text-slate-500">Odpowiedź w 24h</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-4 rounded-xl bg-white/5 p-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700 text-xl">📍</span>
                      <div>
                        <p className="text-sm text-slate-400">Gabinet Gdańsk Wrzeszcz</p>
                        <p className="text-lg font-semibold">ul. Abrahama 20/3, 80-171 Gdańsk</p>
                        <p className="text-xs text-slate-500">Dobry dojazd z Sopotu i Gdyni</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={400}>
                  <div className="mt-8 rounded-xl bg-white/5 p-5">
                    <h4 className="font-semibold mb-3">Godziny otwarcia</h4>
                    <div className="space-y-1 text-sm text-slate-300">
                      <div className="flex justify-between"><span>Poniedziałek - Czwartek</span><span>9:00 - 20:00</span></div>
                      <div className="flex justify-between"><span>Piątek</span><span>9:00 - 18:00</span></div>
                      <div className="flex justify-between"><span>Sobota</span><span>10:00 - 14:00</span></div>
                      <div className="flex justify-between text-slate-500"><span>Niedziela</span><span>Zamknięte</span></div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={500}>
                  <div className="mt-6">
                    <a href="https://www.google.com/maps/place/Gdańsk,+Abrahama+20" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300">
                      Zobacz na Google Maps
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </a>
                  </div>
                </FadeIn>
              </div>

              <FadeIn delay={200} direction="right">
                {formSuccess ? (
                  <div className="rounded-2xl bg-teal-50 p-8 text-slate-800 text-center h-full flex flex-col items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-3xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-slate-900">Dziękuję za wiadomość!</h3>
                    <p className="mt-2 text-slate-600">Odpowiem w ciągu 24 godzin. Sprawdź swoją skrzynkę email.</p>
                    <Button onClick={() => setFormSuccess(false)} variant="outline" className="mt-6">Wyślij kolejną wiadomość</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 text-slate-800 shadow-2xl sm:p-8">
                    <h3 className="text-xl font-bold text-slate-900">Umów bezpłatną konsultację</h3>
                    <p className="mt-2 text-sm text-slate-500">Wypełnij formularz, a skontaktuję się z Tobą, aby ustalić dogodny termin. Bez zobowiązań.</p>

                    <div className="mt-6 grid gap-4">
                      <div>
                        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">Imię i nazwisko *</label>
                        <input id="name" type="text" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100" placeholder="Twoje imię i nazwisko" />
                      </div>
                      <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Adres email *</label>
                        <input id="email" type="email" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100" placeholder="twoj@email.pl" />
                      </div>
                      <div>
                        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">Telefon</label>
                        <input id="phone" type="tel" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100" placeholder="+48 123 456 789" />
                      </div>
                      <div>
                        <label htmlFor="topic" className="mb-1.5 block text-sm font-medium text-slate-700">Temat</label>
                        <select id="topic" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100">
                          <option>Terapia par stacjonarna Gdańsk</option>
                          <option>Terapia online dla par</option>
                          <option>Terapia po zdradzie</option>
                          <option>Ratowanie związku</option>
                          <option>Problemy w komunikacji</option>
                          <option>Inny temat</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">Wiadomość</label>
                        <textarea id="message" rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100" placeholder="Opisz krótko sytuację lub zadaj pytanie..." />
                      </div>
                      <div className="flex items-start gap-3">
                        <input id="consent" type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500" />
                        <label htmlFor="consent" className="text-xs text-slate-500">Wyrażam zgodę na przetwarzanie moich danych osobowych w celu odpowiedzi na zapytanie. Administratorem danych jest Gabinet Terapii Par Gdańsk. <a href="#" className="text-teal-700 underline">Polityka prywatności</a>.</label>
                      </div>
                      <Button type="submit" className="w-full">Wyślij zapytanie</Button>
                      <p className="text-center text-xs text-slate-400">✓ Odpowiadam w ciągu 24h · Bezpłatna konsultacja 15 min</p>
                    </div>
                  </form>
                )}
              </FadeIn>
            </div>
          </div>
        </Section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12" role="contentinfo">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <a href="#" className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-lg text-white shadow-md">🤝</span>
                <div>
                  <span className="block text-sm font-bold text-slate-900">Terapia Par Gdańsk</span>
                  <span className="block text-xs text-slate-500">Anna Kowalska</span>
                </div>
              </a>
              <p className="mt-4 text-sm text-slate-500">
                Profesjonalna terapia par, terapia małżeńska i psychoterapia związkowa w Gdańsku (Wrzeszcz) oraz online dla par z całej Polski.
              </p>
              <div className="mt-4 flex gap-2">
                <a href="https://www.facebook.com/terapiapargdansk" target="_blank" rel="noopener" className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 transition-colors" aria-label="Facebook">📘</a>
                <a href="https://www.instagram.com/terapiapargdansk" target="_blank" rel="noopener" className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 transition-colors" aria-label="Instagram">📸</a>
                <a href="https://www.linkedin.com/in/anna-kowalska-terapeuta" target="_blank" rel="noopener" className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 transition-colors" aria-label="LinkedIn">💼</a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">Nawigacja</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {NAV_LINKS.slice(0, 4).map((link) => (
                  <li key={link.href}><a href={link.href} className="hover:text-teal-700">{link.label}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">Oferta</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li><a href="#oferta" className="hover:text-teal-700">Terapia par Gdańsk</a></li>
                <li><a href="#oferta" className="hover:text-teal-700">Terapia małżeńska</a></li>
                <li><a href="#oferta" className="hover:text-teal-700">Terapia online dla par</a></li>
                <li><a href="#oferta" className="hover:text-teal-700">Terapia po zdradzie</a></li>
                <li><a href="#oferta" className="hover:text-teal-700">Ratowanie związku</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">Kontakt</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>ul. Abrahama 20/3</li>
                <li>80-171 Gdańsk (Wrzeszcz)</li>
                <li><a href="tel:+48512345678" className="hover:text-teal-700 font-semibold">+48 512 345 678</a></li>
                <li><a href="mailto:kontakt@terapiapargdansk.pl" className="hover:text-teal-700">kontakt@terapiapargdansk.pl</a></li>
                <li className="pt-2 text-xs text-slate-400">Pon-pt: 9:00-20:00<br/>Sob: 10:00-14:00</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Gabinet Terapii Par Gdańsk. Wszelkie prawa zastrzeżone.
            </p>
            <div className="flex gap-4 text-sm text-slate-500">
              <a href="#" className="hover:text-teal-700">Polityka prywatności</a>
              <a href="#" className="hover:text-teal-700">Regulamin</a>
              <a href="#" className="hover:text-teal-700">Mapa strony</a>
            </div>
          </div>
        </div>
      </footer>

      <a href="#kontakt" className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-xl transition-transform hover:scale-105 lg:hidden">
        <span>📅</span>
        <span>Umów wizytę</span>
      </a>
    </div>
  );
}
