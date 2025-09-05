"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PostBlogForm from "../../components/PostBlogForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
    Search,
    Flame,
    Folder,
    Tag,
    SlidersHorizontal,
    TrendingUp,
    PlusCircle,
    Menu,
    X,
    Shield,
    Grid, 
    LayoutDashboard, 
    AlignJustify
} from "lucide-react";

export default function BlogPage() {
    const supabase = createClientComponentClient();
    const [blogs, setBlogs] = useState<any[]>([]);
    const [trending, setTrending] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [keyword, setKeyword] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [showAllTrending, setShowAllTrending] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            const { data } = await supabase
                .from("blogs")
                .select(
                    "id, title, slug, description, category, read_time, image, keywords, views, created_at"
                )
                .order("created_at", { ascending: false });

            if (data) {
                setBlogs(data);
                const topTrending = [...data].sort((a, b) => (b.views || 0) - (a.views || 0));
                setTrending(topTrending);
            }
        };
        fetchBlogs();
    }, []);

    const categories = ["all", ...new Set(blogs.map((b) => b.category).filter(Boolean))];
    const keywords = [...new Set(blogs.flatMap((b) => b.keywords || []).filter(Boolean))];
    const sortOptions = [
        { id: "newest", label: "Newest" },
        { id: "oldest", label: "Oldest" },
        { id: "popular", label: "Popular" },
    ];

    let filtered = blogs.filter((b) => {
        const matchesSearch =
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            (b.description || "").toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "all" || b.category === category;
        const matchesKeyword = keyword === "all" || (b.keywords?.includes(keyword));
        return matchesSearch && matchesCategory && matchesKeyword;
    });

    filtered = filtered.sort((a, b) => {
        if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sortBy === "popular") return (b.views || 0) - (a.views || 0);
        return 0;
    });

    const getButtonClass = (isActive: boolean) =>
        `px-3 py-1 rounded-full text-sm transition ${isActive
            ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg"
            : "bg-gray-200 hover:bg-gradient-to-r hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-gray-700"
        }`;

    const toggleAccordion = (section: string) =>
        setActiveAccordion(activeAccordion === section ? null : section);

    return (
        <main className="max-w-full mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 relative">
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Toggle */}
            <div className="flex justify-between items-center mb-6 lg:hidden">
                <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    Workkerz Blog
                </h1>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    {/* Replace Menu with Grid or LayoutDashboard for better UI */}
                    <Grid className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            <div className="lg:grid lg:grid-cols-4 lg:gap-10">
                {/* Sidebar */}
                <aside
                    className={`lg:col-span-1 space-y-6 bg-white lg:bg-gradient-to-b lg:from-indigo-50 lg:via-purple-50 lg:to-pink-50 rounded-2xl p-4 lg:p-6 shadow-lg transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          fixed lg:static top-0 left-0 h-full lg:h-[calc(100vh-6rem)] z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100`}
                >
                    {/* Mobile Close Button */}
                    <div className="flex justify-end mb-4 lg:hidden">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-800 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-gray-800">
                            <Search className="w-5 h-5 text-indigo-600" /> Search
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search blogs..."
                                className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Post Blog Button */}
                    <button
                        onClick={() => setFormOpen(true)}
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg hover:scale-105 transition mb-6 shadow-lg"
                    >
                        <PlusCircle className="w-5 h-5" /> Post New Blog
                    </button>

                    {/* Admin Manager */}
                    <Link
                        href="admin/blogs"
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-gray-700 via-gray-800 to-black text-white py-3 rounded-lg hover:scale-105 transition mb-6 shadow-lg"
                    >
                        <Shield className="w-5 h-5" /> Admin Manager
                    </Link>

                    {/* Accordion Sections */}
                    {/* Categories */}
                    <div className="mb-4">
                        <button
                            onClick={() => toggleAccordion("categories")}
                            className="flex justify-between w-full items-center px-3 py-2 bg-gray-100 rounded-lg font-medium text-gray-700 hover:bg-gray-200"
                        >
                            <span className="flex items-center gap-2">
                                <Folder className="w-5 h-5 text-indigo-600" /> Categories
                            </span>
                            <span>{activeAccordion === "categories" ? "-" : "+"}</span>
                        </button>
                        {activeAccordion === "categories" && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {categories.map((c) => (
                                    <button key={c} onClick={() => setCategory(c)} className={getButtonClass(category === c)}>
                                        {c === "all" ? "All" : c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort */}
                    <div className="mb-4">
                        <button
                            onClick={() => toggleAccordion("sort")}
                            className="flex justify-between w-full items-center px-3 py-2 bg-gray-100 rounded-lg font-medium text-gray-700 hover:bg-gray-200"
                        >
                            <span className="flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5 text-indigo-600" /> Sort By
                            </span>
                            <span>{activeAccordion === "sort" ? "-" : "+"}</span>
                        </button>
                        {activeAccordion === "sort" && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {sortOptions.map((opt) => (
                                    <button key={opt.id} onClick={() => setSortBy(opt.id)} className={getButtonClass(sortBy === opt.id)}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {keywords.length > 0 && (
                        <div className="mb-4">
                            <button
                                onClick={() => toggleAccordion("tags")}
                                className="flex justify-between w-full items-center px-3 py-2 bg-gray-100 rounded-lg font-medium text-gray-700 hover:bg-gray-200"
                            >
                                <span className="flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-indigo-600" /> Tags
                                </span>
                                <span>{activeAccordion === "tags" ? "-" : "+"}</span>
                            </button>
                            {activeAccordion === "tags" && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <button onClick={() => setKeyword("all")} className={getButtonClass(keyword === "all")}>
                                        All
                                    </button>
                                    {keywords.map((k) => (
                                        <button key={k} onClick={() => setKeyword(k)} className={getButtonClass(keyword === k)}>
                                            #{k}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Trending */}
                    {trending.length > 0 && (
                        <div className="mb-4">
                            <button
                                onClick={() => toggleAccordion("trending")}
                                className="flex justify-between w-full items-center px-3 py-2 bg-gray-100 rounded-lg font-medium text-gray-700 hover:bg-gray-200"
                            >
                                <span className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-red-500" /> Trending Posts
                                </span>
                                <span>{activeAccordion === "trending" ? "-" : "+"}</span>
                            </button>
                            {activeAccordion === "trending" && (
                                <div className="mt-2 space-y-4">
                                    {(showAllTrending ? trending : trending.slice(0, 3)).map((blog) => (
                                        <Link
                                            key={blog.id}
                                            href={`/blog/${blog.slug}`}
                                            className="flex items-center gap-3 group bg-white rounded-xl shadow hover:shadow-xl transition p-2"
                                        >
                                            {blog.image && (
                                                <img
                                                    src={blog.image}
                                                    alt={blog.title}
                                                    className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition"
                                                />
                                            )}
                                            <div>
                                                <h4 className="text-sm font-semibold group-hover:text-indigo-600 line-clamp-2">{blog.title}</h4>
                                                <p className="text-xs text-gray-500">{blog.views || 0} views</p>
                                            </div>
                                        </Link>
                                    ))}
                                    {trending.length > 3 && !showAllTrending && (
                                        <button
                                            onClick={() => setShowAllTrending(true)}
                                            className="mt-2 w-full text-indigo-600 font-medium hover:underline"
                                        >
                                            Show More
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <section className="lg:col-span-3 mt-6 lg:mt-0">
                    {/* Header */}
                    <div className="hidden lg:block text-center mb-12">
                        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            Workkerz Blog
                        </h1>
                        <p className="mt-3 text-lg text-gray-600">
                            Insights, updates, and resources to keep you ahead 🚀
                        </p>
                    </div>

                    {/* Post Blog Form */}
                    {formOpen && (
                        <div className="mb-8 relative">
                            <button
                                onClick={() => setFormOpen(false)}
                                className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-800"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <PostBlogForm />
                        </div>
                    )}

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.length === 0 ? (
                            <p className="text-gray-500 text-center col-span-full">No blogs found.</p>
                        ) : (
                            filtered.map((blog) => (
                                <Link
                                    key={blog.id}
                                    href={`/blog/${blog.slug}`}
                                    className="group bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg hover:shadow-2xl transition p-5 flex flex-col"
                                >
                                    {blog.image && (
                                        <div className="relative">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="rounded-xl mb-4 w-full h-48 object-cover group-hover:scale-[1.02] transition"
                                            />
                                            {blog.views > 100 && (
                                                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                    <Flame className="w-3 h-3" /> Trending
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                                        <span className="capitalize">{blog.category}</span>
                                        <span>{blog.read_time}</span>
                                    </div>
                                    <h2 className="text-xl font-bold mb-2 group-hover:text-indigo-600">{blog.title}</h2>
                                    <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{blog.description}</p>
                                    <div className="text-sm text-gray-400">
                                        {new Date(blog.created_at).toLocaleDateString()} • {blog.views || 0} views
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
