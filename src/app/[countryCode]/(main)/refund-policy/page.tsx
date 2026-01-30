import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund Policy | Spaceaids",
  description: "Learn about our refund and return policy for Spaceaids products.",
}

export default function RefundPolicyPage() {
  return (
    <div className="content-container py-12 max-w-4xl">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Refund Policy</h1>
      
      <div className="prose prose-gray max-w-none space-y-8">
        <p className="text-ui-fg-subtle">
          Last updated: January 2025
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Overview</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            We want you to be completely satisfied with your purchase. If you are not satisfied, we offer 
            refunds and returns under the following conditions. Please read this policy carefully before 
            making a purchase.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Eligibility for Refunds</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            To be eligible for a refund, you must meet the following conditions:
          </p>
          <ul className="list-disc pl-6 text-ui-fg-subtle space-y-2">
            <li>Request a refund within 30 days of the original purchase date</li>
            <li>Products must be unused and in their original packaging</li>
            <li>Products must be in the same condition as when you received them</li>
            <li>Proof of purchase (order confirmation or receipt) is required</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Non-Refundable Items</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            The following items are not eligible for refunds:
          </p>
          <ul className="list-disc pl-6 text-ui-fg-subtle space-y-2">
            <li>Items that have been opened, used, or damaged by the customer</li>
            <li>Sale or clearance items (unless defective)</li>
            <li>Gift cards and promotional credits</li>
            <li>Items marked as final sale at the time of purchase</li>
            <li>Personalized or custom-made items</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. How to Request a Refund</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            To request a refund, please follow these steps:
          </p>
          <ol className="list-decimal pl-6 text-ui-fg-subtle space-y-2">
            <li>Contact our customer support team through our <a href="/contact" className="text-[#C10007] hover:underline">contact page</a></li>
            <li>Provide your order number and reason for the refund request</li>
            <li>Wait for our team to review your request (typically within 2-3 business days)</li>
            <li>If approved, you will receive return instructions via email</li>
            <li>Ship the item back to us using the provided instructions</li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Return Shipping</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            Return shipping costs are the responsibility of the customer unless:
          </p>
          <ul className="list-disc pl-6 text-ui-fg-subtle space-y-2">
            <li>The item was defective or damaged upon arrival</li>
            <li>We sent you the wrong item</li>
            <li>The return is due to our error</li>
          </ul>
          <p className="text-ui-fg-subtle leading-relaxed">
            We recommend using a trackable shipping service to ensure your return arrives safely.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Refund Processing</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            Once we receive and inspect your return, we will notify you of the approval or rejection of your 
            refund. If approved:
          </p>
          <ul className="list-disc pl-6 text-ui-fg-subtle space-y-2">
            <li>Refunds will be processed to your original payment method</li>
            <li>Credit card refunds may take 5-10 business days to appear on your statement</li>
            <li>Bank transfers may take 3-5 business days</li>
            <li>Store credit refunds are processed immediately</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">7. Damaged or Defective Items</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            If you receive a damaged or defective item, please contact us immediately with:
          </p>
          <ul className="list-disc pl-6 text-ui-fg-subtle space-y-2">
            <li>Your order number</li>
            <li>Photos of the damaged or defective item</li>
            <li>Description of the issue</li>
          </ul>
          <p className="text-ui-fg-subtle leading-relaxed">
            We will work with you to resolve the issue promptly, either through a replacement or full refund.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. Exchanges</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            If you need to exchange an item for a different size, color, or product, please process a return 
            for the original item and place a new order for the desired item. This ensures the fastest processing 
            and availability of your preferred item.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. Late or Missing Refunds</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            If you haven't received your refund after the expected processing time:
          </p>
          <ol className="list-decimal pl-6 text-ui-fg-subtle space-y-2">
            <li>Check your bank account or credit card statement again</li>
            <li>Contact your credit card company or bank, as processing times vary</li>
            <li>If you've done the above and still haven't received your refund, please contact us</li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">10. Contact Us</h2>
          <p className="text-ui-fg-subtle leading-relaxed">
            If you have any questions about our refund policy, please contact our customer support team through 
            our <a href="/contact" className="text-[#C10007] hover:underline">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
