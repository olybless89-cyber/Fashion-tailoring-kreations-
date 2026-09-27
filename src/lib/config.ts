export const site = {
  name: "Fashion Tailoring Kreation",
  short: "FTK",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  email: process.env.NEXT_PUBLIC_EMAIL || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "",
  address: process.env.NEXT_PUBLIC_ADDRESS || "",
  paystackEnabled: process.env.NEXT_PUBLIC_PAYSTACK_ENABLED === "true",
};

export const commerce = {
  deliveryFee: Number(process.env.DELIVERY_FEE ?? 5000),
  freeDeliveryOver: Number(process.env.FREE_DELIVERY_OVER ?? 300000),
  bank: {
    name: process.env.BANK_NAME || "",
    accountName: process.env.BANK_ACCOUNT_NAME || "",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || "",
  },
};

export function whatsappLink(message: string) {
  if (!site.whatsapp) return null;
  return `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
