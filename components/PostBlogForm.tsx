"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { PlusCircle, Image as ImageIcon, X } from "lucide-react";

export default function PostBlogForm({ onSuccess }: { onSuccess?: (blog: any) => void }) {
  const supabase = createClientComponentClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Upload preview image
  const handleImageUpload = async (file: File) => {
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    setLoading(true);
    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(`${Date.now()}-${file.name}`, file, { cacheControl: "3600", upsert: false });

    if (error) {
      toast.error("Upload failed: " + error.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(data.path);
    if (urlData?.publicUrl) setImage(urlData.publicUrl);

    setLoading(false);
    toast.success("Image uploaded successfully!");
  };

  const handleKeywordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handlePostBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return toast.error("Title and Slug are required!");
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
          keywords,
          description,
          content,
          views: 0,
        },
      ])
      .select()
      .single();

    setLoading(false);
    if (error) return toast.error("Failed: " + error.message);
    toast.success("Blog posted successfully!");
    if (onSuccess) onSuccess(data);

    // Reset form
    setTitle(""); setSlug(""); setCategory(""); setReadTime("");
    setKeywords([]); setDescription(""); setContent(""); setImage(""); setPreview("");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
        <PlusCircle className="w-7 h-7 text-gradient-to-r from-indigo-500 to-purple-500" />
        Create Blog Post
      </h2>

      <form onSubmit={handlePostBlog} className="space-y-6">
        {/* Title & Slug */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Title *"
            className="border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Slug *"
            className="border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        {/* Category, ReadTime, Image */}
        <div className="grid md:grid-cols-3 gap-6">
          <input
            type="text"
            placeholder="Category"
            className="border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="text"
            placeholder="Read Time"
            className="border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
          />

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-2xl p-4 cursor-pointer hover:bg-indigo-50 transition">
            <ImageIcon className="w-8 h-8 text-indigo-500" />
            <span className="text-sm mt-1 text-gray-500">Select Cover Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />
          </label>
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-3">
            <img
              src={preview}
              alt="cover preview"
              className="h-60 w-full rounded-2xl object-cover shadow-sm"
            />
          </div>
        )}

        {/* Keywords */}
        <div>
          <input
            type="text"
            placeholder="Add keyword & press Enter"
            className="border px-4 py-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeywordAdd}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((k, i) => (
              <span
                key={i}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {k}
                <X
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setKeywords(keywords.filter((_, idx) => idx !== i))}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Description & Content */}
        <textarea
          placeholder="Short description"
          className="border px-4 py-3 rounded-2xl w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <textarea
          placeholder="Full content"
          className="border px-4 py-3 rounded-2xl w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "🚀 Publish Blog"}
        </button>
      </form>
    </div>
  );
}
