import { create } from 'zustand';
import type { UserInfo } from '@fateagent/shared-types';

type AuthState = {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
}));
