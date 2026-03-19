interface BannerCardProps {
  image: string;
  alt: string;
  href: string;
}

const BannerCard = ({ image, alt, href }: BannerCardProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg overflow-hidden border-2 border-primary/60 hover:border-primary transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_hsla(38,80%,55%,0.2)]"
    >
      <img
        src={image}
        alt={alt}
        className="w-full h-auto object-cover"
        loading="lazy"
      />
    </a>
  );
};

export default BannerCard;
