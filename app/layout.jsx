import "./globals.css";
import Providers from "../components/layout/Providers";

export const metadata = {
  title: "Marcus Aurelius Photography",
  description:
    "Award-winning photographer capturing weddings, fashion, and life's most significant moments.",

  icons: {
    icon: "/aadhir_logo.png",
    shortcut: "/aadhir_logo.png",
    apple: "/aadhir_logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
