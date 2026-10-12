import { Outlet } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import WhatsAppButton from "@/components/feature/WhatsAppButton";
import { SiteProvider } from "@/context/SiteContext";

export default function PublicLayout() {
  return (
    <SiteProvider>
      <div className="min-h-screen flex flex-col bg-background-50">
        <Navbar />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </SiteProvider>
  );
}