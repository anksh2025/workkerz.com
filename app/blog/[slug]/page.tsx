"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Flame, Folder, X, PlusCircle } from "lucide-react";
import PostBlogForm from "../../../components/PostBlogForm";

export default function BlogDetail() {
  const { slug } = useParams();
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [successHighlight, setSuccessHighlight] = useState(false);

  // Fetch blog by slug
  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (error) {
          console.error("Error fetching blog:", error.message);
          setBlog(null);
        } else if (!data) {
          console.warn("Blog not found for slug:", slug);
          setBlog(null);
        } else {
          setBlog(data);
          await supabase.rpc("increment_views", { blog_id: data.id });
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // Show loading skeleton
  if (loading) {
    return (
      <main className="max-w-3xl mx-auto p-6 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-2xl mb-6"></div>
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <p className="p-10 text-center text-gray-500">Blog not found.</p>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 relative">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-600 mb-6 hover:underline"
      >
        ← Back
      </button>

      {/* Blog Image */}
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="rounded-2xl mb-6 w-full h-64 md:h-96 object-cover"
        />
      )}

      {/* Title with optional success underline */}
      <h1
        className={`text-4xl md:text-5xl font-extrabold mb-4 relative ${
          successHighlight
            ? "after:absolute after:left-0 after:bottom-0 after:h-1 after:w-full after:bg-red-500 after:animate-[underline_1s_ease-out]"
            : ""
        }`}
      >
        {blog.title}
      </h1>

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-6">
        <span className="flex items-center gap-1">
          <Folder className="w-4 h-4" /> {blog.category}
        </span>
        <span>{blog.read_time}</span>
        <span className="flex items-center gap-1">
          <Flame className="w-4 h-4 text-red-500" /> {blog.views} views
        </span>
      </div>

      {/* Blog content */}
      <article className="prose max-w-none text-gray-700 mb-20">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>

      {/* Floating Post Blog Button */}
      <button
        onClick={() => setShowForm(true)}
        className="hidden md:flex items-center gap-2 fixed bottom-8 right-8 bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition z-50"
      >
        <PlusCircle className="w-5 h-5" /> Post New Blog
      </button>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-6">
              <PostBlogForm
                onSuccess={(newBlog: any) => {
                  setShowForm(false);
                  setSuccessHighlight(true);
                  setTimeout(() => setSuccessHighlight(false), 1500); // remove highlight after animation
                  router.push(`/blog/${newBlog.slug}`);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes underline {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
