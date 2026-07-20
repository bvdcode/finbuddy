import type { Metadata } from "next";
import { headers } from "next/headers";
import { resources } from "@/lib/i18n/resources";
import { Providers } from "./providers";
import "./globals.css";

const copy = resources.ru.translation;

function requireHeader(value: string | null, name: string): string {
  if (value === null || value.trim().length === 0) {
    throw new Error("Missing request header: " + name);
  }

  return value.split(",")[0].trim();
}

function resolveProtocol(host: string, forwardedProtocol: string | null): string {
  const hostname = host.split(":")[0].toLowerCase();
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http";
  }

  const protocol = requireHeader(forwardedProtocol, "x-forwarded-proto");
  switch (protocol) {
    case "http":
      return "http";
    case "https":
      return "https";
    default:
      throw new Error("Invalid x-forwarded-proto request header");
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requireHeader(requestHeaders.get("host"), "host");
  const protocol = resolveProtocol(
    host,
    requestHeaders.get("x-forwarded-proto"),
  );
  const imageUrl = new URL("/og.png", protocol + "://" + host).toString();

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      locale: "ru_RU",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: copy.meta.socialImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.meta.title,
      description: copy.meta.description,
      images: [imageUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
