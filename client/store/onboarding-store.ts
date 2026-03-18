import { create } from 'zustand';
import { createStoreAndBranchAction } from '@/app/[locale]/onboarding/actions';

type StoreInfo = {
    name: string;
    nameAr: string;
    nameEn: string;
    slug: string;
    descriptionAr: string;
    descriptionEn: string;
    type: string;
    phone: string;
    logoFile: File | null;
};

type WorkingHours = {
    sun: [string, string];
    mon: [string, string];
    tue: [string, string];
    wed: [string, string];
    thu: [string, string];
    fri: [string, string];
    sat: [string, string];
};

type BranchInfo = {
    name: string;
    city: string;
    address: string;
    latitude: string;
    longitude: string;
    workingHours: WorkingHours;
};

type SubmitResult =
    | { success: true; store: any; branch: any }
    | { success: false; error: string; message?: string };

type OnboardingState = {
    step: number;
    loading: boolean;
    storeInfo: StoreInfo;
    branchInfo: BranchInfo;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateStoreInfo: (patch: Partial<StoreInfo>) => void;
    updateBranchInfo: (patch: Partial<BranchInfo>) => void;
    updateWorkingHours: (day: keyof WorkingHours, value: [string, string]) => void;
    submitOnboarding: () => Promise<SubmitResult>;
};

const defaultWorkingHours: WorkingHours = {
    sun: ['09:00', '18:00'],
    mon: ['09:00', '18:00'],
    tue: ['09:00', '18:00'],
    wed: ['09:00', '18:00'],
    thu: ['09:00', '18:00'],
    fri: ['', ''],
    sat: ['09:00', '18:00'],
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
    step: 0,
    loading: false,
    storeInfo: {
        name: '',
        nameAr: '',
        nameEn: '',
        slug: '',
        descriptionAr: '',
        descriptionEn: '',
        type: '',
        phone: '',
        logoFile: null,
    },
    branchInfo: {
        name: '',
        city: '',
        address: '',
        latitude: '',
        longitude: '',
        workingHours: defaultWorkingHours,
    },
    setStep: (step) => set({ step }),
    nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 2) })),
    prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
    updateStoreInfo: (patch) =>
        set((state) => ({ storeInfo: { ...state.storeInfo, ...patch } })),
    updateBranchInfo: (patch) =>
        set((state) => ({ branchInfo: { ...state.branchInfo, ...patch } })),
    updateWorkingHours: (day, value) =>
        set((state) => ({
            branchInfo: {
                ...state.branchInfo,
                workingHours: {
                    ...state.branchInfo.workingHours,
                    [day]: value,
                },
            },
        })),

    submitOnboarding: async () => {
        const { storeInfo, branchInfo } = get();
        set({ loading: true });

        const result = await createStoreAndBranchAction(
            {
                name: storeInfo.nameEn,
                nameAr: storeInfo.nameAr,
                slug: storeInfo.slug,
                description: storeInfo.descriptionEn,
                descriptionAr: storeInfo.descriptionAr,
                phone: `+966${storeInfo.phone}`,
            },
            {
                name: branchInfo.name,
                city: branchInfo.city,
                address: branchInfo.address,
            }
        );

        set({ loading: false });
        return result;
    },
}));