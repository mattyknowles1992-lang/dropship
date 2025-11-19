import { Layout } from "@/components/Layout";

export default function ContactPage() {
  return (
    <Layout>
      <section className="space-y-4 rounded-3xl border border-[#D9A441]/60 bg-black/85 p-4 shadow-lg shadow-black/70 sm:p-6 lg:p-7">
        <h1 className="text-2xl font-semibold text-[#FFF9F2] sm:text-3xl">Contact us</h1>
        <p className="text-sm text-[#E5E7EB]">
          Questions about Christmas orders, delivery or returns? Reach out and we&apos;ll
          respond as quickly as possible.
        </p>
        <ul className="space-y-1 text-sm text-[#E5E7EB]">
          <li>Email: support@example.com</li>
          <li>Response time: typically within 24 hours</li>
        </ul>
      </section>
    </Layout>
  );
}
