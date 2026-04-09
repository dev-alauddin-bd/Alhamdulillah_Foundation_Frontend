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
    <section id="contact" className="py-20  relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px]" />

      <div className="container mx-auto px-4">
        {/* Header */}
   <div
  className="
    text-center max-w-3xl mx-auto
    mb-8 sm:mb-12 md:mb-20
  "
>
  <h2
    className="
      font-black
      text-xl sm:text-2xl md:text-5xl
      mb-3 sm:mb-4 md:mb-6
      bg-gradient-to-r from-primary via-emerald-600 to-amber-500
      bg-clip-text text-transparent
    "
  >
    {t("contact.title", {
      defaultValue: "We'd Love to Hear From You",
    })}
  </h2>

  <p
    className="
      text-sm sm:text-base md:text-lg
      text-muted-foreground
      leading-relaxed
    "
  >
    {t("contact.desc", {
      defaultValue:
        "Have a question or want to get involved? Reach out to us and we'll get back to you as soon as possible.",
    })}
  </p>
</div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
           {/* Map Section */}
       <div className="h-full min-h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-border relative group">
  <iframe 
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58619.08917554846!2d90.3296!3d22.7010!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755342d5f1b1b1b%3A0x6a1c5a1f8a9e5c5c!2sBarisal!5e0!3m2!1sen!2sbd!4v1716300000000"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="grayscale group-hover:grayscale-0 transition-all duration-700"
  ></iframe>

  <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-border flex items-center gap-2">
    <MapPin className="text-primary w-4 h-4" />
    <span className="text-xs font-bold">Barisal, Bangladesh</span>
  </div>
</div>

          {/* Form Column */}
          <Card className="order-1 lg:order-2 p-8 md:p-10 bg-card/40 backdrop-blur-sm border-border/60 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
             
             <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-1 h-8 rounded-full bg-primary" />
                Select Message
             </h3>

             <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-sm font-semibold tracking-wide text-foreground/80">
                      {t("contact.name", { defaultValue: "Your Name" })}
                   </label>
                   <Input 
                      name="user_name" 
                      required 
                      placeholder="John Doe" 
                      className="h-12 bg-background/50 border-input/50 focus:border-primary transition-all rounded-xl"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-semibold tracking-wide text-foreground/80">
                      {t("contact.emailLabel", { defaultValue: "Email Address" })}
                   </label>
                   <Input 
                      name="user_email" 
                      required 
                      type="email" 
                      placeholder="john@example.com" 
                      className="h-12 bg-background/50 border-input/50 focus:border-primary transition-all rounded-xl"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-semibold tracking-wide text-foreground/80">
                      {t("contact.message", { defaultValue: "Message" })}
                   </label>
                   <Textarea 
                      name="message" 
                      required 
                      placeholder="How can we help you?" 
                      className="min-h-[150px] bg-background/50 border-input/50 focus:border-primary transition-all rounded-xl resize-none"
                   />
                </div>

                <Button 
                   type="submit" 
                   disabled={isSending}
                   className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-700 text-white font-bold text-lg shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                   {isSending ? (
                      <span className="flex items-center gap-2">
                         <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                         Sending...
                      </span>
                   ) : (
                      <span className="flex items-center gap-2">
                         Send Message <Send size={18} />
                      </span>
                   )}
                </Button>
             </form>

             <div className="mt-8 pt-8 border-t border-border/50 flex flex-wrap gap-4 justify-center md:justify-between text-center md:text-left">
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                   <Phone size={16} className="text-primary" /> +880 1234 567 890
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                   <Mail size={16} className="text-primary" /> info@alhamdulillah.com
                </div>
             </div>
          </Card>

        </div>
      </div>
    </section>
  );
}

