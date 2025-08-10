"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/auth/components/Context"; // adjust path as needed
import type { FieldErrors } from "react-hook-form";

const baseSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = baseSchema.extend({
  userName: z.string().min(3, "Username must be at least 3 characters"),
});

type LoginFormData = z.infer<typeof baseSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

type Props = {
  type: "login" | "register";
};

export default function AuthForm({ type }: Props) {
  const schema = type === "register" ? registerSchema : baseSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const { setUser } = useUser();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Unknown error");

      if (!result.user || !result.user._id) {
        console.error("Bad response:", result);
        throw new Error("User data missing in API response");
      }

      setUser(result.user);
      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.user._id);

      router.push(`/profile`);
      alert(`${type} successful!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md backdrop-blur-md p-8 rounded-xl shadow-lg flex flex-col space-y-4"
      >
       {type === "register" && (
  <>
    <input
      type="text"
      placeholder="Username"
      {...register("userName")}
      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {/* Cast errors to RegisterFormData errors */}
    {(errors as FieldErrors<RegisterFormData>).userName && (
      <p className="text-red-500 text-sm">
        {(errors as FieldErrors<RegisterFormData>).userName?.message}
      </p>
    )}
  </>
)}


        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-yellow-400 font-semibold p-2 rounded hover:bg-blue-800 transition disabled:opacity-50"
        >
          {loading ? "Please wait..." : type === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}
