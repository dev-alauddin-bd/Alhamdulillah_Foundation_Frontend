"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { AFSectionTitle } from "@/components/shared/AFSectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Lightbulb, Users, ShieldCheck, Info } from "lucide-react";
import { useGetManagementsQuery } from "@/redux/features/management/managementApi";

export default function AboutPage() {
  const { t } = useTranslation();

  const { data: investigationData } = useGetManagementsQuery({ committeeType: "INVESTIGATION", limit: 20 });
  const { data: advisoryData } = useGetManagementsQuery({ committeeType: "ADVISORY", limit: 20 });

  const investigationCommittee = investigationData?.data || [];
  const advisoryCommittee = advisoryData?.data || [];

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      desc: "We believe in helping those in need with kindness and empathy.",
      color: "text-rose-500 bg-rose-500/10",
    },
    {
      icon: Target,
      title: "Transparency",
      desc: "Every donation is tracked and accounted for, ensuring trust.",
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      desc: "Using technology to solve age-old problems in our community.",
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      icon: Users,
      title: "Community",
      desc: "Building a strong network of supporters and beneficiaries.",
      color: "text-emerald-500 bg-emerald-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-40 pb-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[500px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
            alt="Team Working"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
            <div className="p-8 md:p-16 max-w-4xl animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Empowering Communities, <br />
                <span className="text-primary">Transforming Lives.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200">
                Alhamdulillah Foundation is dedicated to creating sustainable investments and charitable initiatives that uplift society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <AFSectionTitle
              title="Our Mission & Vision"
              subtitle="What Drives Us"
              align="left"
            />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is to bridge the gap between resources and needs through transparent, ethical, and impactful investments. We envision a world where every individual has the opportunity to thrive.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We started with a simple idea: that collective small contributions can lead to massive change. Today, we are proud to support hundreds of families through our agricultural and development projects.
            </p>
          </div>
          <div className="relative h-[400px] rounded-bl-[100px] rounded-tr-[100px] overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800">
            <Image
              src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop"
              alt="Vision"
              fill
              className="object-cover hover:scale-110 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 mb-20">
        <AFSectionTitle
          title="Our Core Values"
          subtitle="The Principles That Guide Us"
          align="center"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {values.map((item, i) => (
            <Card key={i} className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-muted-foreground">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Committees Section */}
      <section className="container mx-auto px-4 mb-20">
        <AFSectionTitle
          title="আমাদের কমিটিসমূহ"
          subtitle="ফাউন্ডেশন পরিচালনায় নিয়োজিত"
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Investigation Committee */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">তদন্ত কমিটি</h3>
                <p className="text-sm text-muted-foreground">মেয়াদ: ১২ মাস</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {investigationCommittee.map((member: any, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-border flex items-center gap-4 bg-muted/20">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-bold">{member.name || member.userId?.name}</div>
                    <div className="text-xs text-muted-foreground">{member.position}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl flex gap-3 text-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/30">
              <Info className="w-5 h-5 flex-shrink-0" />
              <p>এ কমিটি ১২ মাসের জন্য গঠন করা হল। কমপক্ষে ৫ জনের তদন্ত রিপোর্টে স্বাক্ষরের নিচে কোন প্রজেক্ট চালু হবে না।</p>
            </div>
          </div>

          {/* Advisory Committee */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Users className="text-emerald-500 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">উপদেষ্টা কমিটি</h3>
                <p className="text-sm text-muted-foreground">মেয়াদ: ৩৬ মাস</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advisoryCommittee.map((member: any, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-border flex items-center gap-4 bg-muted/20">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-600">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-bold">{member.name || member.userId?.name}</div>
                    <div className="text-xs text-muted-foreground">{member.position}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl flex gap-3 text-sm text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/30">
              <Info className="w-5 h-5 flex-shrink-0" />
              <p>এ কমিটি ৩৬ মাসের জন্য গঠন করা হল। নতুন বিনিয়োগের ধারনা প্রদান এবং চলমান প্রজেক্টকে গতিশীল করাই এদের মূল লক্ষ্য।</p>
            </div>
          </div>
        </div>
      </section>

      {/* Foundation Rules (Bengali) */}
      <section id="rules" className="container mx-auto px-4 mb-20 bg-muted/30 py-16 rounded-[40px] border border-border">
        <AFSectionTitle
          title="ফাউন্ডেশন কার্যক্রম ও নিয়মাবলী"
          subtitle="আমাদের লক্ষ্য ও উদ্দেশ্য"
          align="center"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-sm md:text-base">
          <Card className="shadow-none border-2 border-primary/10">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-primary border-b pb-2 mb-4">কার্যক্রম বিধিমালা</h3>
              <ul className="space-y-3 list-decimal list-inside text-muted-foreground leading-relaxed">
                <li>এটি একটি লিডারসিপ আর্থিক প্রতিষ্ঠান যার প্রধান কাজ হলো ছোট ছোট দলে বিভক্তি হয়ে আর্থিক বিনিয়োগ পরিচালনা করা।</li>
                <li>আমাদের লক্ষ হলো জনশক্তি ও আর্থিক শক্তিকে এক করে সামাজিক উন্নয়ন সাধন করা।</li>
                <li>আমাদের বিনিয়োগের এক একটি প্রজেক্ট এর চূড়ান্ত বিনিয়োগ হচ্ছে ৩০,০০০/- - ১৫০,০০০/- (তিশ হাজার থেকে দেড় লক্ষ টাকা)।</li>
                <li>প্রতিটা প্রজেক্ট এর জন্য ৪-৮ জনের একটা কমিটি গঠন করা হবে, যাদের কাজ হবে পণ্য ক্রয় থেকে বিক্রয় পর্যন্ত সক্রিয় ভূমিকা পালন করা।</li>
                <li>প্রতি শেয়ার হোল্ডারকে প্রত্যেক মাসে এক হাজার টাকা করে জমা রাখতে হবে ১২ মাস পর্যন্ত।</li>
                <li>প্রজেক্টের লাভের ৪০% পাবে সক্রিয় কমিটি, ১০% কল্যান তহবিল এবং ৫০% সকল শেয়ার মালিকদের একাউন্টে জমা হবে।</li>
                <li>ইসলামের অনুসাশন মেনেই এই প্রতিষ্ঠান পরিচালিত হবে। আমরা সুদ মুক্ত সমাজ গঠনে কাজ করব।</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-none border-2 border-destructive/10">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-destructive border-b pb-2 mb-4">শেয়ার বাতিল সংক্রান্ত</h3>
              <ul className="space-y-3 list-decimal list-inside text-muted-foreground leading-relaxed">
                <li>বিধি নির্দেশ মানতে ব্যর্থ হলে প্রথমে নোটিশ এবং পরবর্তীতে ৫১% মতামতের ভিত্তিতে সদস্যপদ বাতিল করা হবে।</li>
                <li>প্রতি মাসে সঞ্চয় জমা দেয়া বাধ্যতামূলক। টানা ৩ মাস ব্যর্থ হলে মালিকানা বাতিল হয়ে যাবে।</li>
                <li>অসামাজিক কর্মকান্ডের সাথে জড়িত থাকলে সদস্য পদ বাতিল হবে।</li>
                <li>কোন শেয়ার হোল্ডার ৬ মাস পূর্ণ হওয়ার আগে অ্যাকাউন্ট ক্লোজ করতে পারবেন না।</li>
                <li>প্রজেক্টের কাজে অনিয়ম দেখা গেলে কর্তৃপক্ষ আর্থিক জরিমানা বা শেয়ার বাতিল করতে পারবে।</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-8 bg-primary/5 rounded-2xl border border-primary/20 text-center">
          <p className="text-lg font-bold text-primary mb-2 italic">"আমরা সর্বদা সামাজিক হবো এবং সমাজের সকল প্রকার সমস্যা সমাধানে নিজেকে নিবেদিত প্রাণ হিসেবে গড়ে তুলব।"</p>
          <p className="text-muted-foreground">ইনশাআল্লাহ</p>
        </div>
      </section>
    </div>
  );
}
