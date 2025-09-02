// app/blog/[slug]/page.tsx
import Link from "next/link";
import { Metadata } from "next";

// Blog posts data (mock, can later fetch from DB or API)
const blogPosts = [
  {
    slug: "benefits-of-hiring-verified-workers-online",
    title: "Top 10 Benefits of Hiring Verified Workers Online",
    desc: "Discover why hiring verified workers online ensures safety, reliability, and peace of mind for households and businesses in India.",
    content: `
Hiring verified workers online offers numerous benefits such as safety, trust, easy booking, and transparency. 
With Workkerz, you can avoid risks of hiring unknown workers and instead rely on verified professionals who are background-checked and reliable.

✅ Increased Safety  
✅ Hassle-free Hiring  
✅ Verified Backgrounds  
✅ Time-Saving  
✅ Professional Reliability  

Whether you need a plumber, electrician, or daily labour, verified workers ensure peace of mind.
    `,
    keywords: ["benefits of hiring workers online", "verified workers India"],
  },
  {
    slug: "how-workkerz-helps-daily-workers-find-jobs",
    title: "How Workkerz.com Helps Daily Workers Find Jobs Easily",
    desc: "Learn how Workkerz connects daily workers with reliable employers to create more job opportunities in India.",
    content: `
Workkerz bridges the gap between job seekers and employers by providing a trusted platform for workers.  
Daily wage earners can easily find verified jobs in their area and connect with genuine employers.

🚀 Easy Job Access  
🚀 Verified Employers  
🚀 Increased Trust  

This helps reduce unemployment and ensures fairness in daily wage work.
    `,
    keywords: ["daily wage jobs", "worker app India", "jobs for workers online"],
  },
  // Add more posts...
];

// ✅ Generate SEO metadata dynamically
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: "Workkerz Blog – Post Not Found",
      description: "The blog post you are looking for does not exist.",
    };
  }

  return {
    title: `${post.title} | Workkerz Blog`,
    description: post.desc,
    keywords: post.keywords,
  };
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Post Not Found</h1>
        <p className="text-gray-600 mt-4">The blog you are looking for does not exist.</p>
        <Link href="/blog" className="mt-6 inline-block text-indigo-600 font-medium">
          ← Back to Blog
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {post.title}
      </h1>
      <p className="text-gray-600 mb-6">{post.desc}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {post.keywords.map((tag, i) => (
          <span
            key={i}
            className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Blog Content */}
      <article className="prose prose-lg prose-indigo max-w-none">
        {post.content
          .trim()
          .split("\n")
          .filter((line) => line.trim() !== "")
          .map((line, i) => (
            <p key={i}>{line}</p>
          ))}
      </article>

      {/* Back Link */}
      <div className="mt-12">
        <Link
          href="/blog"
          className="text-indigo-600 font-medium hover:underline"
        >
          ← Back to Blog
        </Link>
      </div>
    </main>
  );
}
