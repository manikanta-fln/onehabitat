import Link from "next/link";
import { BRAND_NAME } from "@/utils/constants";
import FooterSocialLinks from "@/components/FooterSocialLinks";

export default function OnehabitatFooter() {
  return (
    <footer
      id="contact"
      className="w-full scroll-mt-24 border-t border-slate-200 bg-white px-12 py-20"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6 text-2xl font-bold tracking-tighter text-on-background">
              {BRAND_NAME}
            </div>
            <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
              Architectural precision in every weld, every wire, and every drop of
              water. The gold standard in luxury maintenance.
            </p>
            <FooterSocialLinks />
          </div>
          <div>
            <h4 className="mb-8 font-label-caps text-xs uppercase tracking-widest text-primary">
              Services
            </h4>
            <ul className="space-y-4 text-sm font-medium text-on-surface-variant/80">
              <li>
                <Link className="hover:text-primary" href="/services">
                  Hydraulic Systems
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary" href="/services">
                  Electrical Engineering
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary" href="/services">
                  Aesthetic Finishes
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary" href="/services">
                  Horticulture
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-8 font-label-caps text-xs uppercase tracking-widest text-primary">
              Company
            </h4>
            <ul className="space-y-4 text-sm font-medium text-on-surface-variant/80">
              <li>
                <a className="hover:text-primary" href="#">
                  About Our Ethos
                </a>
              </li>
              <li>
                <Link className="hover:text-primary" href="/#amc-plans">
                  AMC Plans
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary" href="/gallery">
                  Project Gallery
                </Link>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-8 font-label-caps text-xs uppercase tracking-widest text-primary">
              Support
            </h4>
            <ul className="space-y-4 text-sm font-medium text-on-surface-variant/80">
              <li>
                <a className="hover:text-primary" href="#">
                  Service Warranty
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Safety Standards
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Emergency Contact
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between border-t border-slate-100 pt-12 md:flex-row">
          <p className="font-manrope text-xs uppercase tracking-widest text-on-surface-variant/60">
            © 2026 {BRAND_NAME}. All Rights Reserved.
          </p>
          <div className="mt-6 flex space-x-8 md:mt-0">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface/40">
              Apple-Inspired Maintenance
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface/40">
              Gold Standard Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
