import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/ui/providers/theme-provider";

const poppins = Poppins({
  subsets:["latin"],
  weight:["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: "NeuroIDE",
  description: "NeuroIDE - Code With Intelligence",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <Providers session={session}>
          {children}
        </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
