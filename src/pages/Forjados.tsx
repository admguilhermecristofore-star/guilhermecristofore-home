import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LINK_ANUAL = "https://pay.hotmart.com/S105668941Q";
const LINK_MENSAL = "https://pay.hotmart.com/S105668941Q?off=oicxzour";

function CTAButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center font-bold text-white rounded-full transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 ${className}`}
      style={{
        background: "linear-gradient(236deg, #14CE04 0%, #0A6802 100%)",
      }}
    >
      {children}
    </a>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ background: "#FFDB00", color: "#010A1F" }}
      >
        ✓
      </span>
      <span>{children}</span>
    </div>
  );
}

export default function Forjados() {
  const [openFaq, setOpenFaq] = useState<string>("");

  const faqs = [
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .forjados-page * { font-family: 'Inter', sans-serif; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        .pulse-dot { animation: pulse-dot 1.5s infinite; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.7s ease both; }
      `}</style>

      <div className="forjados-page" style={{ background: "#010A1F" }}>

        {/* ── 1. HERO ─────────────────────────────────────────────── */}
        <section
          style={{
            background:
              "linear-gradient(180deg, rgba(1,10,31,0.55) 0%, rgba(1,10,31,0.80) 100%), #010A1F",
            minHeight: "100vh",
          }}
          className="flex flex-col items-center justify-center px-5 py-20 text-center"
        >
          {/* Logo placeholder */}
          <div className="mb-8 fade-in-up">
            <span
              className="text-2xl font-bold tracking-widest uppercase"
              style={{ color: "#FFDB00" }}
            >
              FORJADOS
            </span>
          </div>

          <div className="max-w-2xl mx-auto fade-in-up">
            <h1
              className="font-semibold leading-tight mb-5"
              style={{
                fontSize: "clamp(32px, 6vw, 52px)",
                lineHeight: "1.05",
                letterSpacing: "0.5px",
                color: "#FAFAFF",
              }}
            >
              Pare de ser o{" "}
              <span style={{ color: "#FFDB00" }}>maior funcionário</span> da
              sua própria empresa.
            </h1>

            <p
              className="mb-8 font-normal"
              style={{
                fontSize: "clamp(16px, 3vw, 22px)",
                lineHeight: "1.55",
                color: "#FAFAFF",
                opacity: 0.9,
              }}
            >
              Entre nos Forjados e construa uma liderança que aguenta o tranco,
              tira você do apaga-incêndio e faz a operação andar sem depender
              de você em tudo.
            </p>

            <CTAButton
              href={LINK_MENSAL}
              className="text-base md:text-lg px-10 py-5 mb-3 w-full max-w-sm mx-auto block"
            >
              Quero ficar livre do operacional
            </CTAButton>

            <p
              className="text-sm font-medium"
              style={{ color: "#FFDB00" }}
            >
              Preço de fundador liberado!
            </p>

            {/* Urgency badge */}
            <div className="mt-6 inline-flex items-center gap-2 text-sm" style={{ color: "#FAFAFF", opacity: 0.8 }}>
              <span className="pulse-dot w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
              Acesso imediato · 100% online
            </div>
          </div>
        </section>

        {/* ── 2. DOR PRINCIPAL ────────────────────────────────────── */}
        <section
          style={{ background: "#FFDB00" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="font-semibold mb-6"
              style={{
                fontSize: "clamp(26px, 5vw, 44px)",
                lineHeight: "1.1",
                color: "#010A1F",
              }}
            >
              Se tudo volta para você, a empresa ainda está nas suas costas.
            </h2>
            <div
              className="text-left space-y-3 max-w-lg mx-auto"
              style={{ fontSize: "clamp(15px, 2.5vw, 18px)", color: "#010A1F", lineHeight: "1.6" }}
            >
              <p>Você decide tudo. Resolve tudo. Cobra tudo. Refaz tudo.</p>
              <p>Quando alguém erra, você entra.</p>
              <p>Quando o cliente chama, você entra.</p>
              <p>Quando a operação trava, você entra.</p>
              <p className="font-semibold">
                E no fim do dia ainda tenta chamar isso de empreender.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. VIRADA ────────────────────────────────────────────── */}
        <section
          style={{ background: "#010A1F" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="font-semibold mb-6"
              style={{
                fontSize: "clamp(28px, 5vw, 48px)",
                lineHeight: "1.1",
                color: "#FAFAFF",
              }}
            >
              Quem improvisa,{" "}
              <span style={{ color: "#FFDB00" }}>paga.</span>
            </h2>
            <div
              className="space-y-3 mb-10"
              style={{
                fontSize: "clamp(15px, 2.5vw, 18px)",
                color: "#FAFAFF",
                opacity: 0.85,
                lineHeight: "1.65",
              }}
            >
              <p>O problema não é trabalhar muito.</p>
              <p>O problema é sua presença ter virado o processo.</p>
              <p>Toda decisão empurrada vira incêndio.</p>
              <p>Toda conversa evitada vira problema.</p>
              <p>Toda delegação mal feita volta para o seu colo.</p>
            </div>
            <CTAButton
              href={LINK_MENSAL}
              className="text-base md:text-lg px-10 py-5 w-full max-w-sm mx-auto block"
            >
              Quero parar de improvisar
            </CTAButton>
          </div>
        </section>

        {/* ── 4. ANTES E DEPOIS ───────────────────────────────────── */}
        <section
          style={{ background: "#FFFFFF" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="font-semibold text-center mb-10"
              style={{
                fontSize: "clamp(26px, 5vw, 44px)",
                lineHeight: "1.1",
                color: "#010A1F",
              }}
            >
              De dono no improviso para{" "}
              <span style={{ color: "#010A1F", borderBottom: "3px solid #FFDB00" }}>
                dono forjado.
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Antes */}
              <div
                className="rounded-2xl p-6 space-y-3"
                style={{ background: "#F5F5F5", border: "1px solid #eee" }}
              >
                <h3 className="font-bold text-lg mb-4" style={{ color: "#888" }}>
                  Dono no improviso
                </h3>
                {[
                  "Decide no susto.",
                  "Cobra no grito ou tarde demais.",
                  'Centraliza porque “ninguém faz direito”.',
                  "Vive apagando incêndio.",
                  "Confunde movimento com crescimento.",
                  "Tem time, mas continua sendo o gargalo.",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">✕</span>
                    <span style={{ fontSize: "15px", color: "#444", lineHeight: "1.5" }}>{item}</span>
                  </div>
                ))}
              </div>
              {/* Depois */}
              <div
                className="rounded-2xl p-6 space-y-3"
                style={{ background: "#010A1F" }}
              >
                <h3 className="font-bold text-lg mb-4" style={{ color: "#FFDB00" }}>
                  Dono forjado
                </h3>
                {[
                  "Decide com critério.",
                  "Comunica o que espera e o que cobra.",
                  "Delega com clareza.",
                  "Resolve a causa, não só o fogo.",
                  "Cria processo simples.",
                  "Lidera sem precisar estar em tudo.",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span style={{ color: "#14CE04", fontWeight: "bold", marginTop: "2px", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: "15px", color: "#FAFAFF", lineHeight: "1.5" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. APRESENTAÇÃO DO FORJADOS ─────────────────────────── */}
        <section
          style={{ background: "#010A1F" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="font-semibold mb-6"
              style={{
                fontSize: "clamp(28px, 5vw, 48px)",
                lineHeight: "1.1",
                color: "#FAFAFF",
              }}
            >
              Conheça os{" "}
              <span style={{ color: "#FFDB00" }}>Forjados.</span>
            </h2>
            <div
              className="space-y-4 mb-10 text-left"
              style={{
                fontSize: "clamp(15px, 2.5vw, 18px)",
                color: "#FAFAFF",
                opacity: 0.85,
                lineHeight: "1.7",
              }}
            >
              <p>
                Uma comunidade de construção de liderança para quem tem ou quer
                ter um negócio e decidiu parar de ser apagador de incêndio.
              </p>
              <p>
                Aqui não tem guru em palco, teoria bonita ou grupo barulhento.
              </p>
              <p>
                É o Guilherme Cristofore mostrando, na prática, o que
                funcionou, o que quebrou e o que ele faria diferente para
                construir uma liderança de verdade.
              </p>
            </div>
            <CTAButton
              href={LINK_MENSAL}
              className="text-base md:text-lg px-10 py-5 w-full max-w-sm mx-auto block"
            >
              Entrar nos Forjados
            </CTAButton>
          </div>
        </section>

        {/* ── 6. MOVIMENTO ────────────────────────────────────────── */}
        <section
          style={{ background: "#FFDB00" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="font-semibold mb-6"
              style={{
                fontSize: "clamp(26px, 5vw, 44px)",
                lineHeight: "1.1",
                color: "#010A1F",
              }}
            >
              Menos empresário-herói.{" "}
              <span style={{ borderBottom: "4px solid #010A1F" }}>
                Mais dono de verdade.
              </span>
            </h2>
            <div
              className="space-y-3"
              style={{
                fontSize: "clamp(15px, 2.5vw, 18px)",
                color: "#010A1F",
                lineHeight: "1.65",
              }}
            >
              <p>O Forjados não existe para romantizar o caos.</p>
              <p>
                Existe para reunir gente que cansou de carregar tudo sozinha e
                decidiu construir empresa com mais clareza, processo e
                liderança.
              </p>
              <p>Não é sobre ter o negócio perfeito.</p>
              <p className="font-semibold">
                É sobre parar de esperar permissão e começar a fazer melhor que
                perfeito.
              </p>
            </div>
          </div>
        </section>

        {/* ── 7. O QUE VOCÊ RECEBE ────────────────────────────────── */}
        <section
          style={{ background: "#FFFFFF" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="font-semibold text-center mb-10"
              style={{
                fontSize: "clamp(24px, 4.5vw, 42px)",
                lineHeight: "1.15",
                color: "#010A1F",
              }}
            >
              Um ritmo simples para você construir{" "}
              <span style={{ color: "#010A1F", borderBottom: "3px solid #FFDB00" }}>
                liderança toda semana.
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  label: "01",
                  title: "Forjado da Semana",
                  desc: "1 conteúdo gravado por semana, de 15 a 25 minutos, para resolver situações reais de liderança, delegação, decisão e operação.",
                },
                {
                  label: "02",
                  title: "Brasa do Dia",
                  desc: "Áudios curtos, direto no WhatsApp, com uma provocação ou ferramenta rápida para o dia do dono.",
                },
                {
                  label: "03",
                  title: "Caso na Bigorna",
                  desc: "Uma vez por mês, o Guilherme disseca ao vivo um caso real de membro: empresa real, problema real, caminho real.",
                },
                {
                  label: "04",
                  title: "Templates Anti-Caos",
                  desc: "7 ferramentas práticas para delegação, feedback, onboarding, decisão, reunião e organização da operação.",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl p-6"
                  style={{
                    background: "#010A1F",
                    border: "1px solid rgba(255,219,0,0.2)",
                  }}
                >
                  <span
                    className="text-xs font-bold tracking-widest uppercase mb-3 block"
                    style={{ color: "#FFDB00" }}
                  >
                    {card.label}
                  </span>
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: "#FAFAFF" }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "rgba(250,250,255,0.75)", lineHeight: "1.6" }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. POR QUE FUNCIONA ─────────────────────────────────── */}
        <section
          style={{ background: "#010A1F" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="font-semibold mb-2"
              style={{
                fontSize: "clamp(26px, 5vw, 46px)",
                lineHeight: "1.1",
                color: "#FFDB00",
              }}
            >
              A Forja Anti-Caos.
            </h2>
            <p
              className="mb-10"
              style={{ color: "#FAFAFF", opacity: 0.8, fontSize: "17px" }}
            >
              O Forjados tira você do improviso em 3 movimentos:
            </p>
            <div className="space-y-5 text-left">
              {[
                {
                  n: "1",
                  title: "Liderar melhor",
                  desc: "Comunicar, cobrar, decidir e parar de estar presente em tudo.",
                },
                {
                  n: "2",
                  title: "Resolver o que ficou para trás",
                  desc: "Olhar para buracos financeiros, operacionais e de gente sem fingir que eles não existem.",
                },
                {
                  n: "3",
                  title: "Construir de verdade",
                  desc: "Criar processo, delegar com clareza e montar uma operação que não depende do grito.",
                },
              ].map((step) => (
                <div
                  key={step.n}
                  className="flex gap-5 items-start rounded-2xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderLeft: "3px solid #FFDB00",
                  }}
                >
                  <span
                    className="text-2xl font-bold flex-shrink-0 w-8 text-center"
                    style={{ color: "#FFDB00" }}
                  >
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: "#FAFAFF" }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: "15px", color: "rgba(250,250,255,0.75)", lineHeight: "1.6" }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. PRIMEIROS PASSOS ─────────────────────────────────── */}
        <section
          style={{ background: "#FFFFFF" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-2xl mx-auto">
            <h2
              className="font-semibold text-center mb-3"
              style={{
                fontSize: "clamp(24px, 4.5vw, 42px)",
                lineHeight: "1.15",
                color: "#010A1F",
              }}
            >
              Você não entra para ficar perdido.
            </h2>
            <p className="text-center mb-8" style={{ color: "#555", fontSize: "16px" }}>
              No primeiro acesso, você já sabe por onde começar:
            </p>
            <div className="space-y-4 mb-8">
              {[
                "Entra na área de membros",
                "Recebe os Templates Anti-Caos",
                "Acompanha a primeira Brasa do Dia",
                "Assiste ao Forjado da Semana",
                "Escolhe um ponto da operação para ajustar primeiro",
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl p-4"
                  style={{ background: "#F9F9FF", border: "1px solid #eee" }}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: "#FFDB00", color: "#010A1F" }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: "15px", color: "#222", lineHeight: "1.5" }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="rounded-2xl p-5 text-center"
              style={{ background: "#010A1F" }}
            >
              <p className="font-semibold" style={{ color: "#FFDB00", fontSize: "17px", lineHeight: "1.5" }}>
                O objetivo não é consumir mais conteúdo. É tirar peso das suas costas.
              </p>
            </div>
          </div>
        </section>

        {/* ── 10. PARA QUEM É ─────────────────────────────────────── */}
        <section
          style={{ background: "#010A1F" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-2xl mx-auto">
            <h2
              className="font-semibold text-center mb-8"
              style={{
                fontSize: "clamp(26px, 5vw, 44px)",
                lineHeight: "1.1",
                color: "#FAFAFF",
              }}
            >
              É para você{" "}
              <span style={{ color: "#FFDB00" }}>se…</span>
            </h2>
            <div className="space-y-4">
              {[
                "Está começando e quer construir certo desde o início.",
                "Está recomeçando depois de um erro, uma sociedade ruim ou um negócio que não foi.",
                "Já tem empresa, mas ainda carrega tudo sozinho.",
                "Vive apagando incêndio e quer virar dono de verdade.",
                "Quer liderar melhor sem cair em papo corporativo vazio.",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-full px-6 py-3"
                  style={{ background: "#FFDB00" }}
                >
                  <span className="font-bold text-sm mt-0.5 flex-shrink-0" style={{ color: "#010A1F" }}>
                    ✓
                  </span>
                  <span style={{ fontSize: "15px", color: "#010A1F", fontWeight: 500 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 11. PARA QUEM NÃO É ─────────────────────────────────── */}
        <section
          style={{ background: "#00081A" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="font-semibold mb-6"
              style={{
                fontSize: "clamp(24px, 4.5vw, 40px)",
                lineHeight: "1.15",
                color: "#FAFAFF",
              }}
            >
              Não entre se você quer{" "}
              <span style={{ color: "#FFDB00" }}>
                só assistir conteúdo.
              </span>
            </h2>
            <div
              className="space-y-3 mb-8 text-left max-w-lg mx-auto"
              style={{
                fontSize: "clamp(15px, 2.5vw, 17px)",
                color: "rgba(250,250,255,0.8)",
                lineHeight: "1.7",
              }}
            >
              <p>O Forjados não é para quem quer terceirizar responsabilidade.</p>
              <p>Não é para quem quer motivação para aguentar mais caos.</p>
              <p>Não é para quem quer parecer dono, mas fugir das conversas difíceis.</p>
              <p className="font-bold" style={{ color: "#FFDB00" }}>
                É para quem quer aplicar.
              </p>
            </div>
          </div>
        </section>

        {/* ── 12. COMO FUNCIONA ───────────────────────────────────── */}
        <section
          style={{ background: "#FFFFFF" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-2xl mx-auto">
            <h2
              className="font-semibold text-center mb-10"
              style={{
                fontSize: "clamp(24px, 4.5vw, 42px)",
                lineHeight: "1.15",
                color: "#010A1F",
              }}
            >
              Simples, direto e sem barulho.
            </h2>
            <div className="space-y-5">
              {[
                {
                  step: "01",
                  title: "Você entra",
                  desc: "Recebe acesso à área de membros na Hotmart Club e aos grupos do WhatsApp.",
                },
                {
                  step: "02",
                  title: "Você acompanha o ritmo",
                  desc: "Toda semana tem conteúdo. Todo dia tem Brasa. Todo mês tem caso real.",
                },
                {
                  step: "03",
                  title: "Você aplica",
                  desc: "O Guilherme entrega direção prática. Você aplica no ponto da empresa que está mais pesado agora.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-5 items-start rounded-2xl p-5"
                  style={{
                    background: "#F9F9FF",
                    borderLeft: "4px solid #FFDB00",
                  }}
                >
                  <span
                    className="text-2xl font-bold flex-shrink-0"
                    style={{ color: "#FFDB00" }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: "#010A1F" }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: "15px", color: "#444", lineHeight: "1.6" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 13. AUTORIDADE ──────────────────────────────────────── */}
        <section
          style={{ background: "#010A1F" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="font-semibold mb-6"
              style={{
                fontSize: "clamp(24px, 4.5vw, 42px)",
                lineHeight: "1.15",
                color: "#FAFAFF",
              }}
            >
              Com{" "}
              <span style={{ color: "#FFDB00" }}>Guilherme Cristofore.</span>
            </h2>
            <div
              className="space-y-4 text-left"
              style={{
                fontSize: "clamp(15px, 2.5vw, 17px)",
                color: "rgba(250,250,255,0.85)",
                lineHeight: "1.7",
              }}
            >
              <p>
                Guilherme empreende desde cedo, construiu empresas reais, errou
                em decisões reais e aprendeu liderança no lugar onde ela mais
                cobra: na prática.
              </p>
              <p>
                Nos Forjados, ele não fala de cima do palco.
              </p>
              <p>
                Ele senta do seu lado e mostra o que fez, o que não faria de
                novo e como você pode evitar pagar caro por erros que já foram
                pagos antes.
              </p>
            </div>
          </div>
        </section>

        {/* ── 14 + 15. OFERTA + STACK FINAL ───────────────────────── */}
        <section
          style={{ background: "#010A1F" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="font-semibold text-center mb-3"
              style={{
                fontSize: "clamp(26px, 5vw, 44px)",
                lineHeight: "1.1",
                color: "#FAFAFF",
              }}
            >
              Entre como{" "}
              <span style={{ color: "#FFDB00" }}>fundador dos Forjados.</span>
            </h2>
            <p className="text-center mb-10" style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px" }}>
              Depois da janela de fundador, o mensal passa para R$ 37/mês.
            </p>

            {/* Stack checklist */}
            <div
              className="rounded-2xl p-6 mb-8 space-y-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,219,0,0.2)" }}
            >
              <p className="font-bold mb-4" style={{ color: "#FFDB00", fontSize: "17px" }}>
                Ao entrar, você recebe:
              </p>
              {[
                "4 conteúdos gravados por mês.",
                "Áudios com dicas aplicáveis.",
                "1 caso real dissecado por mês.",
                "7 Templates Anti-Caos.",
                "Comunidade guiada no WhatsApp.",
                "Área de membros na Hotmart Club.",
                "Direção prática do Guilherme para liderança, delegação e operação.",
              ].map((item, i) => (
                <CheckItem key={i}><span style={{ color: "#FAFAFF", fontSize: "15px" }}>{item}</span></CheckItem>
              ))}
            </div>

            {/* Price cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {/* Mensal */}
              <div
                className="rounded-2xl p-6 flex flex-col items-center text-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,219,0,0.3)",
                }}
              >
                <span className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Plano mensal
                </span>
                <div className="flex items-end gap-1 mb-1">
                  <span style={{ fontSize: "16px", color: "#FAFAFF", alignSelf: "flex-start", marginTop: "12px" }}>R$</span>
                  <span
                    style={{
                      fontSize: "clamp(64px, 14vw, 96px)",
                      fontWeight: 700,
                      lineHeight: 1,
                      color: "#FFFFFF",
                    }}
                  >
                    27
                  </span>
                  <span style={{ fontSize: "16px", color: "#FAFAFF", alignSelf: "flex-end", marginBottom: "8px" }}>/mês</span>
                </div>
                <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Para começar agora e testar a cadência da comunidade.
                </p>
                <CTAButton
                  href={LINK_MENSAL}
                  className="text-sm px-8 py-4 w-full"
                >
                  Entrar no mensal
                </CTAButton>
              </div>
              {/* Anual */}
              <div
                className="rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden"
                style={{
                  background: "#FFDB00",
                  border: "2px solid #FFDB00",
                }}
              >
                <span
                  className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "#010A1F", color: "#FFDB00" }}
                >
                  MAIS VANTAJOSO
                </span>
                <span className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#010A1F", opacity: 0.7 }}>
                  Plano anual
                </span>
                <div className="flex items-end gap-1 mb-1">
                  <span style={{ fontSize: "16px", color: "#010A1F", alignSelf: "flex-start", marginTop: "12px" }}>R$</span>
                  <span
                    style={{
                      fontSize: "clamp(64px, 14vw, 96px)",
                      fontWeight: 700,
                      lineHeight: 1,
                      color: "#010A1F",
                    }}
                  >
                    197
                  </span>
                  <span style={{ fontSize: "16px", color: "#010A1F", alignSelf: "flex-end", marginBottom: "8px" }}>/ano</span>
                </div>
                <p className="text-sm mb-5" style={{ color: "#010A1F", opacity: 0.7 }}>
                  Para quem já decidiu construir liderança pelos próximos 12 meses.
                </p>
                <a
                  href={LINK_ANUAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full font-bold rounded-full py-4 px-8 transition-all hover:brightness-110"
                  style={{
                    background: "#010A1F",
                    color: "#FFDB00",
                    fontSize: "15px",
                  }}
                >
                  Entrar no anual
                </a>
              </div>
            </div>

            <div className="text-center">
              <CTAButton
                href={LINK_MENSAL}
                className="text-base md:text-lg px-12 py-5 w-full max-w-sm mx-auto block"
              >
                Quero soltar o piano
              </CTAButton>
            </div>
          </div>
        </section>

        {/* ── 16. GARANTIA ────────────────────────────────────────── */}
        <section
          style={{ background: "#FAFAFF" }}
          className="px-5 py-16 md:py-20"
        >
          <div className="max-w-xl mx-auto text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-6"
              style={{ background: "#010A1F" }}
            >
              🛡️
            </div>
            <h2
              className="font-semibold mb-5"
              style={{
                fontSize: "clamp(22px, 4vw, 36px)",
                lineHeight: "1.2",
                color: "#010A1F",
              }}
            >
              Entre, veja por dentro e decida com calma.
            </h2>
            <div
              className="space-y-3"
              style={{
                fontSize: "clamp(15px, 2.5vw, 17px)",
                color: "#333",
                lineHeight: "1.7",
              }}
            >
              <p>
                Você tem 7 dias para acessar a estrutura, conhecer a comunidade
                e sentir se o Forjados é para o seu momento.
              </p>
              <p>
                Se não fizer sentido, basta pedir o cancelamento dentro do prazo.
              </p>
              <p className="font-bold" style={{ color: "#010A1F" }}>
                Sem teatro. Sem enrolação.
              </p>
            </div>
          </div>
        </section>

        {/* ── 17. FAQ ─────────────────────────────────────────────── */}
        <section
          style={{ background: "#FAFAFF" }}
          className="px-5 pb-16 md:pb-20"
        >
          <div className="max-w-2xl mx-auto">
            <h2
              className="font-semibold text-center mb-8"
              style={{
                fontSize: "clamp(26px, 5vw, 44px)",
                lineHeight: "1.1",
                color: "#010A1F",
              }}
            >
              Perguntas frequentes
            </h2>
            <Accordion
              type="single"
              collapsible
              value={openFaq}
              onValueChange={setOpenFaq}
              className="space-y-2"
            >
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-xl px-5"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(1,10,31,0.08)",
                  }}
                >
                  <AccordionTrigger
                    className="text-left font-semibold py-4 hover:no-underline"
                    style={{ fontSize: "15px", color: "#010A1F" }}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent
                    style={{ fontSize: "14px", color: "#444", lineHeight: "1.65" }}
                  >
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ── 18. CTA FINAL ───────────────────────────────────────── */}
        <section
          style={{
            background:
              "linear-gradient(180deg, #010A1F 0%, #000314 100%)",
          }}
          className="px-5 py-20 md:py-28 text-center"
        >
          <div className="max-w-xl mx-auto">
            <div className="mb-6">
              <span
                className="text-2xl font-bold tracking-widest uppercase"
                style={{ color: "#FFDB00" }}
              >
                FORJADOS
              </span>
            </div>
            <h2
              className="font-semibold mb-6"
              style={{
                fontSize: "clamp(28px, 6vw, 52px)",
                lineHeight: "1.1",
                color: "#FAFAFF",
              }}
            >
              O piano não vai ficar{" "}
              <span style={{ color: "#FFDB00" }}>mais leve sozinho.</span>
            </h2>
            <div
              className="space-y-3 mb-10"
              style={{
                fontSize: "clamp(15px, 2.5vw, 18px)",
                color: "rgba(250,250,255,0.8)",
                lineHeight: "1.7",
              }}
            >
              <p>
                Se você continuar liderando no improviso, a empresa vai continuar
                dependendo demais de você.
              </p>
              <p>
                Entre nos Forjados e comece a construir uma liderança que aguenta
                o tranco.
              </p>
            </div>

            <CTAButton
              href={LINK_MENSAL}
              className="text-base md:text-xl px-12 py-5 md:py-6 w-full max-w-sm mx-auto block mb-4"
            >
              Quero soltar o piano
            </CTAButton>

            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Preço de fundador: R$ 27/mês ou R$ 197/ano.
            </p>
          </div>
        </section>

      </div>
    </>
  );
}
