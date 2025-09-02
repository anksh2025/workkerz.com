"use client"

import Link from "next/link";
import { useEffect } from "react";


const sections = [
    { id: "definitions", label: "1. Definitions" },
    { id: "eligibility", label: "2. Eligibility" },
    { id: "use-of-services", label: "3. Use of Services" },
    { id: "bookings-payments", label: "4. Bookings & Payments" },
    { id: "cancellations-refunds", label: "5. Cancellations & Refunds" },
    { id: "worker-responsibilities", label: "6. Worker Responsibilities" },
    { id: "customer-responsibilities", label: "7. Customer Responsibilities" },
    { id: "liability", label: "8. Limitation of Liability" },
    { id: "privacy", label: "9. Data & Privacy" },
    { id: "termination", label: "10. Suspension & Termination" },
    { id: "changes", label: "11. Changes to Terms" },
    { id: "law", label: "12. Governing Law" },
    { id: "contact", label: "13. Contact" },
];

export default function TermsOfServicePage() {
    // Optional: highlight the active section on scroll
    useEffect(() => {
        const handler = () => {
            const links = document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]");
            const headings = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];

            let current: string | null = null;
            for (const h of headings) {
                const rect = h.getBoundingClientRect();
                if (rect.top <= 120) current = h.id;
            }

            links.forEach((a) => {
                if (a.hash === `#${current}`) a.classList.add("text-blue-600");
                else a.classList.remove("text-blue-600");
            });
        };

        handler();
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const lastUpdated = "05 August 2025";

    return (
        <main className="max-w-6xl mx-auto px-6 py-12">
            {/* Header */}
            <header className="mb-10">
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-gray-600 bg-white">
                    🔒 Legal
                    <span className="mx-1">•</span>
                    <span className="text-gray-500">Last updated: {lastUpdated}</span>
                </div>
                <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
                    Terms of Service
                </h1>
                <p className="mt-3 text-gray-600 max-w-2xl">
                    Welcome to Workkerz.com. These Terms govern your access to and use of our
                    website, mobile app, and related services. By using our platform, you agree to
                    these Terms.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <a
                        href="mailto:support@workkerz.com?subject=ToS%20Query%20-%20Workkerz"
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                    >
                        Ask a question
                    </a>
                    <a
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                    >
                        Back to Home
                    </a>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8">
                {/* Sticky TOC */}
                <aside className="lg:sticky lg:top-24 h-max">
                    <nav className="rounded-2xl border bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 mb-3">On this page</p>
                        <ul className="space-y-2">
                            {sections.map((s) => (
                                <li key={s.id}>
                                    <a
                                        href={`#${s.id}`}
                                        data-toc-link
                                        className="block text-sm text-gray-700 hover:text-blue-600 transition"
                                    >
                                        {s.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Quick Help */}
                    <div className="mt-6 rounded-2xl border bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm">
                        <p className="text-sm font-semibold text-gray-800">Need help?</p>
                        <p className="mt-1 text-xs text-gray-600">
                            Read our{" "}
                            <Link href="/faq" className="text-blue-600 hover:underline">
                                FAQs
                            </Link>{" "}
                            or contact support.
                        </p>
                        <div className="mt-3 flex flex-col gap-2">
                            <p>
                                📧 Email:{" "}
                                <a
                                    href="https://mail.google.com/mail/?view=cm&fs=1&to=workkerz.com@gmail.com&su=Workkerz%20Inquiry&body=Hello%20Workkerz%20Team,"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition"
                                >
                                    workkerz.com@gmail.com
                                </a>
                            </p>
                            <p>
                                📞 Phone:{" "}
                                <a
                                    href="tel:07554522451"
                                    className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition"
                                >
                                    0755-4522451
                                </a>
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <article className="space-y-10">
                    {/* Notice */}
                    <div className="rounded-2xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-700">
                            <strong>Agreement:</strong> By creating an account or using Workkerz.com,
                            you confirm you have read and agree to these Terms. If you do not agree,
                            please discontinue using our services.
                        </p>
                    </div>

                    <Section id="definitions" title="1. Definitions">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong>“Platform”</strong> means the Workkerz.com website and mobile
                                application.
                            </li>
                            <li>
                                <strong>“Customer”</strong> means a person booking workers through our
                                Platform.
                            </li>
                            <li>
                                <strong>“Worker”</strong> means a service provider registered on our
                                Platform.
                            </li>
                            <li>
                                <strong>“We”, “Us”, “Our”</strong> refers to Workkerz.com.
                            </li>
                        </ul>
                    </Section>

                    <Section id="eligibility" title="2. Eligibility">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You must be at least 18 years old to use our services.</li>
                            <li>
                                Information you provide must be accurate and kept up to date. Misuse may
                                lead to account suspension.
                            </li>
                        </ul>
                    </Section>

                    <Section id="use-of-services" title="3. Use of Services">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                Customers can book verified workers (e.g., electrician, plumber, driver,
                                construction).
                            </li>
                            <li>
                                Workers must perform jobs professionally, comply with safety standards,
                                and follow lawful instructions.
                            </li>
                            <li>
                                Prohibited uses include fraud, fake bookings, harassment, illegal work
                                requests, or platform scraping/abuse.
                            </li>
                        </ul>
                    </Section>

                    <Section id="bookings-payments" title="4. Bookings & Payments">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Prices are visible before you confirm a booking.</li>
                            <li>
                                Payments may be made via UPI, Cards, Wallets (processed securely by
                                payment partners). Cash is at your discretion and risk.
                            </li>
                            <li>
                                Workkerz.com is not responsible for disputes from off-platform payments.
                            </li>
                        </ul>
                    </Section>

                    <Section id="cancellations-refunds" title="5. Cancellations & Refunds">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Cancellations follow rules shown at the time of booking.</li>
                            <li>Eligible refunds are processed within 7–10 business days.</li>
                            <li>
                                We may deduct applicable service or cancellation charges where relevant.
                            </li>
                        </ul>
                    </Section>

                    <Section id="worker-responsibilities" title="6. Worker Responsibilities">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Arrive on time and complete jobs to a professional standard.</li>
                            <li>No fraud, misrepresentation, or unsafe practices.</li>
                            <li>Account sharing and profile impersonation are prohibited.</li>
                        </ul>
                    </Section>

                    <Section id="customer-responsibilities" title="7. Customer Responsibilities">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Provide accurate job details and safe working conditions.</li>
                            <li>Do not request illegal or unsafe work.</li>
                            <li>Pay workers on time using agreed methods.</li>
                        </ul>
                    </Section>

                    <Section id="liability" title="8. Limitation of Liability">
                        <p>
                            Workkerz.com is a digital intermediary that connects Customers and Workers.
                            We are not responsible for actions of third parties, including delays,
                            damages, performance, or disputes. We will assist with dispute facilitation
                            through support, but our total liability, where not excluded by law, is
                            limited to the amount paid to us for the specific transaction (if any).
                        </p>
                    </Section>

                    <Section id="privacy" title="9. Data & Privacy">
                        <p>
                            Your data is handled as per our{" "}
                            <Link href="/privacy" className="text-blue-600 hover:underline">
                                Privacy Policy
                            </Link>
                            . By using the Platform, you consent to data collection and use as
                            described therein.
                        </p>
                    </Section>

                    <Section id="termination" title="10. Suspension & Termination">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                We may suspend or terminate accounts that violate these Terms or engage
                                in fraudulent/abusive activity.
                            </li>
                            <li>You may stop using the Platform at any time.</li>
                        </ul>
                    </Section>

                    <Section id="changes" title="11. Changes to Terms">
                        <p>
                            We may update these Terms from time to time. Updates will be posted here.
                            Continued use of the Platform after updates indicates your acceptance.
                        </p>
                    </Section>

                    <Section id="law" title="12. Governing Law">
                        <p>
                            These Terms are governed by the laws of India. Courts in Bhopal, Madhya
                            Pradesh shall have exclusive jurisdiction.
                        </p>
                    </Section>

                    <Section id="contact" title="13. Contact">
                        <div className="space-y-2">
                            <p>
                                📧 Email:{" "}
                                <a
                                    href="https://mail.google.com/mail/?view=cm&fs=1&to=workkerz.com@gmail.com&su=Workkerz%20Inquiry&body=Hello%20Workkerz%20Team,"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition"
                                >
                                    workkerz.com@gmail.com
                                </a>
                            </p>
                            <p>
                                📞 Phone:{" "}
                                <a
                                    href="tel:07554522451"
                                    className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition"
                                >
                                    0755-4522451
                                </a>
                            </p>
                            <p>🏢 Address: [Insert Office Address]</p>
                            <p>
                                🌐 Website:{" "}
                                <a href="/" className="text-blue-600 hover:underline">
                                    www.workkerz.com
                                </a>
                            </p>
                        </div>
                    </Section>

                    {/* Bottom CTA */}
                    <div className="rounded-2xl border bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
                        <p className="text-sm text-gray-700">
                            By continuing to use Workkerz.com, you acknowledge you have read and agree
                            to these Terms. If you have questions,{" "}
                            <a
                                href="mhttps://mail.google.com/mail/?view=cm&fs=1&to=workkerz.com@gmail.com&su=Workkerz%20Inquiry&body=Hello%20Workkerz%20Team,"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                contact support
                            </a>
                            .
                        </p>
                    </div>

                    {/* Back to top */}
                    <div className="flex justify-end">
                        <a
                            href="#"
                            className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                            ↑ Back to top
                        </a>
                    </div>
                </article>
            </div>

            {/* JSON-LD for SEO */}
            <script
                type="application/ld+json"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        name: "Terms of Service | Workkerz.com",
                        description:
                            "Read the Workkerz.com Terms of Service. Understand your rights and responsibilities as a customer or worker using our platform.",
                        dateModified: new Date("2025-08-05").toISOString(),
                        publisher: {
                            "@type": "Organization",
                            name: "Workkerz.com",
                            url: "https://www.workkerz.com",
                        },
                    }),
                }}
            />
        </main>
    );
}

function Section({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{title}</h2>
            <div className="mt-3 rounded-2xl border bg-white p-5 shadow-sm text-gray-700 leading-relaxed">
                {children}
            </div>
        </section>
    );
}
