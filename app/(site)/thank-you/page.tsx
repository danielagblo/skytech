import ThankYouClient from "./ThankYouClient";

export const metadata = {
  title: "Thank you | Skytech Ghana",
  description: "Your form was received. Chat with Skytech Ghana on WhatsApp for a faster response.",
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-[100px] md:pt-[120px]">
      <ThankYouClient />
    </div>
  );
}
