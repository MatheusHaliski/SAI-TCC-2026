"use client";
import Image from "next/image";
import AuthShell from "../components/AuthShell";
import SignupForm from "./SignupForm";

export default function SignupViewPage() {
     const pathname = usePathname();
    useEffect(() => {
        const t = getDevSessionToken();
        if (!t) {
        router.replace("/devauthgate");
        }
        console.log(t);
        ensureSharedAccessToken();
    }, [router]);
    return (
        <AuthShell
            title="Start your Dine Explorer journey"
            subtitle="Create your account in minutes"
        >

            <div
                className={[
                    "space-y-4",
                    "rounded-3xl",
                    "rounded-2xl border-8 border-orange-500", // ✅ requested
                    "bg-white/45",
                    "fe-glass-panel",
                    "p-6 sm:p-8",
                    "shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
    ].join(" ")}
            >
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-600">
                    Start your Dine Explorer journey
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-orange-600">
                    Build your new account
                </h1>
                <SignupForm />
            </div>
        </AuthShell>
    );
}
