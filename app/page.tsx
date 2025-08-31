"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Users, ClipboardList, MapPin, Star } from "lucide-react";

export default function Home() {
  const [ratingData, setRatingData] = useState<{
    average: number;
    count: number;
    breakdown: number[];
  }>({
    average: 0,
    count: 0,
    breakdown: [0, 0, 0, 0, 0], // 5★, 4★, 3★, 2★, 1★
  });

  useEffect(() => {
    // 👇 Example API call for ratings
    fetch("/api/rating")
      .then((res) => res.json())
      .then((data) =>
        setRatingData({
          average: data.average,
          count: data.count,
          breakdown: data.breakdown || [40, 25, 20, 10, 5], // fallback dummy
        })
      );
  }, []);

  const supabase = createClientComponentClient();
  const [surveyCount, setSurveyCount] = useState<number>(0);
  const [workerCount, setWorkerCount] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: surveys } = await supabase
          .from("surveys")
          .select("*", { count: "exact", head: true });

        const { count: workers } = await supabase
          .from("workers")
          .select("*", { count: "exact", head: true });

        setSurveyCount(surveys || 0);
        setWorkerCount(workers || 0);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [supabase]);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container py-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-center leading-tight">
            India's First <span className="text-brand-600">On-Demand</span>
            <br /> Labor Platform
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-center text-gray-600">
            Welcome to Workkerz.com – India’s Digital Labor Marketplace
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/survey"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transform transition duration-300"
            >
              🚀 Survey Form
            </Link>

            <Link
              href="/onboarding"
              className="px-6 py-3 rounded-full bg-white font-semibold text-gray-700 ring-2 ring-gray-200 shadow-md hover:bg-gray-50 hover:shadow-lg hover:scale-105 transform transition duration-300"
            >
              ✨ Onboarding
            </Link>
          </div>

          {/* Live Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Workers */}
            <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-150 text-black rounded-3xl shadow-md hover:shadow-lg hover:scale-105 transition transform duration-300 flex flex-col items-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-400/20 mb-3">
                <Users className="w-7 h-7" />
              </div>
              <div className="text-4xl font-bold">{workerCount}</div>
              <div className="text-xl opacity-90">Onboard Workers</div>
            </div>

            {/* Surveys */}
            <div className="p-5 bg-gradient-to-br from-green-100 to-green-180 text-black rounded-3xl shadow-md hover:shadow-lg hover:scale-105 transition transform duration-300 flex flex-col items-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-400/20 mb-3">
                <ClipboardList className="w-7 h-7" />
              </div>
              <div className="text-4xl font-bold">{surveyCount}</div>
              <div className="text-xl opacity-90">Total Surveys</div>
            </div>

            {/* Cities */}
            <div className="p-5 bg-gradient-to-br from-orange-100 to-orange-180 text-black rounded-3xl shadow-md hover:shadow-lg hover:scale-105 transition transform duration-300 flex flex-col items-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-400/20 mb-3">
                <MapPin className="w-7 h-7" />
              </div>
              <div className="text-4xl font-bold">Bhopal</div>
              <div className="text-xl opacity-90">City</div>
            </div>

            {/* Ratings */}
            <div className="p-5 bg-gradient-to-br from-yellow-100 to-yellow-150 text-black rounded-3xl shadow-md hover:shadow-lg hover:scale-105 transition transform duration-300 flex flex-col items-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-400/20 mb-3">
                <Star className="w-7 h-7 fill-green-400-200" />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold">{ratingData.average.toFixed(1)}</span>
                <Star className="w-5 h-5 fill-green-300" />
              </div>
              <div className="text-sm opacity-90">{ratingData.count} Ratings</div>

              {/* Stars row */}
              <div className="flex mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${i < Math.round(ratingData.average)
                      ? "fill-green-400 text-yellow-300"
                      : "text-yellow-300/40"
                      }`}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-12">
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">
          How It Works
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Whether you're a <span className="font-semibold text-blue-600">Customer</span>
          or a <span className="font-semibold text-green-600">Worker</span>, Workkerz makes the process
          simple, transparent, and reliable.
        </p>

        {/* Slideshow */}
        <div className="mb-16">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet !bg-gray-400",
              bulletActiveClass: "swiper-pagination-bullet-active !bg-blue-600",
            }}
            autoplay={{ delay: 3500 }}
            loop={true}
            className="rounded-3xl shadow-2xl overflow-hidden"
          >
            {[
              { src: "/posters/poster1.jpg", alt: "Hire Trusted Workers", caption: "Hire Verified Workers Easily" },
              { src: "/posters/poster2.jpg", alt: "Book Jobs Instantly", caption: "Instant Job Booking & Secure Payment" },
              { src: "/posters/poster3.jpg", alt: "Earn with Dignity", caption: "Empowering Workers Across India" },
            ].map((slide, i) => (
              <SwiperSlide key={i}>
                <div className="relative group">
                  {/* Background Image */}
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-[35rem] md:h-[28rem] object-cover transform g transition duration-700"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                  {/* Caption */}
                  <div className="absolute bottom-6 left-6 text-green-400 max-w-lg">
                    <h3 className="text-xl md:text-2xl font-bold drop-shadow-lg">
                      {slide.caption}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Customers & Workers */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Customers */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold mb-8 text-blue-600 text-center">
              For Customers
            </h3>
            <ol className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Select Service",
                  desc: "Choose from plumbing, electrical, cleaning, and more",
                },
                {
                  step: "2",
                  title: "Choose Worker",
                  desc: "View profiles, ratings, and select your preferred worker",
                },
                {
                  step: "3",
                  title: "Track & Pay",
                  desc: "Real-time tracking and secure online payment",
                },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-4">
                  <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Workers */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold mb-8 text-green-600 text-center">
              For Workers
            </h3>
            <ol className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Sign Up & Verify",
                  desc: "Complete profile with ID verification and skills",
                },
                {
                  step: "2",
                  title: "Receive Jobs",
                  desc: "Get job notifications based on your location and skills",
                },
                {
                  step: "3",
                  title: "Work & Earn",
                  desc: "Complete jobs and get paid instantly to your wallet",
                },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-4">
                  <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-600 text-white font-bold shadow">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-10">
        <div className="container">
          {/* Logo + Intro */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 font-semibold text-white text-2xl">
              <Image
                src="/logo.png"
                alt="Workkerz Logo"
                width={55}
                height={55}
                className="rounded-xl"
              />
              <span>Workkerz</span>
            </div>
            <p className="mt-2 text-sm md:text-base max-w-xs md:max-w-sm">
              India's trusted on-demand labor platform.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-10 text-center md:text-left">
            {/* For Customers */}
            <div>
              <h4 className="font-semibold text-white mb-3">For Customers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#">Book Services</a></li>
                <li><a href="#">Track Orders</a></li>
                <li><a href="#">Customer Support</a></li>
                <li><a href="#">Help Center</a></li>
              </ul>
            </div>

            {/* For Workers */}
            <div>
              <h4 className="font-semibold text-white mb-3">For Workers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#">Join Platform</a></li>
                <li><a href="#">Earn Money</a></li>
                <li><a href="#">Worker Support</a></li>
                <li><a href="#">Training Resources</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold text-white mb-3">Follow Us</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">Instagram</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm md:text-base">
            © {new Date().getFullYear()} <span className="font-semibold text-white">Workkerz.com</span> — All rights reserved.
            <br className="md:hidden" />
            Made with ❤️ for India's workforce.
          </div>
        </div>
      </footer>

    </>
  );
}
