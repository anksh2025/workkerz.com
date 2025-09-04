// app/privacy-policy/page.tsx
import React from "react";

export const metadata = {
    title: "Privacy Policy | Workkerz.com",
    description:
        "Our Privacy Policy explains how Workkerz.com collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-16 text-gray-800">
            {/* Heading */}
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-2">
                    🔒 Privacy Policy
                </h1>
                <p className="text-sm text-gray-500 mt-2">Last Updated: 31 August 2025</p>
            </header>

            {/* Sections */}
            <div className="space-y-12">
                <Section
                    number="1"
                    title="Who This Policy Applies To"
                    content={
                        <p>
                            This policy applies to all users of Workkerz.com — customers,
                            workers, and visitors who interact with our website or mobile app.
                        </p>
                    }
                />

                <Section
                    number="2"
                    title="Information We Collect"
                    content={
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card
                                title="Personal Info"
                                items={[
                                    "Full Name",
                                    "Phone Number",
                                    "Email Address",
                                    "Service Address",
                                ]}
                            />
                            <Card
                                title="Booking Info"
                                items={[
                                    "Work type & details",
                                    "Preferred worker category",
                                    "Work history & reviews",
                                ]}
                            />
                            <Card
                                title="Payment Info"
                                items={["Transaction ID", "Refund & billing details"]}
                            />
                            <Card
                                title="Technical Data"
                                items={[
                                    "IP address & device info",
                                    "App version & usage logs",
                                    "Crash reports",
                                ]}
                            />
                        </div>
                    }
                />

                <Section
                    number="3"
                    title="How We Use Your Information"
                    content={
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To enable bookings, cancellations, and tracking</li>
                            <li>To assign workers based on location & preferences</li>
                            <li>To process payments and refunds</li>
                            <li>To improve services and app performance</li>
                            <li>To prevent fraud and ensure safety</li>
                        </ul>
                    }
                />

                <Section
                    number="4"
                    title="Sharing Your Information"
                    content={
                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200 text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-3 py-2 text-left">Shared With</th>
                                        <th className="border px-3 py-2 text-left">Purpose</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ["Workers", "To complete the work at your location"],
                                        ["Payment Partners", "To process secure transactions"],
                                        ["Support Staff", "To resolve service issues"],
                                        ["Legal Authorities", "When required by law"],
                                    ].map(([entity, purpose], i) => (
                                        <tr key={i} className="odd:bg-white even:bg-gray-50">
                                            <td className="border px-3 py-2">{entity}</td>
                                            <td className="border px-3 py-2">{purpose}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                />

                <Section
                    number="5"
                    title="Data Security"
                    content={
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                            <p className="text-sm text-red-700">
                                ⚠️ We never ask for OTPs, passwords, or banking PINs. Do not
                                share them with anyone claiming to be from Workkerz.com.
                            </p>
                        </div>
                    }
                />

                <Section
                    number="6"
                    title="Your Rights"
                    content={
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access and update your data</li>
                            <li>Request account deletion</li>
                            <li>Opt-out of marketing emails</li>
                            <li>Request data portability</li>
                        </ul>
                    }
                />

                <Section
                    number="7"
                    title="Contact Us"
                    content={
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
                            <p>🏢 Address: Bhopal, India</p>
                            <p>
                                🌐 Website:{" "}
                                <a href="/" className="text-blue-600 hover:underline">
                                    www.workkerz.com
                                </a>
                            </p>
                        </div>
                    }
                />
            </div>
        </div>
    );
}

// ================== REUSABLE COMPONENTS ==================
function Section({
    number,
    title,
    content,
}: {
    number: string;
    title: string;
    content: React.ReactNode;
}) {
    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-indigo-600 font-bold">{number}.</span> {title}
            </h2>
            <div className="text-gray-700 leading-relaxed">{content}</div>
        </section>
    );
}

function Card({ title, items }: { title: string; items: string[] }) {
    return (
        <div className="bg-gray-50 border rounded-xl p-5 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-2">{title}</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                {items.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        </div>
    );
}
