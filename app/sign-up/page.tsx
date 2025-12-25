"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpInput } from "@/lib/validators/auth";

export default function SignUp() {
    const router = useRouter();
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: SignUpInput) => {
        await signUp.email(
            {
                email: data.email,
                password: data.password,
                name: `${data.firstName} ${data.lastName}`,
                image: image ? await convertImageToBase64(image) : "",
                callbackURL: "/dashboard", // optional if you handle redirect manually
            },
            {
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    toast.success("Account created successfully!");
                    router.push("/dashboard");
                },
            }
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center px-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create an account</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
                        {/* Names */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>First name</Label>
                                <Input {...register("firstName")} />
                                {errors.firstName && (
                                    <p className="text-xs text-red-500">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label>Last name</Label>
                                <Input {...register("lastName")} />
                                {errors.lastName && (
                                    <p className="text-xs text-red-500">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input type="email" {...register("email")} />
                            {errors.email && (
                                <p className="text-xs text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <Label>Password</Label>
                            <Input type="password" {...register("password")} />
                            {errors.password && (
                                <p className="text-xs text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="grid gap-2">
                            <Label>Confirm password</Label>
                            <Input type="password" {...register("confirmPassword")} />
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Image */}
                        <div className="grid gap-2">
                            <Label>Profile image (optional)</Label>
                            <div className="flex items-end gap-4">
                                {imagePreview && (
                                    <div className="relative w-16 h-16 overflow-hidden rounded">
                                        <Image
                                            src={imagePreview}
                                            alt=""
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex gap-2 w-full">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <X
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setImage(null);
                                                setImagePreview(null);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                "Create account"
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter>
                    <div className="flex justify-center w-full border-t py-4">
                        <p className="text-center text-xs text-neutral-500">
                            built with{" "}
                            <span className="dark:text-white/70 cursor-pointer">
                                better-auth.
                            </span>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}