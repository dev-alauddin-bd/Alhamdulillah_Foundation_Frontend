"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

export default function ContactUsSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const { t } = useTranslation();

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setIsSending(true);

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EAMILJS_TEMPLATE_ID!,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      )
      .then(
        () => {
          toast.success(t("contact.success"));
          formRef.current?.reset();
          setIsSending(false);
        },
        () => {
          toast.error(t("contact.error"));
          setIsSending(false);
        },
      );
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden bg-mesh">
      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="max-w-3xl mb-16 md:mb-24" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">{t("home.getInTouch")}</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
            {t("home.connectWithUs")}
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {t("contact.desc", {
              defaultValue:
                "Have a question or want to get involved? Reach out to us and we'll get back to you as soon as possible.",
            })}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Map Column */}
          <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 h-[400px] lg:h-auto" data-aos="fade-right">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58619.08917554846!2d90.3296!3d22.7010!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755342d5f1b1b1b%3A0x6a1c5a1f8a9e5c5c!2sBarisal!5e0!3m2!1sen!2sbd!4v1716300000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="grayscale brightness-[0.6] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
            ></iframe>
            <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="text-primary w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">{t("contact.headquarters")}</p>
                <p className="text-sm font-bold text-white">{t("contact.addressValue")}</p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div data-aos="fade-left">
            <Card className="glass border-white/5 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden">
              <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t("contact.fullName")}</label>
                    <Input 
                      name="user_name" 
                      required 
                      placeholder={t("contact.name")} 
                      className="h-14 glass border-white/10 focus:border-primary rounded-2xl px-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t("contact.emailAddress")}</label>
                    <Input 
                      name="user_email" 
                      required 
                      type="email" 
                      placeholder="john@example.com" 
                      className="h-14 glass border-white/10 focus:border-primary rounded-2xl px-6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t("contact.yourMessage")}</label>
                  <Textarea 
                    name="message" 
                    required 
                    placeholder={t("contact.message")} 
                    className="min-h-[180px] glass border-white/10 focus:border-primary rounded-2xl p-6 resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSending}
                  className="w-full h-16 rounded-2xl shadow-glow font-black text-lg group overflow-hidden relative"
                >
                  {isSending ? (
                    <span className="flex items-center gap-3">
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("contact.sending")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      {t("contact.sendMessage")} <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-8 justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone size={14} className="text-primary" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">+880 1234 567 890</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail size={14} className="text-primary" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">info@alhamdulillah.com</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

