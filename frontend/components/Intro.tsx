"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState } from "react";

export default function Intro() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const features = [
    {
      id: 1,
      title: "Share Your Opinion",
      shortDesc: "Express your thoughts freely",
      description: "Join meaningful conversations and share your unique perspective with our community. Engage in thoughtful discussions and connect with like-minded individuals who share your interests. Our platform provides a safe space for everyone to voice their opinions respectfully.",
      animation: "/intro/intro77.lottie",
      icon: "/intro/check.lottie",
      gradient: "from-blue-500/10 to-purple-500/10",
      color: "text-blue-500",
    },
    {
      id: 2,
      title: "See New Posts",
      shortDesc: "Stay updated always",
      description: "Never miss out on fresh content! Get real-time updates on the latest articles, music releases, and engaging discussions from our vibrant community. Subscribe to your favorite topics and receive personalized recommendations based on your interests.",
      animation: "/intro/intro11.lottie",
      icon: "/intro/zang.lottie",
      gradient: "from-green-500/10 to-teal-500/10",
      color: "text-green-500",
    },
    {
      id: 3,
      title: "Lesson Musics",
      shortDesc: "Learn music professionally",
      description: "Master music with our comprehensive lessons. From beginner to advanced levels, learn from expert instructors and access high-quality educational content anytime, anywhere. Includes video tutorials, practice exercises, and live Q&A sessions with professional musicians.",
      animation: "/intro/intro88.lottie",
      icon: "/intro/check.lottie",
      gradient: "from-orange-500/10 to-red-500/10",
      color: "text-orange-500",
    },
  ];

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16 lg:mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-4">
          Why Choose Us?
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover amazing features designed to enhance your experience
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="group relative bg-gradient-to-br from-background to-secondary/30 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-border/50"
          >
            {/* Background Gradient on Hover */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} 
            />

            {/* Card Content */}
            <div className="relative p-6 md:p-8 flex flex-col items-center text-center">
              {/* Main Animation */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 mb-4">
                <DotLottieReact
                  src={feature.animation}
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>

              {/* Title with Icon */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-7 h-7 md:w-8 md:h-8">
                  <DotLottieReact
                    loop
                    autoplay
                    src={feature.icon}
                    className="w-full h-full"
                  />
                </div>
                <h3 className={`text-xl md:text-2xl font-bold ${feature.color}`}>
                  {feature.title}
                </h3>
              </div>

              {/* Short Description */}
              <p className="text-sm text-muted-foreground mb-2 font-medium">
                {feature.shortDesc}
              </p>

              {/* Full Description with Toggle */}
              <div className={`transition-all duration-500 overflow-hidden ${
                expandedId === feature.id ? "max-h-96" : "max-h-0"
              }`}>
                <div className="h-px w-12 bg-border mx-auto my-3" />
                <p className="text-xs md:text-sm text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* See More / See Less Button */}
              <button
                onClick={() => toggleExpand(feature.id)}
                className="mt-4 text-xs font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 group/btn"
              >
                {expandedId === feature.id ? (
                  <>
                    See less
                    <svg className="w-3 h-3 rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                ) : (
                  <>
                    See more
                    <svg className="w-3 h-3 group-hover/btn:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}