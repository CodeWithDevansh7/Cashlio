// Import your new components
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';
import { LandingContent } from '@/components/landing/LandingContent';

export default function CashlioLanding() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      {/* Background Ambient Blobs */}
      <div className="absolute top-0 left-0 w-full overflow-hidden -z-10 pointer-events-none h-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-200/40 blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-200/30 blur-[120px]" />
      </div>

      <Navbar />

      <LandingContent />

      <Footer />
    </div>
  );
}