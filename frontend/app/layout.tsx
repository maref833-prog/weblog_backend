import type { Metadata } from "next";
import {Roboto, Geist, Finlandica,Inter} from 'next/font/google'
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin']});


export const metadata: Metadata = {
  title: "Demo Site | Dark/Light Mode",
  description: "تم حرفه‌ای با قابلیت دارک مود و لایت مود",
};
const robotos= Roboto({
  subsets:['latin'],variable:'--font-primary',
  weight: ['400', '500', '700', '900'],
})
const finlandica= Finlandica({
  subsets:['latin'],
  variable:'--font-sec'

})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-default'
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={cn(
        robotos.variable,
        finlandica.variable,
        inter.variable
      )} suppressHydrationWarning>
      <body className={robotos.className}>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          defaultTheme="light"     
          enableSystem={true}  
        >
          <Header>
            {children}
          </Header>
        </ThemeProvider>
      </body>
    </html>
  );
}