import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Spaceaids",
  description: "Learn how Spaceaids collects, uses, and protects your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="content-container py-12 max-w-4xl">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Privacy Policy</h1>
      
      <div className="prose prose-gray max-w-none space-y-8">
        <p className="text-ui-fg-subtle">
          Last updated: January 2025
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            At Spaceaids, we are committed to protecting your privacy and personal information. This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information when you visit our website or 
            use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            We may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 text-ui-fg-subtle space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, phone number, shipping and billing addresses</li>
            <li><strong>Payment Information:</strong> Credit card details and billing information (processed securely by our payment providers)</li>
            <li><strong>Account Information:</strong> Username, password, and account preferences</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our website and services</li>
            <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            We use your information for the following purposes:
          </p>
          <ul className="list-disc pl-6 text-ui-fg-subtle space-y-2">
            <li>To process and fulfill your orders</li>
            <li>To communicate with you about your orders, account, and customer service inquiries</li>
            <li>To send promotional communications (with your consent)</li>
            <li>To improve our website, products, and services</li>
            <li>To detect and prevent fraud and security threats</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Information Sharing</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 text-ui-fg-subtle space-y-2">
            <li><strong>Service Providers:</strong> Third parties who assist us in operating our website, processing payments, and fulfilling orders</li>
            <li><strong>Business Partners:</strong> Trusted partners for marketing and promotional purposes (with your consent)</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
          </ul>
          <p className="text-ui-fg-subtle leading-relaxed">
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Cookies and Tracking Technologies</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            We use cookies and similar tracking technologies to enhance your browsing experience, analyze website 
            traffic, and personalize content. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Data Security</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
            over the internet is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">7. Your Rights</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            Depending on your location, you may have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 text-ui-fg-subtle space-y-2">
            <li>Right to access your personal information</li>
            <li>Right to correct inaccurate information</li>
            <li>Right to delete your personal information</li>
            <li>Right to object to or restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. Data Retention</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
            Privacy Policy, unless a longer retention period is required by law.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. Children's Privacy</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            Our services are not directed to individuals under the age of 13. We do not knowingly collect personal 
            information from children. If we become aware that we have collected information from a child, we will 
            take steps to delete it.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">10. Changes to This Policy</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by 
            posting the new policy on our website with an updated effective date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">11. Contact Us</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            If you have any questions about this Privacy Policy or our data practices, please contact us through our 
            <a href="/contact" className="text-[#C10007] hover:underline ml-1">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
