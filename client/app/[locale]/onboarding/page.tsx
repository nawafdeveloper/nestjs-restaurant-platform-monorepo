import OnboardingSteps from "@/components/onboarding-steps";
import OnboardingContent from "@/components/onboarding-content";
import LanguageSelector from "@/components/language-selector";

export default async function OnboardingMainPage() {
    return (
        <div className="flex min-h-screen">
            <LanguageSelector />
            <div
                className="hidden md:flex md:w-3/12 justify-center items-center"
                style={{ backgroundColor: '#f5f8ff' }}
            >
                <OnboardingSteps />
            </div>
            <div className="w-full md:w-9/12 flex items-center justify-center p-8">
                <OnboardingContent />
            </div>
        </div>
    )
}
