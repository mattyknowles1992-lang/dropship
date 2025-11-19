import { Layout } from "@/components/Layout";

export default function ForHerPage() {
  return (
    <Layout>
      <section className="space-y-4 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-4 shadow-lg shadow-black/70 sm:p-6 lg:p-7">
        <h1 className="text-2xl font-semibold text-[#FFF9F2] sm:text-3xl">
          Christmas Gifts for Her
        </h1>
        <p className="text-sm text-[#E5E7EB]">
          Thoughtful Christmas presents for partners, mums, sisters and friends.
          We&apos;ll plug in real product cards and checkout integration next.
        </p>
      </section>
    </Layout>
  );
}
