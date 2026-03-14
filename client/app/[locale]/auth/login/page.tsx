import LoginForm from "@/components/login-form";

export default async function LoginPage() {
    return (
        <div className="flex min-h-screen">
            <div
                className="hidden md:block md:w-1/2"
                style={{ backgroundColor: '#0E79EB' }}
            />
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}