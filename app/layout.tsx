import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Fashion AI — Seu Estilista Pessoal",
    description: "Organize seu guarda-roupa, crie looks com IA e descubra seu estilo único.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            {/* Anti-flash: apply saved theme before first paint */}
            <script dangerouslySetInnerHTML={{ __html: `
(function(){try{var t=localStorage.getItem('sai_theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();
            ` }} />
        </head>
        <body>
            {children}
        </body>
        </html>
    );
}
