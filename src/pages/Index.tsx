import { useState } from "react";
import portraitImage from "@/assets/portrait.jpg";
import banner1 from "@/assets/banner1.jpg";
import banner2 from "@/assets/banner2.jpg";
import banner3 from "@/assets/banner3.jpg";
import banner4 from "@/assets/banner4.jpg";

const LINKS = {
  anual: "https://pay.hotmart.com/S105668941Q",
  mensal: "https://pay.hotmart.com/S105668941Q?off=oicxzour",
};

const FAQ_ITEMS = [
  {
    q: "O Forjados é um curso?",
    a: "Não. Ele tem conteúdos gravados, mas funciona como uma comunidade com cadência semanal, áudios diários em dias úteis, casos reais e ferramentas práticas.",
  },
  {
    q: "Preciso assistir ao vivo?",
    a: "Não. As entregas principais são gravadas para você consumir no seu ritmo.",
  },
  {
    q: "Não tenho tempo. Faz sentido para mim?",
    a: "Sim, porque a estrutura foi feita para ser leve: conteúdos de 15 a 25 minutos e áudios de até 3 minutos com dicas aplicáveis.",
  },
  {
    q: "Serve para quem está começando?",
    a: "Sim. Principalmente se você quer evitar construir tudo no improviso.",
  },
  {
    q: "Serve para quem já tem empresa?",
    a: "Sim. Principalmente se a empresa depende demais de você.",
  },
  {
    q: "Como funciona o WhatsApp?",
    a: "Os grupos são organizados para evitar barulho. A ideia não é ter conversa infinita. É receber direção e aplicar.",
  },
  {
    q: "Posso cancelar?",
    a: "Sim. O cancelamento segue as regras da plataforma de pagamento.",
  },
  {
    q: "O preço vai mudar?",
    a: "Sim. O preço de fundador fica disponível por 48 horas. Depois, o mensal passa para R$ 37/mês.",
  },
];

