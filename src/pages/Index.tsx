import portraitImage from "@/assets/portrait.png";
import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.jpg";
import banner3 from "@/assets/banner3.jpg";
import BannerCard from "@/components/BannerCard";

// ====================================================
// EDITABLE DATA — Change images, links, and texts here
// ====================================================
const PORTRAIT_IMAGE = portraitImage;
const PORTRAIT_ALT = "Seu Nome";

const BANNERS = [
  { image: banner1, alt: "Banner Evento 1", href: "https://forms.gle/Grsu6CoTUivcqoXn9" },
  { image: banner2, alt: "Banner Evento 2", href: "https://chat.whatsapp.com/Lj91Ff86zJ49VYThRcDMeE" },
  { image: banner3, alt: "Banner Evento 3", href: "https://go.hotmart.com/B104303263J" },
];

const FOOTER = {
  companyName: "FORJA ACELERADORA EMPRESARIAL",
  cnpj: "50.491.514/0001-65",
  devName: "FORJA",
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
          className="w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, transparent 50%, hsl(220, 15%, 8%) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, hsl(220,15%,8%,0.2) 0%, transparent 20%, transparent 80%, hsl(220,15%,8%,0.4) 100%)",
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
          </div>
          <div>
            Desenvolvido por{" "}
            <span className="text-primary">{FOOTER.devName}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
