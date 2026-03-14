import { create } from 'zustand';

type StoreInfo = {
    name: string;
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
    workingHours: WorkingHours;
};

type OnboardingState = {
    step: number;
    storeInfo: StoreInfo;
    branchInfo: BranchInfo;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateStoreInfo: (patch: Partial<StoreInfo>) => void;
    updateBranchInfo: (patch: Partial<BranchInfo>) => void;
    updateWorkingHours: (day: keyof WorkingHours, value: [string, string]) => void;
};

const defaultWorkingHours: WorkingHours = {
    sun: ['09:00', '18:00'],
    mon: ['09:00', '18:00'],
    tue: ['09:00', '18:00'],
    wed: ['09:00', '18:00'],
    thu: ['09:00', '18:00'],
    fri: ['', ''],
    sat: ['09:00', '18:00']
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
    step: 0,
    storeInfo: {
        name: '',
        type: '',
        phone: '',
        logoFile: null
    },
    branchInfo: {
        name: '',
        city: '',
        address: '',
        workingHours: defaultWorkingHours
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
                    [day]: value
                }
            }
        }))
}));
