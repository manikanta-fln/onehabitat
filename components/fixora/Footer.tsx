export default function FixoraFooter() {
  return (
    <footer
      id="contact"
      className="bg-primary text-on-primary px-margin-desktop py-xl w-full scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div className="flex flex-col gap-md">
          <div className="font-headline text-headline-sm font-bold">Fixora</div>
          <p className="font-body text-body-sm opacity-80">
            Premium property maintenance and interior solutions driven by AI and
            human expertise.
          </p>
        </div>
        <div className="flex flex-col gap-sm">
          <h4 className="font-headline text-headline-sm mb-xs">Services</h4>
          <a
            className="font-body text-body-sm opacity-80 hover:opacity-100 transition-opacity"
            href="#"
          >
            Residential Maintenance
          </a>
          <a
            className="font-body text-body-sm opacity-80 hover:opacity-100 transition-opacity"
            href="#"
          >
            Interior Execution
          </a>
          <a
            className="font-body text-body-sm opacity-80 hover:opacity-100 transition-opacity"
            href="#"
          >
            Handover Snagging
          </a>
          <a
            className="font-body text-body-sm opacity-80 hover:opacity-100 transition-opacity"
            href="#"
          >
            Annual Contracts
          </a>
        </div>
        <div className="flex flex-col gap-sm">
          <h4 className="font-headline text-headline-sm mb-xs">Company</h4>
          <a
            className="font-body text-body-sm opacity-80 hover:opacity-100 transition-opacity"
            href="#"
          >
            About Us
          </a>
          <a
            className="font-body text-body-sm opacity-80 hover:opacity-100 transition-opacity"
            href="#"
          >
            Partner with Us
          </a>
          <a
            className="font-body text-body-sm opacity-80 hover:opacity-100 transition-opacity"
            href="#"
          >
            Careers
          </a>
          <a
            className="font-body text-body-sm opacity-80 hover:opacity-100 transition-opacity"
            href="#"
          >
            Terms of Service
          </a>
        </div>
        <div className="flex flex-col gap-sm">
          <h4 className="font-headline text-headline-sm mb-xs">Contact</h4>
          <p className="font-body text-body-sm opacity-80">hello@fixora.com</p>
          <p className="font-body text-body-sm opacity-80">+1 (555) 000-FIXO</p>
          <div className="flex gap-md mt-sm">
            <span className="material-symbols-outlined opacity-80 hover:opacity-100 cursor-pointer">
              public
            </span>
            <span className="material-symbols-outlined opacity-80 hover:opacity-100 cursor-pointer">
              smart_display
            </span>
            <span className="material-symbols-outlined opacity-80 hover:opacity-100 cursor-pointer">
              group
            </span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/20 mt-xl pt-lg text-center font-body text-body-sm opacity-60">
        © 2024 Fixora. All rights reserved. Privacy Policy | Cookies
      </div>
    </footer>
  );
}
