"use client";
import Link from "next/link";
import ThemeToggle from "./Theme-toggle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <>
      <header className="border-b border-border sticky top-0  bg-background/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex justify-start items-center gap-5">

                      <h1 className="text-sm md:text-xl lg:text-3xl font-bold tracking-tight text-foreground font-sans">
              Atheism Blog
            </h1>

          </div>
          <div className="flex gap-2 md:gap-6 items-center">
<Select>
  <SelectTrigger className="w-15 ">
    <SelectValue placeholder="EN" className="" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>

      <SelectItem value="En">EN</SelectItem>
      <SelectItem value="Fa">FA</SelectItem>

    </SelectGroup>
  </SelectContent>
</Select>
            <Link 
              href="/" 
              className="relative group"
            >
              <p className="pb-0.5 text-foreground/80 group-hover:text-primary transition-colors duration-300 text-xs md:text-lg ">
                Musics
              </p>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link 
              href="/posts" 
              className="relative group"
            >
              <p className="pb-0.5 text-foreground/80 group-hover:text-primary transition-colors duration-300 text-xs md:text-lg ">
                Posts
              </p>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}