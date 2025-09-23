import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Trash2, Edit2, Save, X, Pin, Search } from "lucide-react";

export default function AdminPanel() {
  const supabase = createClientComponentClient();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [inlineData, setInlineData] = useState<any>({
    title: "",
    category: "",
    read_time: "",
    content: "",
    slug: "",
    keywords: "",
  });
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("posts");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: blogData, error: blogError } = await supabase
        .from("blogs")
        .select("*")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (blogError) throw blogError;

      if (blogData) {
        setBlogs(blogData);
        const uniqueCategories = [...new Set(blogData.map((b) => b.category).filter(Boolean))];
        setCategories(uniqueCategories);
      }
    } catch (err: any) {
      console.error("Error fetching blogs:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) showToast("Failed to delete blog", "error");
    else {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      showToast("Blog deleted", "error");
    }
  };

  const handlePin = async (id: number, pinned: boolean) => {
    const { error } = await supabase.from("blogs").update({ pinned: !pinned }).eq("id", id);
    if (error) showToast("Failed to pin/unpin blog", "error");
    else {
      fetchData();
      showToast(pinned ? "Unpinned blog" : "Pinned blog");
    }
  };

  const handleInlineEdit = (blog: any) => {
    setEditingId(blog.id);
    setInlineData({
      title: blog.title,
      category: blog.category,
      read_time: blog.read_time,
      content: blog.content,
      slug: blog.slug,
      keywords: Array.isArray(blog.keywords) ? blog.keywords.join(", ") : blog.keywords || "",
    });
  };

  const handleInlineSave = async (id: number) => {
    let keywordsValue: any = inlineData.keywords;
    if (typeof keywordsValue === "string" && keywordsValue.includes(",")) {
      keywordsValue = keywordsValue.split(",").map((k: string) => k.trim()).filter(Boolean);
    }

    const { error } = await supabase
      .from("blogs")
      .update({ ...inlineData, keywords: keywordsValue })
      .eq("id", id);

    if (error) {
      showToast("Failed to update blog", "error");
      return;
    }

    setEditingId(null);
    fetchData();
    showToast("Blog updated");
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.content?.toLowerCase().includes(search.toLowerCase()) ||
      b.slug?.toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(b.keywords)
        ? b.keywords.join(", ").toLowerCase().includes(search.toLowerCase())
        : b.keywords?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-lg p-4 flex flex-col md:h-screen">
        <h1 className="text-xl font-bold text-indigo-600 mb-6 text-center md:text-left">Admin Panel</h1>
        <nav className="space-y-4 text-gray-700 text-center md:text-left">
          <p
            onClick={() => setActiveView("posts")}
            className={`cursor-pointer hover:text-indigo-600 ${activeView === "posts" ? "text-indigo-600 font-semibold" : ""}`}
          >
            📝 Posts
          </p>
          <p
            onClick={() => setActiveView("categories")}
            className={`cursor-pointer hover:text-indigo-600 ${activeView === "categories" ? "text-indigo-600 font-semibold" : ""}`}
          >
            📂 Categories
          </p>
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-2 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">{activeView}</h2>
          {activeView === "posts" && (
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-1 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 border rounded-lg shadow-sm text-sm w-full focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">❌ {error}</p>}

        {!loading && !error && (
          <>
            {/* POSTS VIEW */}
            {activeView === "posts" && (
              <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
                <h3 className="font-semibold mb-4 text-gray-700">All Blogs</h3>
                <table className="w-full min-w-[600px] md:min-w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr className="text-left text-gray-600 text-sm md:text-base">
                      <th className="p-2 md:p-3">Title</th>
                      <th className="p-2 md:p-3">Category</th>
                      <th className="p-2 md:p-3">Slug</th>
                      <th className="p-2 md:p-3">Keywords</th>
                      <th className="p-2 md:p-3">Read Time</th>
                      <th className="p-2 md:p-3">Content</th>
                      <th className="p-2 md:p-3">Views</th>
                      <th className="p-2 md:p-3">Created</th>
                      <th className="p-2 md:p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.map((blog, idx) => (
                      <tr key={blog.id} className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition`}>
                        <td className="p-2 md:p-3">
                          {editingId === blog.id ? (
                            <input
                              type="text"
                              value={inlineData.title}
                              onChange={(e) => setInlineData((d: any) => ({ ...d, title: e.target.value }))}
                              className="border px-2 py-1 rounded w-full text-sm"
                            />
                          ) : (
                            blog.title
                          )}
                        </td>

                        <td className="p-2 md:p-3">
                          {editingId === blog.id ? (
                            <input
                              type="text"
                              value={inlineData.category}
                              onChange={(e) => setInlineData((d: any) => ({ ...d, category: e.target.value }))}
                              className="border px-2 py-1 rounded w-full text-sm"
                            />
                          ) : (
                            <span className="text-indigo-600">{blog.category}</span>
                          )}
                        </td>

                        <td className="p-2 md:p-3 text-sm">{blog.slug}</td>
                        <td className="p-2 md:p-3 text-sm">{Array.isArray(blog.keywords) ? blog.keywords.join(", ") : blog.keywords}</td>
                        <td className="p-2 md:p-3 text-sm">{blog.read_time} min</td>
                        <td className="p-2 md:p-3 max-w-[150px] md:max-w-md text-sm">{blog.content?.slice(0, 120)}...</td>
                        <td className="p-2 md:p-3 text-sm">{blog.views}</td>
                        <td className="p-2 md:p-3 text-sm">{new Date(blog.created_at).toLocaleDateString()}</td>
                        <td className="p-2 md:p-3 text-right flex gap-1 md:gap-2 justify-end">
                          {editingId === blog.id ? (
                            <>
                              <button onClick={() => handleInlineSave(blog.id)} className="p-1 md:p-2 bg-green-500 text-white rounded hover:bg-green-600">
                                <Save className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                              <button onClick={() => setEditingId(null)} className="p-1 md:p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                                <X className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleInlineEdit(blog)} className="p-1 md:p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                              <button
                                onClick={() => handlePin(blog.id, blog.pinned)}
                                className={`p-1 md:p-2 ${blog.pinned ? "bg-yellow-600" : "bg-yellow-500"} text-white rounded hover:bg-yellow-700`}
                              >
                                <Pin className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                              <button onClick={() => handleDelete(blog.id)} className="p-1 md:p-2 bg-red-500 text-white rounded hover:bg-red-600">
                                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CATEGORIES VIEW */}
            {activeView === "categories" && (
              <div className="bg-white rounded-2xl shadow p-4 md:p-6 overflow-x-auto">
                <h3 className="font-semibold mb-4 text-gray-700">Categories (from Blogs)</h3>
                <table className="w-full min-w-[300px] md:min-w-full border-collapse text-sm md:text-base">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 md:p-3 text-left">Category</th>
                      <th className="p-2 md:p-3 text-right">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, idx) => (
                      <tr key={cat} className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                        <td className="p-2 md:p-3">{cat}</td>
                        <td className="p-2 md:p-3 text-right">{blogs.filter((b) => b.category === cat).length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white shadow-lg text-sm md:text-base ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
