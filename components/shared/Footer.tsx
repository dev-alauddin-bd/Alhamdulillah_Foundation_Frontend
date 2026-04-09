"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t border-border pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="container mx-auto px-4">
        {/* TOP GRID */}
        <div
          className="
            grid grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-10 lg:gap-12
            mb-10 sm:mb-12
          "
        >
          {/* Brand */}
          <div className="space-y-4 text-center sm:text-left">
            <Link
              href="/"
              className="inline-block"
            >
              <div className="relative h-24 w-24">
                <img 
                  src="/logo.png" 
                  alt="Alhamdulillah Foundation" 
                  className="object-contain w-full h-full"
                />
              </div>
            </Link>

            <p className="text-sm sm:text-base text-foreground/60 leading-relaxed max-w-xs mx-auto sm:mx-0">
              {t("contact.desc")}
            </p>

            <div className="flex justify-center sm:justify-start gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="
                    p-2 rounded-full
                    bg-primary/10 text-primary
                    hover:bg-primary hover:text-primary-foreground
                    transition-all
                  "
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm sm:text-lg font-semibold mb-4 sm:mb-6 uppercase tracking-wider text-primary">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                "footer.agriculture",
                "footer.fishFarming",
                "footer.realEstate",
                "footer.allOpps",
              ].map((key) => (
                <li key={key}>
                  <Link
                    href="/projects"
                    className="text-sm sm:text-base text-foreground/60 hover:text-primary transition-colors"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm sm:text-lg font-semibold mb-4 sm:mb-6 uppercase tracking-wider text-primary">
              {t("footer.support")}
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link href="/about" className="footer-link">
                  {t("common.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  {t("footer.howItWorks")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  {t("footer.faqs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  {t("footer.supportCenter")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm sm:text-lg font-semibold mb-4 sm:mb-6 uppercase tracking-wider text-primary">
              {t("common.contact")}
            </h4>
            <ul className="space-y-4 text-sm sm:text-base">
              <li className="flex justify-center sm:justify-start gap-3">
                <MapPin size={18} className="text-primary flex-shrink-0" />
                <span className="text-foreground/60">
                  {t("contact.addressValue")}
                </span>
              </li>
              <li className="flex justify-center sm:justify-start gap-3">
                <Phone size={18} className="text-primary" />
                <span className="text-foreground/60">+880 1234 567 890</span>
              </li>
              <li className="flex justify-center sm:justify-start gap-3">
                <Mail size={18} className="text-primary" />
                <span className="text-foreground/60">
                  support@alhamdulillah.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          className="
            pt-6 sm:pt-8 border-t border-border
            flex flex-col md:flex-row
            items-center justify-between
            gap-4
          "
        >
          <p className="text-xs sm:text-sm text-foreground/50 text-center md:text-left">
            {t("brand.copyright")}
          </p>

          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-foreground/50">
            <Link href="/privacy" className="hover:text-primary">
              {t("common.privacyPolicy")}
            </Link>
            <Link href="/terms" className="hover:text-primary">
              {t("common.termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Optional utility */
const footerLink =
  "text-sm sm:text-base text-foreground/60 hover:text-primary transition-colors";
