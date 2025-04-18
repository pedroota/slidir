"use client";

import { authClient } from "@/lib/auth-client";
import { SWR_KEYS } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Icons } from "./ui/icons";
import { Input } from "./ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "./ui/input-otp";
import { Separator } from "./ui/separator";

const OTP_LENGTH = 6;

const authenticateFormSchema = z.object({
	email: z.string().email(),
});

const otpFormSchema = z.object({
	otp: z.string().length(OTP_LENGTH),
});

export function AuthenticateForm() {
	const router = useRouter();
	const [otpSent, setOtpSent] = useQueryState<boolean>(
		"otpSent",
		parseAsBoolean.withDefault(false),
	);
	const [email, setEmail] = useQueryState<string>("email", parseAsString);

	const form = useForm<z.infer<typeof authenticateFormSchema>>({
		resolver: zodResolver(authenticateFormSchema),
		defaultValues: {
			email: "",
		},
	});

	const otpForm = useForm<z.infer<typeof otpFormSchema>>({
		resolver: zodResolver(otpFormSchema),
		defaultValues: {
			otp: "",
		},
	});

	const {
		mutate: sendVerificationOtp,
		isPending: isPendingSendVerificationOtp,
	} = useMutation({
		mutationFn: (data: z.infer<typeof authenticateFormSchema>) => {
			return authClient.emailOtp.sendVerificationOtp({
				email: data.email,
				type: "sign-in",
			});
		},
		mutationKey: [SWR_KEYS.SendVerifyEmailOtp],
		onSuccess: (data) => {
			const success = data?.data?.success ?? false;
			const error = data?.error?.message ?? null;

			if (!success) {
				toast.error(error, {
					position: "bottom-center",
				});
				return;
			}

			setOtpSent(success);
		},
	});

	const { mutate: verifyOtp, isPending: isPendingVerifyOtp } = useMutation({
		mutationFn: (data: { email: string; otp: string }) => {
			return authClient.signIn.emailOtp({
				email: data.email,
				otp: data.otp,
			});
		},
		mutationKey: [SWR_KEYS.VerifyEmailOtp],
		onSuccess: (data) => {
			const isError = data?.error ?? false;
			const errorMessage = data?.error?.message ?? null;

			if (!isError) {
				router.replace("/");
				return;
			}

			toast.error(errorMessage, {
				position: "bottom-center",
			});
		},
		onError: (error) => {
			toast.error(error.message, {
				position: "bottom-center",
			});
		},
	});

	const onSubmit = form.handleSubmit(async (formData) => {
		setEmail(formData.email);
		sendVerificationOtp(formData);
	});

	const onOtpSubmit = otpForm.handleSubmit(async (formData) => {
		if (!email) {
			otpForm.setError("otp", {
				message: "Email is required",
			});
			toast.error("Email is required", {
				position: "bottom-center",
			});
			return;
		}

		verifyOtp({
			email: email,
			otp: formData.otp,
		});
	});

	const { mutate: signInWithGoogle, isPending: isPendingSignInWithGoogle } =
		useMutation({
			mutationFn: () => {
				return authClient.signIn.social({
					provider: "google",
				});
			},
			mutationKey: [SWR_KEYS.SignInWithGoogle],
		});

	const isAuthLoading =
		isPendingSendVerificationOtp ||
		isPendingVerifyOtp ||
		isPendingSignInWithGoogle;

	return (
		<div className="w-full max-w-sm px-4">
			<AnimatePresence mode="wait">
				{otpSent ? (
					<motion.div
						key="otp-form"
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -50 }}
						transition={{
							duration: 0.2,
							ease: "easeInOut",
						}}
						className="flex h-72 w-full flex-col items-center justify-center gap-8"
					>
						<div className="flex flex-col items-center justify-center gap-2">
							<h3 className="font-bold text-3xl">Verify your email</h3>

							<p className="text-muted-foreground">
								Enter the 6-digit code sent to your email
							</p>
						</div>

						<Form {...otpForm}>
							<form
								onSubmit={onOtpSubmit}
								className="flex w-full flex-col items-center justify-center gap-6"
							>
								<FormField
									control={otpForm.control}
									name="otp"
									render={({ field }) => {
										return (
											<FormItem>
												<FormControl>
													<InputOTP
														maxLength={OTP_LENGTH}
														pattern={REGEXP_ONLY_DIGITS}
														disabled={isAuthLoading}
														{...field}
													>
														<InputOTPGroup>
															<InputOTPSlot className="h-12 w-12" index={0} />
															<InputOTPSlot className="h-12 w-12" index={1} />
															<InputOTPSlot className="h-12 w-12" index={2} />
														</InputOTPGroup>
														<InputOTPSeparator />
														<InputOTPGroup>
															<InputOTPSlot className="h-12 w-12" index={3} />
															<InputOTPSlot className="h-12 w-12" index={4} />
															<InputOTPSlot className="h-12 w-12" index={5} />
														</InputOTPGroup>
													</InputOTP>
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>

								<div className="w-full max-w-xs rounded-[1.0625rem] bg-linear-to-br from-primary via-primary/80 to-primary/60 p-[3px] shadow-lg">
									<Button
										disabled={isAuthLoading}
										type="submit"
										className="h-12 w-full rounded-xl"
									>
										{isAuthLoading ? (
											<Loader className="mr-2 h-4 w-4 animate-spin" />
										) : null}
										Verify email
									</Button>
								</div>
							</form>
						</Form>
					</motion.div>
				) : (
					<motion.div
						key="email-form"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, x: -50 }}
						transition={{
							duration: 0.2,
							ease: "easeInOut",
						}}
						className="h-72 w-full"
					>
						<Button
							variant="outline"
							onClick={() => {
								signInWithGoogle();
							}}
							disabled={isAuthLoading}
							className="h-12 w-full rounded-xl"
						>
							{isPendingSignInWithGoogle ? (
								<Loader className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Icons.Google />
							)}
							Sign in with Google
						</Button>

						<div className="my-6 flex items-center gap-2">
							<Separator className="flex-1" />
							<span className="text-muted-foreground text-sm">or</span>
							<Separator className="flex-1" />
						</div>

						<Form {...form}>
							<form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder="john@slidir.com"
													className="h-12 rounded-xl"
													type="email"
													disabled={isAuthLoading}
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="rounded-[1.0625rem] bg-linear-to-br from-primary via-primary/80 to-primary/60 p-[3px] shadow-lg">
									<Button
										disabled={isAuthLoading}
										type="submit"
										className="h-12 w-full rounded-xl"
									>
										{isPendingSendVerificationOtp ? (
											<Loader className="mr-2 h-4 w-4 animate-spin" />
										) : null}
										Sign in with email
									</Button>
								</div>
							</form>
						</Form>
					</motion.div>
				)}
			</AnimatePresence>

			<p className="mt-8 text-center text-muted-foreground text-sm">
				By signing up, you agree to our{" "}
				<Link href="/terms" className="text-primary">
					Terms of Service
				</Link>
			</p>
		</div>
	);
}
