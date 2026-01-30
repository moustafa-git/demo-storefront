// import { useGSAP } from "@gsap/react"
// import gsap from "gsap"
import { isDemoMode, ENVATO_ITEM_URL } from "@lib/demo-config"
import { ExternalLink, Lock } from "lucide-react"

function DemoPricingContent() {
  return (
    <div className="py-12 px-6 text-center bg-gray-50/50 rounded-3xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-indigo-50 rounded-2xl">
          <Lock className="w-8 h-8 text-indigo-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Pricing restricted in preview</h3>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Subscription tiers, Stripe automated billing, and premium feature management are available in the production version.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a
          href={ENVATO_ITEM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-all shadow-md"
        >
          <span>Purchase on Envato</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

// interface PricingCardPropsType {
//   title: string;
//   desc: string;
//   price: string[];
//   options: {
//     icon: React.ReactNode,
//     info: string,
//   }[];
//   icon: React.ReactNode;
//   children: React.ReactNode;
// }

// const cards = [
//   {
//     title: "TRY ME",
//     desc: "TRY ME",
//     price: ["$", "0", "month"],
//     options: [
//       {
//         icon: <CheckCircleIcon className="h-5 w-5 text-blue-gray-900" />,
//         info: "Skin tone Selection",
//       },
//       {
//         icon: <CheckCircleIcon className="h-5 w-5 text-blue-gray-900" />,
//         info: "Size Check",
//       },
//       {
//         icon: (
//           <CheckCircleIcon
//             strokeWidth={2.5}
//             className="h-5 w-5 text-blue-gray-900"
//           />
//         ),
//         info: "Shipping and Delivery",
//       },
//     ],
//   },
//   {
//     title: "BUY ME",
//     desc: "Free access for 30 members",
//     price: ["$", "10", "month"],
//     options: [
//       {
//         icon: <CheckCircleIcon className="h-5 w-5 text-blue-gray-900" />,
//         info: "All in TRY ME",
//       },
//       {
//         icon: <CheckCircleIcon className="h-5 w-5 text-blue-gray-900" />,
//         info: "Personal Consultation",
//       },
//       {
//         icon: (
//           <CheckCircleIcon
//             strokeWidth={2.5}
//             className="h-5 w-5 text-blue-gray-900"
//           />
//         ),
//         info: "AR Ty-on",
//       },
//       {
//         icon: (
//           <CheckCircleIcon
//             strokeWidth={2.5}
//             className="h-5 w-5 text-blue-gray-900"
//           />
//         ),
//         info: "Relief/Heal Precision Support",
//       },
//     ],
//   },
//   {
//     title: "SHARE ME",
//     desc: "Free access for 200 members",
//     price: ["$", "30", "month"],
//     options: [
//       {
//         icon: <CheckCircleIcon className="h-5 w-5 text-blue-gray-900" />,
//         info: "Packaging Support",
//       },
//       {
//         icon: <CheckCircleIcon className="h-5 w-5 text-blue-gray-900" />,
//         info: "Reseller Privileges",
//       },
//       {
//         icon: (
//           <CheckCircleIcon
//             strokeWidth={2.5}
//             className="h-5 w-5 text-blue-gray-900"
//           />
//         ),
//         info: "Re-purpose Guides",
//       },
//       {
//         icon: (
//           <CheckCircleIcon
//             strokeWidth={2.5}
//             className="h-5 w-5 text-blue-gray-900"
//           />
//         ),
//         info: "Bulk Sale Discounts",
//       },
//       {
//         icon: (
//           <CheckCircleIcon
//             strokeWidth={2.5}
//             className="h-5 w-5 text-blue-gray-900"
//           />
//         ),
//         info: "Maintenance Support",
//       },
//       {
//         icon: (
//           <CheckCircleIcon
//             strokeWidth={2.5}
//             className="h-5 w-5 text-blue-gray-900"
//           />
//         ),
//         info: "Custom Webpage",
//       },
//     ],
//   },
// ]

// function PricingCard({ title, desc, price, options }) {
//   return (
//     <div className="border-[#e4e4e7] border rounded-2xl shadow-sm border-t-0 text-center">
//       <CardHeader
//         floated={false}
//         shadow={false}
//         color="transparent"
//         className="!m-0 p-6"
//       >
//         <h6 className="capitalize font-bold text-lg mb-1 text-[#212121]">
//           {title}
//         </h6>
//         <h6 className="font-normal !text-gray-500">{desc}</h6>
//         <h3 className="!mt-4 flex !text-4xl justify-center text-[#212121] border-b-1 pb-5 border-[#e4e4e7]">
//           {price[0]}
//           {price[1]}
//           <Typography
//             as="span"
//             color="blue-gray"
//             className="-translate-y-0.5 self-end opacity-70 text-lg font-bold"
//           >
//             /{price[2]}
//           </Typography>
//         </h3>
//       </CardHeader>
//       <CardBody className="pt-0 relative">
//         <ul className="flex flex-col gap-3 md:mb-16 mb-8">
//           {options.map((option, key) => (
//             <li
//               key={key}
//               className="flex items-center gap-3 text-[#212121] text-center"
//             >
//               {option.icon}
//               <Typography
//                 variant="small"
//                 className="font-normal text-inherit text-center text-md"
//               >
//                 {option.info}
//               </Typography>
//             </li>
//           ))}
//         </ul>
//         <button className="uppercase text-white w-11/12 rounded-xl bg-[#212121] py-3 px-6 cursor-pointer hover:shadow-2xl transition-all duration-400 hover:scale-x-103 md:absolute md:top-56 md:left-1/2 md:-translate-x-1/2">
//           get started
//         </button>
//       </CardBody>
//     </div>
//   )
// }

export function PricingSection() {
  // useGSAP(() => {
  //   gsap.to(".prices-header", {
  //     y: "0",
  //     opacity: 1,
  //     filter: "blur(0px)",
  //     duration: 1.2,
  //     scrollTrigger: {
  //       trigger: ".pricing-section",
  //       start: "top center",
  //       toggleActions: "play complete complete pause",
  //     },
  //   })

  //   gsap.to(".prices", {
  //     y: "0",
  //     opacity: 1,
  //     filter: "blur(0px)",
  //     duration: 1.2,
  //     scrollTrigger: {
  //       trigger: ".pricing-section",
  //       start: "top center",
  //       toggleActions: "play complete complete pause",
  //     },
  //   })
  // })

  // return (
  //   <section className="pricing-section py-24 px-8 border-t border-[#e4e4e7]">
  //     <div className="container mx-auto">
  //       <div className="prices-header -translate-y-[120px] opacity-0 blur-lg">
  //         <h2 className="text-center text-[#212121] md:text-xl text-lg font-bold mb-[16px] leading-relaxed">
  //           Pricing Plans
  //         </h2>

  //         <h3 className="text-center text-[#212121] md:text-4xl text-2xl font-semibold mb-[16px] max-w-2xl mx-auto leading-tight tracking-normal">
  //           Choose a plan that grows with your recovery journey.
  //         </h3>
  //         <p className="text-center text-gray-500 leading-10 md:text-xl text-lg font-normal max-w-xl mx-auto mb-10">
  //           Compare features below and find the support that fits your needs
  //           best.
  //         </p>
  //       </div>
  //       <div className="prices grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto translate-y-80 opacity-0 blur-lg">
  //         {cards.map(({ title, options, price }, key) => (
  //           <PricingCard
  //             key={key}
  //             title={title}
  //             price={price}
  //             options={options}
  //           />
  //         ))}
  //       </div>
  //       {/* <Typography
  //         variant="small"
  //         className="mt-10 font-normal !text-gray-500"
  //       >
  //         You have Free Unlimited Updates and Premium Support on each package.
  //         You also have 30 days to request a refund.
  //       </Typography> */}
  //     </div>
  //   </section>
  // )

  return (
    <section className="border-t-2 pt-10 pricing-section">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 uppercase tracking-wider">Pricing Plans</h2>
        <p className="text-lg text-gray-600 mb-6 font-medium">
          Choose a plan that grows with your recovery journey
        </p>
      </div>
      
      {isDemoMode ? (
        <DemoPricingContent />
      ) : (
        <>
          <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
          <stripe-pricing-table pricing-table-id="prctbl_1SpiyWFCadEDAOAppREKX6oG"
            publishable-key="pk_live_51S5sz1FCadEDAOApWDu6nlHHlSsycIK4UhPbnHFJ3WZLuopOvelcTWLzbMjnwOpJStdR1mSekc1367QVoTNlXzkj00do8PmlkA">
          </stripe-pricing-table>
        </>
      )}
    </section>
  )
}

export default PricingSection
