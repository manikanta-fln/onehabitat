export default function FixoraMobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-margin-mobile pb-safe bg-surface border-t border-outline-variant md:hidden z-50 shadow-lg">
      <a
        className="flex flex-col items-center justify-center text-primary font-bold"
        href="#"
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          calendar_month
        </span>
        <span className="font-label text-[10px]">Book Service</span>
      </a>
      <a
        className="flex flex-col items-center justify-center text-on-surface-variant"
        href="#"
      >
        <span className="material-symbols-outlined">chat</span>
        <span className="font-label text-[10px]">WhatsApp</span>
      </a>
      <a
        className="flex flex-col items-center justify-center text-on-surface-variant"
        href="#"
      >
        <span className="material-symbols-outlined">home_repair_service</span>
        <span className="font-label text-[10px]">Services</span>
      </a>
      <a
        className="flex flex-col items-center justify-center text-on-surface-variant"
        href="#"
      >
        <span className="material-symbols-outlined">person</span>
        <span className="font-label text-[10px]">Account</span>
      </a>
    </nav>
  );
}
