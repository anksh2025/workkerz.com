"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PlusCircle, Image as ImageIcon } from "lucide-react";

interface PostBlogFormProps {
  onSuccess?: (newBlog: any) => void; // Add optional callback
}

export default function PostBlogForm({ onSuccess }: PostBlogFormProps) {
  const supabase = createClientComponentClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState("");
  const [image, setImage] = useState("");
  const [keywords, setKeywords] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePostBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return alert("⚠️ Title and Slug are required");

    setLoading(true);

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          title,
          slug,
          category,
          read_time: readTime,
          image,
          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
          description,
          content,
          views: 0,
        },
      ])
      .select()
      .single(); // get the inserted row

    setLoading(false);

    if (!error && data) {
      setTitle("");
      setSlug("");
      setCategory("");
      setReadTime("");
      setImage("");
      setKeywords("");
      setDescription("");
      setContent("");
      alert("✅ Blog posted successfully!");

      if (onSuccess) onSuccess(data); // trigger callback with new blog
    } else {
      alert("❌ Failed to post blog: " + error?.message);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <PlusCircle className="w-8 h-8 text-indigo-600" />
          Create New Blog Post
        </h2>
        <p className="text-gray-500 mt-2">
          Fill in the details below to publish a new article.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handlePostBlog} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. How to Learn Next.js"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 border border-indigo-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. how-to-learn-nextjs"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 border border-indigo-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
              required
            />
          </div>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g. Web Development"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 border border-indigo-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Read Time
            </label>
            <input
              type="text"
              placeholder="e.g. 5 min"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              className="mt-1 border border-indigo-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Cover Image URL
            </label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="mt-1 border border-indigo-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Keywords
          </label>
          <input
            type="text"
            placeholder="e.g. next.js, react, supabase"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="mt-1 border border-indigo-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Short Description
          </label>
          <textarea
            placeholder="Brief summary of the blog post..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 border border-indigo-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Full Content
          </label>
          <textarea
            placeholder="Write your full blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="mt-1 border border-indigo-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "🚀 Publish Blog"}
        </button>
      </form>
    </div>
  );
}
