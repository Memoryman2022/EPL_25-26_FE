"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/auth/components/Context"; // adjust path as needed

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  const router = useRouter();
  const { setUser } = useUser(); // <-- get setUser from context

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Unknown error");

      if (type === "login") {
        // Assuming your login API returns user data and a token
        setUser(result.user);               // Set user context
        localStorage.setItem("token", result.token);  // Save token
        router.push("/profile");
      } else {
        alert(`${type} successful!`);
      }
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
          {loading
            ? "Please wait..."
            : type === "login"
            ? "Login"
            : "Register"}
        </button>
      </form>
    </div>
  );
}
