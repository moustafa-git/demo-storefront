"use client"

import { Container } from "@medusajs/ui"
import { Text } from "@medusajs/ui"
import { Heading } from "@medusajs/ui"
import { Button } from "@medusajs/ui"
import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline"
import Script from "next/script"
import { isDemoMode, ENVATO_ITEM_URL } from "@lib/demo-config"
import { ExternalLink, Lock } from "lucide-react"

export default function DistributorPartnerPage() {
  return (
    <div className="">
      {/* Hero Section */}
      <section className="">
        <div className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Text className="text-ui-fg-muted text-md font-medium mb-3">
              PARTNER PROGRAM
            </Text>
            <Heading
              level="h1"
              className="text-3xl md:text-6xl font-bold mb-4 py-4"
            >
              Partner With Us
            </Heading>
            <Text className="text-ui-fg-subtle text-lg">
              Join our network of trusted partners and grow your business with
              our premium products
            </Text>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-ui-bg-base">
        <Container className="py-16">
          <div className="text-center mb-12">
            <Text className="text-ui-fg-muted mb-2">ADVANTAGES</Text>
            <Heading level="h2" className="text-3xl font-bold mb-4">
              Why Become a Partner?
            </Heading>
            <Text className="text-ui-fg-subtle max-w-2xl mx-auto">
              Join our network of successful resellers and grow your business
              with our premium products
            </Text>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Exclusive Pricing",
                description:
                  "Competitive wholesale pricing with volume-based discounts to maximize your profits.",
              },
              {
                title: "Marketing Support",
                description:
                  "Professional marketing materials, digital assets, and training to help you sell more.",
              },
              {
                title: "Custom Web Presence",
                description:
                  "Get your own branded webpage to showcase our products to your customers.",
              },
              {
                title: "Dedicated Support",
                description:
                  "Priority support from our partnership team to help you succeed.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-ui-bg-subtle p-6 rounded-lg border border-ui-border-base"
              >
                <div className="flex items-center mb-3">
                  <CheckCircleIcon className="w-5 h-5 text-ui-fg-interactive mr-2" />
                  <Heading level="h3" className="text-lg font-semibold">
                    {benefit.title}
                  </Heading>
                </div>
                <Text className="text-ui-fg-subtle text-sm">
                  {benefit.description}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing & Portal Section */}
      <section className="py-16 bg-ui-bg-base">
        <div>
          <div className="text-center mb-12">
            <Text className="text-ui-fg-muted mb-2">PRICING & ACCOUNT</Text>
            <Heading level="h2" className="text-3xl font-bold mb-4">
              Choose Your Path
            </Heading>
            <Text className="text-ui-fg-subtle max-w-2xl mx-auto">
              Select a plan that fits your business needs or manage your
              existing account
            </Text>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start w-[85%] mx-auto">
            {/* Pricing Table */}
            <div className="bg-ui-bg-subtle p-6 rounded-xl border border-ui-border-base shadow-sm ">
              <div className="text-center mb-6">
                <Heading level="h3" className="text-xl font-semibold mb-2">
                  Available Plans
                </Heading>
                <Text className="text-ui-fg-subtle text-sm">
                  Choose the perfect plan to grow your business
                </Text>
              </div>
              <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 rounded-lg">
                {isDemoMode ? (
                  <>
                    <div className="p-4 bg-indigo-100 rounded-2xl mb-6">
                      <Lock className="w-10 h-10 text-indigo-600" />
                    </div>
                    <Heading level="h3" className="text-lg font-bold mb-3">
                      Partner Pricing Gated
                    </Heading>
                    <Text className="text-ui-fg-subtle text-sm mb-6 max-w-xs">
                      Stripe Pricing Tables and automated partner onboarding are disabled in this preview version.
                    </Text>
                    <a
                      href={ENVATO_ITEM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
                    >
                      <span>View on Envato</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </>
                ) : (
                  <>
                    <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
                    <stripe-pricing-table pricing-table-id="prctbl_1Spj82FCadEDAOApiF46MTh3"
                      publishable-key="pk_live_51S5sz1FCadEDAOApWDu6nlHHlSsycIK4UhPbnHFJ3WZLuopOvelcTWLzbMjnwOpJStdR1mSekc1367QVoTNlXzkj00do8PmlkA">
                    </stripe-pricing-table>
                  </>
                )}
              </div>
            </div>

            {/* Customer Portal Card */}
            <div className="bg-ui-bg-subtle p-8 rounded-xl border border-ui-border-base shadow-sm h-full flex flex-col justify-center">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-ui-bg-base rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-ui-fg-interactive"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <Heading level="h3" className="text-xl font-semibold mb-2">
                  Manage Your Account
                </Heading>
                <Text className="text-ui-fg-subtle text-sm mb-6">
                  Access your subscription details, update payment methods, and
                  view billing history
                </Text>
                {isDemoMode ? (
                  <div className="p-4 bg-gray-100 rounded-xl border border-dashed border-gray-300">
                    <Text className="text-ui-fg-muted text-xs italic">
                      Account management is restricted in this demo.
                    </Text>
                  </div>
                ) : (
                  <Button variant="secondary" asChild className="w-full">
                    <a
                      href="https://billing.stripe.com/p/login/00wbJ15P54SJfb55542Ji00"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center"
                    >
                      Go to Customer Portal
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
              </div>

              {/* <div className="mt-auto pt-6 border-t border-ui-border-base">
                <Heading level="h3" className="text-lg font-semibold mb-3">
                  Need Help?
                </Heading>
                <ul className="space-y-2 text-sm text-ui-fg-subtle">
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 text-ui-fg-interactive mt-0.5 mr-2 flex-shrink-0" />
                    <span>24/7 Customer Support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 text-ui-fg-interactive mt-0.5 mr-2 flex-shrink-0" />
                    <span>Flexible Billing Options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 text-ui-fg-interactive mt-0.5 mr-2 flex-shrink-0" />
                    <span>Easy Plan Upgrades</span>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>

          {/* Consignment Program */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-ui-bg-subtle to-ui-bg-base p-8 rounded-xl border border-ui-border-base shadow-sm">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                  <Heading level="h3" className="text-2xl font-bold mb-3">
                    Interested in Our Consignment Program?
                  </Heading>
                  <Text className="text-ui-fg-subtle mb-4">
                    Partner with us through our consignment program and stock
                    our products with no upfront inventory costs. Perfect for
                    retailers who want to offer premium products with minimal
                    risk.
                  </Text>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button
                      variant="secondary"
                      asChild
                      className="inline-flex items-center"
                    >
                      <a
                        href="https://www.canva.com/design/DAGzFHwhUD0/s6t1iMrvcmkS6WrOWQOV3w/edit?utm_content=DAGzFHwhUD0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Agreement
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                    {/* <Button
                      variant="primary"
                      asChild
                      className="inline-flex items-center"
                    >
                      <a href="mailto:partners@mednauts.com">Contact Sales</a>
                    </Button> */}
                  </div>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <div className="bg-ui-bg-base p-4 rounded-lg border border-ui-border-base shadow-inner">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-ui-fg-interactive"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="  bg-ui-bg-subtle">
        <div>
          <div className=" rounded-2xl p-8 md:p-12 text-center">
            <Text className="text-ui-fg-muted mb-2">GET STARTED</Text>
            <Heading level="h2" className="text-3xl font-bold mb-4">
              Ready to Grow Your Business With Us?
            </Heading>
            <Text className="text-ui-fg-subtle mb-8 max-w-2xl mx-auto">
              Join our network of successful partners and start offering premium
              products to your customers today.
            </Text>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              {/* <Button variant="primary" className="w-full sm:w-auto" asChild>
                <a href="#contact">
                  Apply Now
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </a>
              </Button> */}
              <Button variant="secondary" className="w-full sm:w-auto" asChild>
                <a href="mailto:partners@mednauts.com">Contact Our Team</a>
              </Button>
            </div>
            {/* <Text className="text-ui-fg-muted text-sm mt-6">
              Have questions? Email us at{" "}
              <a
                href="mailto:partners@mednauts.com"
                className="text-ui-fg-interactive hover:underline"
              >
                partners@mednauts.com
              </a>
            </Text> */}
          </div>
        </div>
      </section>
    </div>
  )
}
