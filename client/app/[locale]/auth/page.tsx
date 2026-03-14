import { redirect } from "next/navigation";

export default async function AuthMainPage() {
    return redirect('/auth/login')
}