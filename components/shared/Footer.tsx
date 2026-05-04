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
    <footer className="relative bg-mesh pt-24 pb-12 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-8">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden transition-transform group-hover:scale-110">
                  <img src="/logo.png" alt="Logo" className="object-contain w-full h-full" />
                </div>
                <span className="font-black text-xl tracking-tighter text-white uppercase">{t("brand.name")}</span>
              </div>
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t("contact.desc", {
                defaultValue: "Empowering communities through sustainable initiatives and dedicated support for a better tomorrow.",
              })}
            </p>

            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">{t("footer.quickLinks")}</h4>
            <ul className="space-y-4">
              {[
                { key: "footer.agriculture", label: "Agriculture" },
                { key: "footer.fishFarming", label: "Fish Farming" },
                { key: "footer.realEstate", label: "Real Estate" },
                { key: "footer.allOpps", label: "All Opportunities" },
              ].map((item) => (
                <li key={item.key}>
                  <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-4 h-px bg-primary transition-all duration-300 mr-0 group-hover:mr-2" />
                    {t(item.key, { defaultValue: item.label })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">{t("footer.support")}</h4>
            <ul className="space-y-4">
              {["common.about", "footer.howItWorks", "footer.faqs", "footer.supportCenter"].map((key) => (
                <li key={key}>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-4 h-px bg-primary transition-all duration-300 mr-0 group-hover:mr-2" />
                    {t(key, { defaultValue: key.split(".").pop() })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">{t("common.contact")}</h4>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-primary" />
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed">
                  {t("contact.addressValue", { defaultValue: "Barisal, Bangladesh" })}
                </span>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={14} className="text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">+880 1234 567 890</span>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">support@alhamdulillah.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-muted-foreground/50 tracking-widest uppercase">
            {t("brand.copyright", { defaultValue: "© 2026 ALHAMDULILLAH FOUNDATION" })}
          </p>

          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] font-bold text-muted-foreground/50 hover:text-primary tracking-widest uppercase transition-colors">
              {t("common.privacyPolicy", { defaultValue: "Privacy Policy" })}
            </Link>
            <Link href="/terms" className="text-[10px] font-bold text-muted-foreground/50 hover:text-primary tracking-widest uppercase transition-colors">
              {t("common.termsOfService", { defaultValue: "Terms of Service" })}
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