const CTAButton = ({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={
      variant === "primary"
        ? "inline-block w-full sm:w-auto px-8 py-4 text-center font-bold text-base uppercase tracking-wider rounded bg-primary text-primary-foreground hover:brightness-110 transition-all duration-200 shadow-lg"
        : "inline-block w-full sm:w-auto px-8 py-4 text-center font-bold text-base uppercase tracking-wider rounded border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
    }
  >
    {children}
  </a>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">
    {children}
  </span>
);

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-background text-foreground font-sans overflow-x-hidden">

      {/* ── 1. HERO ── */}
      <section className="relative min-h-screen flex flex-col">
        {/* Logo bar */}
        <div className="relative z-20 px-6 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary font-black text-2xl tracking-tight leading-none">F</span>
            <span className="text-foreground font-black text-xl tracking-widest uppercase leading-none">ORJADOS</span>
          </div>
        </div>

        {/* Hero photo */}
        <div className="absolute inset-0 z-0">
          <img
            src={portraitImage}
            alt="Guilherme Cristofore"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(14,17,23,0.3) 0%, rgba(14,17,23,0.5) 50%, rgba(14,17,23,0.95) 100%)" }} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col justify-end px-6 pb-14 sm:pb-20 max-w-2xl mx-auto w-full">
          <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-4">
            Pare de ser o maior funcionário da sua própria empresa.
          </h1>
          <p className="text-base sm:text-xl text-foreground/80 mb-8 leading-relaxed">
            Entre nos Forjados e construa uma liderança que aguenta o tranco, tira você do apaga-incêndio e faz a operação andar sem depender de você em tudo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <CTAButton href={LINKS.anual}>Quero ficar livre do operacional</CTAButton>
          </div>
          <p className="mt-3 text-xs text-primary font-semibold uppercase tracking-widest">Preço de fundador liberado!</p>
        </div>
      </section>

      {/* ── 2. DOR PRINCIPAL ── */}
      <section className="px-6 py-16 sm:py-24 max-w-3xl mx-auto">
        <SectionLabel>O problema</SectionLabel>
        <h2 className="text-2xl sm:text-4xl font-black mb-6 leading-tight">
          Se tudo volta para você, a empresa ainda está nas suas costas.
        </h2>
        <div className="relative rounded-xl overflow-hidden mb-8">
          <img src={banner2} alt="Dono sobrecarregado" className="w-full h-56 sm:h-80 object-cover object-top" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(14,17,23,0.8) 0%, transparent 60%)" }} />
        </div>
        <div className="space-y-4 text-base sm:text-lg text-foreground/80 leading-relaxed">
          <p>Você decide tudo. Resolve tudo. Cobra tudo. Refaz tudo.</p>
          <p>Quando alguém erra, você entra.<br />Quando o cliente chama, você entra.<br />Quando a operação trava, você entra.</p>
          <p className="text-foreground font-semibold">E no fim do dia ainda tenta chamar isso de empreender.</p>
        </div>
      </section>

      {/* ── 3. VIRADA ── */}
      <section className="bg-card px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>A virada</SectionLabel>
          <h2 className="text-2xl sm:text-4xl font-black mb-6 leading-tight">
            Quem improvisa, paga.
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-foreground/80 leading-relaxed mb-10">
            <p>O problema não é trabalhar muito.</p>
            <p>O problema é <span className="text-foreground font-semibold">sua presença ter virado o processo.</span></p>
            <p>Toda decisão empurrada vira incêndio.<br />Toda conversa evitada vira problema.<br />Toda delegação mal feita volta para o seu colo.</p>
          </div>
          <CTAButton href={LINKS.anual}>Quero parar de improvisar</CTAButton>
        </div>
      </section>

      {/* ── 4. ANTES E DEPOIS ── */}
      <section className="px-6 py-16 sm:py-24 max-w-4xl mx-auto">
        <SectionLabel>Transformação</SectionLabel>
        <h2 className="text-2xl sm:text-4xl font-black mb-10 leading-tight">
          De dono no improviso para dono forjado.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-card border border-border/40 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4">Dono no improviso</div>
            <ul className="space-y-3">
              {[
                "Decide no susto.",
                "Cobra no grito ou tarde demais.",
                "Centraliza porque \"ninguém faz direito\".",
                "Vive apagando incêndio.",
                "Confunde movimento com crescimento.",
                "Tem time, mas continua sendo o gargalo.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/60">
                  <span className="text-destructive mt-0.5 shrink-0">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-primary/10 border border-primary/40 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Dono forjado</div>
            <ul className="space-y-3">
              {[
                "Decide com critério.",
                "Comunica o que espera e o que cobra.",
                "Delega com clareza.",
                "Resolve a causa, não só o fogo.",
                "Cria processo simples.",
                "Lidera sem precisar estar em tudo.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                  <span className="text-primary mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 5. APRESENTAÇÃO ── */}
      <section className="bg-card px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>A comunidade</SectionLabel>
          <h2 className="text-2xl sm:text-4xl font-black mb-6 leading-tight">
            Conheça os Forjados.
          </h2>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-4">
            Uma comunidade de construção de liderança para quem tem ou quer ter um negócio e decidiu parar de ser apagador de incêndio.
          </p>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-4">
            Aqui não tem guru em palco, teoria bonita ou grupo barulhento.
          </p>
          <p className="text-base sm:text-lg text-foreground font-semibold leading-relaxed mb-10">
            É o Guilherme Cristofore mostrando, na prática, o que funcionou, o que quebrou e o que ele faria diferente para construir uma liderança de verdade.
          </p>
          <CTAButton href={LINKS.anual}>Entrar nos Forjados</CTAButton>
        </div>
      </section>

      {/* ── 6. MOVIMENTO ── */}
      <section className="relative min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={banner3} alt="Guilherme Cristofore" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: "rgba(14,17,23,0.75)" }} />
        </div>
        <div className="relative z-10 px-6 py-20 max-w-3xl mx-auto text-center w-full">
          <h2 className="text-2xl sm:text-4xl font-black mb-6 leading-tight">
            Menos empresário-herói.<br />Mais dono de verdade.
          </h2>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-xl mx-auto">
            O Forjados não existe para romantizar o caos. Existe para reunir gente que cansou de carregar tudo sozinha e decidiu construir empresa com mais clareza, processo e liderança.
          </p>
          <p className="mt-4 text-base sm:text-lg text-foreground font-semibold">
            Não é sobre ter o negócio perfeito.<br />É sobre parar de esperar permissão e começar a fazer melhor que perfeito.
          </p>
        </div>
      </section>

      {/* ── 7. O QUE VOCÊ RECEBE ── */}
      <section className="px-6 py-16 sm:py-24 max-w-4xl mx-auto">
        <SectionLabel>O que está incluso</SectionLabel>
        <h2 className="text-2xl sm:text-4xl font-black mb-10 leading-tight">
          Um ritmo simples para você construir liderança toda semana.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              title: "Forjado da Semana",
              desc: "1 conteúdo gravado por semana, de 15 a 25 minutos, para resolver situações reais de liderança, delegação, decisão e operação.",
              icon: "📹",
            },
            {
              title: "Brasa do Dia",
              desc: "Áudios curtos, direto no WhatsApp, com uma provocação ou ferramenta rápida para o dia do dono.",
              icon: "🔥",
            },
            {
              title: "Caso na Bigorna",
              desc: "Uma vez por mês, o Guilherme disseca ao vivo um caso real de membro: empresa real, problema real, caminho real.",
              icon: "⚒️",
            },
            {
              title: "Templates Anti-Caos",
              desc: "7 ferramentas práticas para delegação, feedback, onboarding, decisão, reunião e organização da operação.",
              icon: "📋",
            },
          ].map((card) => (
            <div key={card.title} className="bg-card border border-border/40 rounded-xl p-6">
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="font-black text-lg mb-2 text-primary">{card.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. POR QUE FUNCIONA ── */}
      <section className="bg-card px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>O método</SectionLabel>
          <h2 className="text-2xl sm:text-4xl font-black mb-10 leading-tight">
            A Forja Anti-Caos.
          </h2>
          <p className="text-base sm:text-lg text-foreground/80 mb-10">O Forjados tira você do improviso em 3 movimentos:</p>
          <div className="space-y-6">
            {[
              { num: "01", title: "Liderar melhor", desc: "Comunicar, cobrar, decidir e parar de estar presente em tudo." },
              { num: "02", title: "Resolver o que ficou para trás", desc: "Olhar para buracos financeiros, operacionais e de gente sem fingir que eles não existem." },
              { num: "03", title: "Construir de verdade", desc: "Criar processo, delegar com clareza e montar uma operação que não depende do grito." },
            ].map((step) => (
              <div key={step.num} className="flex gap-5 items-start">
                <span className="text-4xl font-black text-primary/30 leading-none shrink-0 w-12">{step.num}</span>
                <div>
                  <h3 className="font-black text-lg mb-1">{step.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. PRIMEIROS PASSOS ── */}
      <section className="px-6 py-16 sm:py-24 max-w-3xl mx-auto">
        <SectionLabel>Primeiros passos</SectionLabel>
        <h2 className="text-2xl sm:text-4xl font-black mb-4 leading-tight">
          Você não entra para ficar perdido.
        </h2>
        <p className="text-base text-foreground/70 mb-10">No primeiro acesso, você já sabe por onde começar:</p>
        <div className="space-y-4 mb-8">
          {[
            "Entra na área de membros",
            "Recebe os Templates Anti-Caos",
            "Acompanha a primeira Brasa do Dia",
            "Assiste ao Forjado da Semana",
            "Escolhe um ponto da operação para ajustar primeiro",
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-black shrink-0">{i + 1}</span>
              <span className="text-base text-foreground/80">{step}</span>
            </div>
          ))}
        </div>
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
          <p className="text-base font-semibold text-primary italic">
            "O objetivo não é consumir mais conteúdo. É tirar peso das suas costas."
          </p>
        </div>
      </section>

      {/* ── 10. PARA QUEM É ── */}
      <section className="bg-card px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Para quem é</SectionLabel>
          <h2 className="text-2xl sm:text-4xl font-black mb-8 leading-tight">
            É para você se...
          </h2>
          <ul className="space-y-4">
            {[
              "Está começando e quer construir certo desde o início.",
              "Está recomeçando depois de um erro, uma sociedade ruim ou um negócio que não foi.",
              "Já tem empresa, mas ainda carrega tudo sozinho.",
              "Vive apagando incêndio e quer virar dono de verdade.",
              "Quer liderar melhor sem cair em papo corporativo vazio.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-primary text-xl shrink-0 mt-0.5">✓</span>
                <span className="text-base text-foreground/80 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 11. PARA QUEM NÃO É ── */}
      <section className="px-6 py-16 sm:py-24 max-w-3xl mx-auto">
        <div className="bg-foreground/5 border border-border/30 rounded-2xl p-8 sm:p-12">
          <SectionLabel>Para quem não é</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-black mb-6 leading-tight">
            Não entre se você quer só assistir conteúdo.
          </h2>
          <div className="space-y-3 text-base text-foreground/70 leading-relaxed mb-6">
            <p>O Forjados não é para quem quer terceirizar responsabilidade.</p>
            <p>Não é para quem quer motivação para aguentar mais caos.</p>
            <p>Não é para quem quer parecer dono, mas fugir das conversas difíceis.</p>
          </div>
          <p className="text-base font-black text-foreground text-xl">É para quem quer aplicar.</p>
        </div>
      </section>

      {/* ── 12. COMO FUNCIONA ── */}
      <section className="bg-card px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Como funciona</SectionLabel>
          <h2 className="text-2xl sm:text-4xl font-black mb-10 leading-tight">
            Simples, direto e sem barulho.
          </h2>
          <div className="space-y-8">
            {[
              { step: "Você entra", desc: "Recebe acesso à área de membros na Hotmart Club e aos grupos do WhatsApp." },
              { step: "Você acompanha o ritmo", desc: "Toda semana tem conteúdo. Todo dia tem Brasa. Todo mês tem caso real." },
              { step: "Você aplica", desc: "O Guilherme entrega direção prática. Você aplica no ponto da empresa que está mais pesado agora." },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-sm shrink-0">{i + 1}</div>
                  {i < 2 && <div className="w-px flex-1 bg-primary/20 mt-2" style={{ minHeight: 40 }} />}
                </div>
                <div className="pb-6">
                  <h3 className="font-black text-lg mb-1">{item.step}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. AUTORIDADE ── */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-72 sm:h-96 lg:h-auto lg:min-h-[500px]">
            <img src={banner4} alt="Guilherme Cristofore" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 lg:hidden" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(14,17,23,1) 100%)" }} />
            <div className="hidden lg:block absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, hsl(220, 15%, 8%) 100%)" }} />
          </div>
          <div className="px-6 py-12 sm:py-16 lg:py-24 flex flex-col justify-center lg:pl-12 max-w-xl">
            <SectionLabel>Quem é Guilherme</SectionLabel>
            <h2 className="text-2xl sm:text-4xl font-black mb-6 leading-tight">
              Com Guilherme Cristofore.
            </h2>
            <div className="space-y-4 text-base text-foreground/80 leading-relaxed">
              <p>Guilherme empreende desde cedo, construiu empresas reais, errou em decisões reais e aprendeu liderança no lugar onde ela mais cobra: na prática.</p>
              <p>Nos Forjados, ele não fala de cima do palco.</p>
              <p className="text-foreground font-semibold">Ele senta do seu lado e mostra o que fez, o que não faria de novo e como você pode evitar pagar caro por erros que já foram pagos antes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 14 + 15. OFERTA + STACK ── */}
      <section className="px-6 py-16 sm:py-24 max-w-4xl mx-auto" id="oferta">
        <SectionLabel>A oferta</SectionLabel>
        <h2 className="text-2xl sm:text-4xl font-black mb-10 leading-tight text-center">
          Entre como fundador dos Forjados.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* Mensal */}
          <div className="bg-card border border-border/50 rounded-2xl p-8 flex flex-col">
            <div className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4">Plano mensal</div>
            <div className="text-4xl font-black text-foreground mb-1">R$ 27<span className="text-base font-normal text-foreground/50">/mês</span></div>
            <p className="text-sm text-foreground/60 mb-8">Para começar agora e testar a cadência da comunidade.</p>
            <div className="mt-auto">
              <CTAButton href={LINKS.mensal} variant="outline">Entrar no mensal</CTAButton>
            </div>
          </div>
          {/* Anual */}
          <div className="bg-primary/10 border-2 border-primary rounded-2xl p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Mais popular</div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Plano anual</div>
            <div className="text-4xl font-black text-foreground mb-1">R$ 197<span className="text-base font-normal text-foreground/50">/ano</span></div>
            <p className="text-sm text-foreground/60 mb-8">Para quem já decidiu construir liderança pelos próximos 12 meses.</p>
            <div className="mt-auto">
              <CTAButton href={LINKS.anual}>Entrar no anual</CTAButton>
            </div>
          </div>
        </div>

        {/* Stack */}
        <div className="bg-card border border-border/40 rounded-2xl p-8">
          <h3 className="font-black text-xl mb-6">Ao entrar, você recebe:</h3>
          <ul className="space-y-3 mb-8">
            {[
              "4 conteúdos gravados por mês.",
              "Áudios com dicas aplicáveis.",
              "1 caso real dissecado por mês.",
              "7 Templates Anti-Caos.",
              "Comunidade guiada no WhatsApp.",
              "Área de membros na Hotmart Club.",
              "Direção prática do Guilherme para liderança, delegação e operação.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-primary shrink-0 mt-0.5">✓</span>
                <span className="text-sm text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>
          <CTAButton href={LINKS.anual}>Quero soltar o piano</CTAButton>
        </div>

        <p className="mt-4 text-center text-xs text-foreground/40">Depois da janela de fundador, o valor mensal passa para R$ 37/mês.</p>
      </section>

      {/* ── 16. GARANTIA ── */}
      <section className="bg-card px-6 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center mx-auto mb-6 text-3xl">🛡️</div>
          <SectionLabel>Garantia</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-black mb-4 leading-tight">
            Entre, veja por dentro e decida com calma.
          </h2>
          <p className="text-base text-foreground/70 leading-relaxed mb-4">
            Você tem 7 dias para acessar a estrutura, conhecer a comunidade e sentir se o Forjados é para o seu momento.
          </p>
          <p className="text-base text-foreground/70 leading-relaxed mb-2">
            Se não fizer sentido, basta pedir o cancelamento dentro do prazo.
          </p>
          <p className="font-black text-foreground">Sem teatro. Sem enrolação.</p>
        </div>
      </section>

      {/* ── 17. FAQ ── */}
      <section className="px-6 py-16 sm:py-24 max-w-3xl mx-auto">
        <SectionLabel>Dúvidas frequentes</SectionLabel>
        <h2 className="text-2xl sm:text-4xl font-black mb-10 leading-tight">FAQ</h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-card border border-border/40 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-base hover:text-primary transition-colors duration-150"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{item.q}</span>
                <span className="text-primary text-xl shrink-0 transition-transform duration-200" style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm text-foreground/70 leading-relaxed border-t border-border/30 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 18. CTA FINAL ── */}
      <section className="relative min-h-[80vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <img src={banner1} alt="Guilherme Cristofore" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(14,17,23,0.2) 0%, rgba(14,17,23,0.9) 70%, rgba(14,17,23,1) 100%)" }} />
        </div>
        <div className="relative z-10 px-6 py-16 sm:py-24 max-w-2xl mx-auto w-full text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-primary font-black text-2xl leading-none">F</span>
            <span className="text-foreground font-black text-xl tracking-widest uppercase leading-none">ORJADOS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black mb-6 leading-tight">
            O piano não vai ficar mais leve sozinho.
          </h2>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-10">
            Se você continuar liderando no improviso, a empresa vai continuar dependendo demais de você.<br /><br />
            Entre nos Forjados e comece a construir uma liderança que aguenta o tranco.
          </p>
          <CTAButton href={LINKS.anual}>Quero soltar o piano</CTAButton>
          <p className="mt-4 text-xs text-primary font-semibold uppercase tracking-widest">
            Preço de fundador: R$ 27/mês ou R$ 197/ano.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span><span className="text-foreground font-semibold">FORJA ACELERADORA EMPRESARIAL</span> – 50.491.514/0001-65</span>
        <span>Desenvolvido por <span className="text-primary">FORJA</span></span>
      </footer>
    </div>
  );
};

export default Index;
