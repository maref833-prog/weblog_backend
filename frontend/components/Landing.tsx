import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="relative min-h-[93vh] w-full flex  justify-center overflow-hidden">
      {/* بک‌گراند تصویر */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/landing/landing2.png"
          alt="Background"
          fill
          className="object-cover   mask-b-from-60% mask-b-to-100%"
          priority

        />
        {/* اوورلی تیره برای خوانایی بهتر متن */}
        <div className="absolute inset-0 bg-black/10 dark:bg-black/35" />
      </div>

      {/* محتوا */}
      <div className="relative top-30 md:top-10 lg:top-22 2xl:top-35  z-10 text-center text-white px-4">
        <h1 className="text-3xl  sm:text-6xl lg:text-7xl font-bold mb-4">
            Welcome to WebSite
        </h1>
        <p className="xs:text-sm sm:text-lg md:text-xl mb-2 md:mb-4 lg:text-2xl max-w-2xl mx-auto font-mono">
          Read All Posts
        </p>
        <Link
          href="/posts"
          className="inline-block bg-background text-foreground px-8 py-2 lg:py-3 lg:my-2 lg:px-10 rounded-lg hover:outline-foreground ease-in-out delay-50 hover:outline-2 duration-500 transition-colors"
        >
          Show
        </Link>

      </div>
    </section>
  );
}