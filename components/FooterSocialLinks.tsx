import { BRAND_EMAIL } from "@/utils/constants";

const iconLinkClassName =
  "flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant text-primary transition-colors hover:bg-primary-container";

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 fill-current"
    >
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 1.75A3.75 3.75 0 0 0 3.75 7.5v9a3.75 3.75 0 0 0 3.75 3.75h9a3.75 3.75 0 0 0 3.75-3.75v-9A3.75 3.75 0 0 0 16.5 3.75h-9zm9.25 1.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 fill-current"
    >
      <path d="M14.5 22v-8.2h2.76l.41-3.2H14.5V8.55c0-.93.26-1.56 1.59-1.56H17.8V4.14C17.4 4.09 16.1 4 14.6 4c-3.13 0-5.27 1.91-5.27 5.42v3.18H6.7v3.2h2.63V22h5.17z" />
    </svg>
  );
}

function GmailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 fill-current"
    >
      <path d="M20 18h-2V9.25L12 13.5 6 9.25V18H4V6h1.2L12 11.25 18.8 6H20v12zM4 4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4z" />
    </svg>
  );
}

export default function FooterSocialLinks() {
  return (
    <div className="flex space-x-4">
      <a
        className={iconLinkClassName}
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <InstagramIcon />
      </a>
      <a
        className={iconLinkClassName}
        href="https://www.facebook.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
      >
        <FacebookIcon />
      </a>
      <a
        className={iconLinkClassName}
        href={`mailto:${BRAND_EMAIL}`}
        aria-label="Gmail"
      >
        <GmailIcon />
      </a>
    </div>
  );
}
