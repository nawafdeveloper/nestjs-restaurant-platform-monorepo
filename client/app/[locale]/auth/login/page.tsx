import AuthHeros from "@/components/auth-hero";
import LoginForm from "@/components/login-form";

export default async function LoginPage() {
    return (
        <div className="flex min-h-screen bg-[#E4EBF2]">
            <div
                className="hidden md:flex md:w-1/2 justify-center items-center bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/auth-hero-bg.png')" }}
            >
                <AuthHeros />
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}