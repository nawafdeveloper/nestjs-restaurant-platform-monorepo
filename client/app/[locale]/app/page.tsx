import { redirect } from "next/navigation";

export default async function MainAppPage() {
    redirect('/app/overview');
}
