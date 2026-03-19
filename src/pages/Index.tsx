import portraitImage from "@/assets/portrait.jpg";
import banner1 from "@/assets/banner1.jpg";
import banner2 from "@/assets/banner2.jpg";
import banner3 from "@/assets/banner3.jpg";
import banner4 from "@/assets/banner4.jpg";
import BannerCard from "@/components/BannerCard";

// ====================================================
// EDITABLE DATA — Change images, links, and texts here
// ====================================================
const PORTRAIT_IMAGE = portraitImage;
const PORTRAIT_ALT = "Seu Nome";

const BANNERS = [
  { image: banner1, alt: "Banner Evento 1", href: "#link1" },
  { image: banner2, alt: "Banner Evento 2", href: "#link2" },
  { image: banner3, alt: "Banner Evento 3", href: "#link3" },
  { image: banner4, alt: "Banner Evento 4", href: "#link4" },
];

const FOOTER = {
  companyName: "SUA EMPRESA LTDA",
  cnpj: "00.000.000/0001-00",
  city: "SUA CIDADE/UF",
  phone: "(00) 0000-0000",
  devName: "Seu Desenvolvedor",
  devLink: "#",
};
// ====================================================

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Left portrait - fixed background on desktop */}
      <div className="hidden lg:block fixed top-0 left-0 w-[48%] h-full z-0">
        <img
          src={PORTRAIT_IMAGE}
          alt={PORTRAIT_ALT}
          className="w-full h-full object-cover object-top"
        />
        {/* Dark gradient overlay fading to the right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, transparent 60%, hsl(220, 15%, 8%) 100%)",
          }}
        />
        {/* Subtle top/bottom vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, hsl(220,15%,8%,0.3) 0%, transparent 20%, transparent 80%, hsl(220,15%,8%,0.5) 100%)",
          }}
        />
      </div>

      {/* Mobile portrait */}
      <div className="lg:hidden relative w-full h-[50vh]">
        <img
          src={PORTRAIT_IMAGE}
          alt={PORTRAIT_ALT}
          className="w-full h-full object-cover object-top"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, hsl(220, 15%, 8%) 100%)",
          }}
        />
      </div>

      {/* Right content — banner cards */}
      <div className="relative z-10 lg:ml-[48%] min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 py-8 lg:py-12">
          <div className="w-full max-w-xl space-y-5">
            {BANNERS.map((banner, i) => (
              <BannerCard
                key={i}
                image={banner.image}
                alt={banner.alt}
                href={banner.href}
              />
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-muted-foreground text-xs">
          <div>
            <span className="font-semibold text-foreground">
              {FOOTER.companyName}
            </span>{" "}
            – {FOOTER.cnpj}
            <br />
            {FOOTER.city} – {FOOTER.phone}
          </div>
          <div>
            Desenvolvido por{" "}
            <a
              href={FOOTER.devLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {FOOTER.devName}
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
