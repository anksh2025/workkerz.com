
"use client"
// app/blog/page.tsx
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function BlogPage() {
  const blogPosts = [
    {
      slug: "benefits-of-hiring-verified-workers-online",
      title: "Top 10 Benefits of Hiring Verified Workers Online",
      desc: "Discover why hiring verified workers online ensures safety, reliability, and peace of mind for households and businesses in India.",
      keywords: ["benefits of hiring workers online", "verified workers India"],
      readTime: "5 min read",
    },
    {
      slug: "how-workkerz-helps-daily-workers-find-jobs",
      title: "How Workkerz.com Helps Daily Workers Find Jobs Easily",
      desc: "Learn how Workkerz connects daily workers with reliable employers to create more job opportunities in India.",
      keywords: ["daily wage jobs", "worker app India", "jobs for workers online"],
      readTime: "4 min read",
    },
    {
      slug: "best-way-to-hire-plumber-electrician-driver",
      title: "Best Way to Hire a Plumber, Electrician or Driver in Your City",
      desc: "Find trusted plumbers, electricians, and drivers instantly with Workkerz – your local worker booking platform.",
      keywords: ["hire plumber online", "hire driver near me", "electrician booking app"],
      readTime: "6 min read",
    },
    {
      slug: "trust-and-transparency-in-worker-hiring",
      title: "Why Trust & Transparency Matters in Worker Hiring",
      desc: "Building trust in worker hiring is essential for safety and reliability. Here’s why verified workers make all the difference.",
      keywords: ["worker trust", "safe worker booking", "hire verified workers"],
      readTime: "7 min read",
    },
    {
      slug: "daily-wage-vs-monthly-worker",
      title: "Daily Wage vs Monthly Worker – Which Option is Better?",
      desc: "Confused between hiring daily wage or monthly workers? Read our guide to choose the right option based on your needs.",
      keywords: ["daily wage vs monthly worker", "worker cost in India"],
      readTime: "5 min read",
    },
  ];

  const [search, setSearch] = useState("");

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.desc.toLowerCase().includes(search.toLowerCase()) ||
      post.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {/* SEO Meta */}
      <Head>
        <title>Workkerz Blog – Tips for Hiring Daily Workers Safely</title>
        <meta
          name="description"
          content="Read Workkerz blogs to learn hiring tips, worker safety, labour market insights & daily wage solutions in India."
        />
        <meta
          name="keywords"
          content="daily worker hiring tips, worker safety India, daily wage jobs blog, labour booking guide"
        />
      </Head>

      <main className="max-w-7xl mx-auto px-6 py-14">
        {/* Hero */}
        <section className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            📝 Workkerz Blog
          </h1>
          <p className="text-lg text-gray-600">
            Insights, Hiring Tips & Worker Safety Guides
          </p>

          {/* Search bar */}
          <div className="mt-6 flex justify-center">
            <input
              type="text"
              placeholder="🔍 Search blog posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-lg px-5 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 shadow-sm"
            />
          </div>
        </section>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  {/* Top Banner */}
                  <div className="h-32 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-4xl">📖</span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {post.desc}
                    </p>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.keywords.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-auto flex justify-between items-center text-xs text-gray-500 pt-5">
                      <span>{post.readTime}</span>
                      <span className="text-indigo-600 font-medium">
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No blog posts found for "{search}"
            </p>
          )}
        </div>
      </main>
    </>
  );
}
