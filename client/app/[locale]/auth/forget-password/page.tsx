import ForgetPasswordForm from "@/components/forget-password-form";

export default async function ForgetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-8">
            <div className="w-full max-w-md">
                <ForgetPasswordForm />
            </div>
        </div>
    )
}
