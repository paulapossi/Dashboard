import type { Metadata } from "next";
import "./globals.css"; // 🔥 Hier laden wir deine Styles!

export const metadata: Metadata = {
    title: "Life OS Dashboard",
    description: "Mein persönliches Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="de">
            <body>
                {children}
            </body>
        </html>
    );
}