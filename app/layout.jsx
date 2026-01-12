import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: "S-Mart. - Shop smarter",
  description: "S-Mart. - Shop smarter",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased transition-all duration-[2000000ms] opacity-0 pointer-events-none`}>
          <StoreProvider>
            <Toaster />
            {children}
          </StoreProvider>

        </body>
      </html>
    </ClerkProvider>
  );
}
