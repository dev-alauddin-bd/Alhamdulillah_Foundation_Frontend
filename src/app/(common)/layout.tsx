
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
  
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />

        <main >
          {children}
        </main>
        <Footer/>
      </div>
   
  );
}
