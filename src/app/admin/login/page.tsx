import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { checkCredentials, createSession, getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

async function signIn(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(email, password)) redirect("/admin/login?error=1");
  await createSession(email);
  redirect("/admin");
}

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getSession()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-chalk px-4">
      <form action={signIn} className="w-full max-w-sm bg-paper p-8">
        <Image src="/brand/ftk-black.png" alt="FTK" width={764} height={685} className="h-16 w-auto" />
        <h1 className="mt-6 text-xl font-semibold">Sign in to the atelier</h1>
        <div className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="username" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
          </div>
          {error && <p className="text-sm text-coral" role="alert">That email and password don&rsquo;t match. Check them and try again.</p>}
          <button className="btn btn-ink w-full">Sign in</button>
        </div>
      </form>
    </main>
  );
}
