"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	const handleSignout = async () => {
		await authClient.signOut();
		router.replace("/authenticate");
	};

	return <Button onClick={handleSignout}>Sign Out</Button>;
}
