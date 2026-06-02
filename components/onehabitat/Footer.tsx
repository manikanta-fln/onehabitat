import { BRAND_EMAIL, BRAND_NAME, BRAND_PHONE } from "@/utils/constants";

export default function OnehabitatFooter() {
  return (
    <footer
      id="contact"
      className="bg-primary text-on-primary px-margin-desktop py-xl w-full scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="flex flex-col gap-md">
          <div className="font-headline text-headline-sm font-bold">{BRAND_NAME}</div>
          <p className="font-body text-body-sm opacity-80">
            Premium property maintenance and interior solutions driven by AI and
            human expertise.
          </p>
        </div>
        <div className="flex flex-col gap-sm">
          <h4 className="font-headline text-headline-sm mb-xs">Contact</h4>
          <p className="font-body text-body-sm opacity-80">{BRAND_EMAIL}</p>
          <p className="font-body text-body-sm opacity-80">{BRAND_PHONE}</p>
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
        © 2024 {BRAND_NAME}. All rights reserved. Privacy Policy | Cookies
      </div>
    </footer>
  );
}
