import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'Privacy Policy | Cashlio',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Background Ambient Blobs */}
      <div className="absolute top-0 left-0 w-full overflow-hidden -z-10 pointer-events-none h-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-200/40 blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-200/30 blur-[120px]" />
      </div>

      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
          <p className="text-lg text-center text-slate-600 mb-8">
            Last updated: May 27, 2026
          </p>
        </section>

        {/* Data We Collect */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. Data We Collect</h2>
          <p className="mb-4 ml-3 leading-7 text-muted-foreground">
            We collect information such as your name, email, financial data, device details, IP address, and cookies to provide and improve our services.
          </p>
        </section>

        {/* How We Use Your Data */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Data</h2>
          <p className="mb-4 ml-3 leading-7 text-muted-foreground">
            Your data is used to manage your account, improve Cashlio, provide support, enhance security, and comply with legal obligations.
          </p>
        </section>

        {/* Data Storage */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. Data Storage</h2>
          <p className="mb-4 ml-3 leading-7 text-muted-foreground">
            We store your data securely using trusted providers and industry-standard encryption while retaining information only as needed.
          </p>
        </section>

        {/* Third-Party Services */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
          <p className="mb-4 ml-3 leading-7 text-muted-foreground">
            We may work with trusted third-party providers for payments, analytics, hosting, and support services, but we do not sell your personal data.
          </p>
        </section>

        {/* Contact Us */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
          <p className="mb-4 ml-3 leading-7 text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mb-4 ml-3">
            <strong>Email:</strong> privacy@cashlio.com<br />
            {/* <strong>Address:</strong> Cashlio Inc., 123 Finance Street, Mumbai, MH 400001, India */}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}