
import CommeeteeSection from "@/components/shared/home/CommeeteeSection";
import HeroSection from "@/components/shared/home/HeroSection";
import ContactUsSection from "@/components/shared/home/ContactUsSection";
import FaqSection from "@/components/shared/home/FaqSection";
import ProjectsSection from "@/components/shared/home/ProjectSection";

export default function LandingPage() {

  return (
    <div>
      {/* Hero Carousel */}
      <HeroSection />

    
      {/* PROJECTS */}
      <ProjectsSection />

    
      {/* TEAM */}
      <CommeeteeSection />

      {/* CONTACT US */}
      <ContactUsSection />

      {/* FAQ */}
      <FaqSection />
    </div>
  );
}
