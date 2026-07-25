import { BRAND_NAME } from "@/utils/constants";
import FooterSocialLinks from "@/components/FooterSocialLinks";

export default function ProServeFooter() {
  return (
    <footer className="w-full py-20 px-12 border-t border-slate-200 bg-white">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-bold tracking-tighter text-on-background mb-6">
              {BRAND_NAME}
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Architectural precision in every weld, every wire, and every drop of
              water. The gold standard in luxury maintenance.
            </p>
            <FooterSocialLinks />
          </div>
          <div>
            <h4 className="font-label-caps text-xs tracking-widest text-primary mb-8 uppercase">
              Services
            </h4>
            <ul className="space-y-4 text-sm font-medium text-on-surface-variant/80">
              <li>
                <a className="hover:text-primary" href="#">
                  Hydraulic Systems
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Electrical Engineering
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Aesthetic Finishes
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Horticulture
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-caps text-xs tracking-widest text-primary mb-8 uppercase">
              Company
            </h4>
            <ul className="space-y-4 text-sm font-medium text-on-surface-variant/80">
              <li>
                <a className="hover:text-primary" href="#">
                  About Our Ethos
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  AMC Plans
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="/gallery">
                  Project Gallery
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-caps text-xs tracking-widest text-primary mb-8 uppercase">
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
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-slate-100">
          <p className="font-manrope text-xs tracking-widest uppercase text-on-surface-variant/60">
            © 2026 {BRAND_NAME}. All Rights Reserved.
          </p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <span className="text-xs uppercase tracking-widest font-bold text-on-surface/40">
              Apple-Inspired Maintenance
            </span>
            <span className="text-xs uppercase tracking-widest font-bold text-on-surface/40">
              Gold Standard Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
