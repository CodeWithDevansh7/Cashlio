import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'Terms & Conditions | Cashlio',
};

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-6 text-center">Terms & Conditions</h1>
          <p className="text-lg text-center text-slate-600 mb-8">
            Last updated: May 27, 2026
          </p>
        </section>

        {/* Acceptance of Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4 ml-3 leading-7 text-muted-foreground">
            By using Cashlio, you agree to these Terms & Conditions. If you do not agree, please do not use our services. These Terms form a legally binding agreement between you and Cashlio.
          </p>
        </section>

        {/* Use of Service */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
          <p className="mb-4 ml-3 leading-7 text-muted-foreground">
            You must be at least 13 years old to use Cashlio. You agree to use the Service only for lawful purposes and are responsible for maintaining the confidentiality of your account credentials and activities under your account.
          </p>
        </section>

        {/* User Data & Privacy */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. User Data & Privacy</h2>
          <p className="mb-4 ml-3 leading-7 text-muted-foreground">
            We respect your privacy and handle your personal data according to our Privacy Policy. By using Cashlio, you consent to the collection and use of your information as described there. While we use industry-standard security measures to protect your data, no online platform can guarantee complete security.
          </p>
        </section>

        {/* Limitations of Liability */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. Limitations of Liability</h2>
          <p className="mb-4 ml-3 leading-7 text-muted-foreground">
            To the maximum extent permitted by law, Cashlio shall not be liable for any indirect, incidental, special, or consequential damages, including loss of data, profits, or goodwill resulting from use of the service.
          </p>
          <p className="mb-4 ml-3 leading-7 text-muted-foreground">
            Our total liability related to the service will not exceed the amount paid by you in the last 3 months or $100, whichever is greater.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Changes to Terms</h2>
          <p className="mb-4 ml-3 leading-7 text-muted-foreground">
            We may update these Terms from time to time. Any changes will become effective after being posted on the Service. Continued use of Cashlio means you accept the updated Terms.
          </p>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
          <p className="mb-4 ml-3 leading-7 text-muted-foreground">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mb-4 ml-3">
            <strong>Email:</strong> legal@cashlio.com<br />
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}