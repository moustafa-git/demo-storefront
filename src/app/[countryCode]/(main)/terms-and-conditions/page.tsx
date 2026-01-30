import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Spaceaids",
  description: "Read our terms of service and conditions for using the Spaceaids platform.",
}

export default function TermsOfServicePage() {
  return (
    <div className="content-container py-12 max-w-4xl">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Terms of Service</h1>
      
      <div className="prose prose-gray max-w-none space-y-8">
        <p className="text-ui-fg-subtle">
          Last updated: January 2025
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Agreement to Terms</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            By accessing or using our website and services, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Use of Services</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            You may use our services only for lawful purposes and in accordance with these Terms. You agree not to:
          </p>
          <ul className="list-disc pl-6 text-ui-fg-subtle space-y-2">
            <li>Use the services in any way that violates any applicable law or regulation</li>
            <li>Engage in any conduct that restricts or inhibits anyone's use of the services</li>
            <li>Attempt to gain unauthorized access to any part of the services</li>
            <li>Use the services to transmit any malicious code or harmful content</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Account Registration</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            To access certain features of our services, you may need to create an account. You are responsible 
            for maintaining the confidentiality of your account information and for all activities that occur 
            under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Products and Orders</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            All products are subject to availability. We reserve the right to limit quantities, refuse orders, 
            or cancel orders at our discretion. Prices are subject to change without notice. We make every effort 
            to display accurate product information, but we do not warrant that product descriptions or prices 
            are error-free.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Payment Terms</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            Payment is required at the time of purchase. We accept various forms of payment as indicated on 
            our website. By providing payment information, you represent that you are authorized to use the 
            payment method and authorize us to charge your account for your order.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            All content on our website, including text, graphics, logos, images, and software, is the property 
            of Spaceaids or its content suppliers and is protected by copyright, trademark, and other intellectual 
            property laws. You may not reproduce, distribute, modify, or create derivative works without our 
            prior written consent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages arising out of or related to your use of our services. Our total 
            liability shall not exceed the amount you paid for the product or service giving rise to the claim.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. Disclaimer of Warranties</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            Our services are provided "as is" and "as available" without warranties of any kind, either express 
            or implied. We do not warrant that the services will be uninterrupted, error-free, or completely secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. Changes to Terms</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
            posting to our website. Your continued use of our services after any changes constitutes acceptance 
            of the new Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">10. Contact Information</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            If you have any questions about these Terms of Service, please contact us through our 
            <a href="/contact" className="text-[#C10007] hover:underline ml-1">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
