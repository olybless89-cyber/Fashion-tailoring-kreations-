import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { commerce, site } from "@/lib/config";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function Checkout() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <h1 className="display display-lg">Checkout</h1>
      <CheckoutForm
        deliveryFee={commerce.deliveryFee}
        freeDeliveryOver={commerce.freeDeliveryOver}
        paystack={site.paystackEnabled}
        pickupAddress={site.address}
      />
    </div>
  );
}
