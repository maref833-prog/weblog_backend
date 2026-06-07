// components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Music, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg",
      color: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600",
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg",
      color: "hover:bg-black/50 dark:hover:bg-white",
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg",
      color: "hover:bg-red-600",
    },
    {
      name: "Telegram",
      href: "https://telegram.org",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg",
      color: "hover:bg-blue-500",
    },
  ];

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Atheism Blog
                </h2>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, sit aperiam impedit.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/musics" className="text-sm text-muted-foreground hover:text-primary transition-colors">Musics</Link></li>
              <li><Link href="/posts" className="text-sm text-muted-foreground hover:text-primary transition-colors">Posts</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>hamidlali@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+989921499833</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Lorem Ipsum ...</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full bg-secondary/50 transition-all duration-300 hover:scale-110 ${social.color}`}
                  aria-label={social.name}
                >
                  <div className="relative w-5 h-5">
                    <img
                      src={social.icon}
                      alt={social.name}
                      className="w-full h-full object-contain brightness-0 dark:brightness-100"
                    />
                  </div>
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Subscribe to our newsletter for updates
            </p>
          </div>
        </div>

 

      </div>
    </footer>
  );
}