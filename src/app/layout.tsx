import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { TRPCReactProvider } from "@/components/trpc-provider";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
	title: "Slidir",
	description: "Slidir",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const satoshi = localFont({
	src: [
		{
			path: "../../public/fonts/Satoshi-Black.woff2",
			weight: "900",
			style: "normal",
		},
		{
			path: "../../public/fonts/Satoshi-BlackItalic.woff2",
			weight: "900",
			style: "italic",
		},
		{
			path: "../../public/fonts/Satoshi-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../public/fonts/Satoshi-BoldItalic.woff2",
			weight: "700",
			style: "italic",
		},
		{
			path: "../../public/fonts/Satoshi-Italic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "../../public/fonts/Satoshi-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../../public/fonts/Satoshi-LightItalic.woff2",
			weight: "300",
			style: "italic",
		},
		{
			path: "../../public/fonts/Satoshi-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/Satoshi-MediumItalic.woff2",
			weight: "500",
			style: "italic",
		},
		{
			path: "../../public/fonts/Satoshi-Regular.woff2",
			weight: "400",
			style: "normal",
		},
	],
	variable: "--font-satoshi",
	preload: false,
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={satoshi.className} suppressHydrationWarning>
			<body>
				<NuqsAdapter>
					<TRPCReactProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							{children}
							<Toaster />
						</ThemeProvider>
					</TRPCReactProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
