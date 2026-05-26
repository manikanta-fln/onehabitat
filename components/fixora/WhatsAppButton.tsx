export default function FixoraWhatsAppButton() {
  return (
    <a
      className="fixed bottom-24 right-margin-mobile md:bottom-12 md:right-margin-desktop z-40 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      href="#"
    >
      <span
        className="material-symbols-outlined text-headline-md"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        chat
      </span>
    </a>
  );
}
