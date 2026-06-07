// components/FeaturedPosts.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
}

export default function FeaturedPosts() {
  const posts: Post[] = [
    {
      id: 1,
      title: "The Future of Music: AI and Creativity",
      excerpt: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita, unde! Quos distinctio beatae sed, voluptatum rerum odio, cupiditate illum praesentium commodi magnam porro libero accusamus quidem quam ab a ipsa!",
      image: "/posts/1.jpg",
      author: "Hamid Lali",
      date: "Dec 15, 2024",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "10 Essential Guitar Techniques for Beginners",
      excerpt: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita, unde! Quos distinctio beatae sed, voluptatum rerum odio, cupiditate illum praesentium commodi magnam porro libero accusamus quidem quam ab a ipsa!",
      image: "/posts/2.jpg",
      author: "Hamid Lali",
      date: "Dec 12, 2024",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "Understanding Music Theory: A Complete Guide",
      excerpt: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita, unde! Quos distinctio beatae sed, voluptatum rerum odio, cupiditate illum praesentium commodi magnam porro libero accusamus quidem quam ab a ipsa!",
      image: "/posts/3.jpg",
      author: "Hamid Lali",
      date: "Dec 10, 2024",
      readTime: "10 min read",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      {/* Section Header */}

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-4">
          Latest Posts
        </h2>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group bg-background border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            {/* Post Image */}
            <Link href={`/posts/${post.id}`} className="block overflow-hidden relative h-48 md:h-56">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

            </Link>

            {/* Post Content */}
            <div className="p-5 md:p-6">
              {/* Post Meta */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Title */}
              <Link href={`/posts/${post.id}`}>
                <h3 className="text-lg md:text-xl font-bold mb-2 hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </Link>

              {/* Excerpt */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {post.excerpt}
              </p>

              {/* Read More Link */}
              <Link
                href={`/posts/${post.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
              >
                Read more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* View All Posts Button */}
      <div className="text-center">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all duration-300 text-sm md:text-base font-medium group"
        >
          <span>View All Posts</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>
    </div>
  );
}