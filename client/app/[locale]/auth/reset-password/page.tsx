import ResetPasswordForm from "@/components/reset-password-form";

export default async function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-8">
            <div className="w-full max-w-md">
                <ResetPasswordForm />
            </div>
        </div>
    )
}
