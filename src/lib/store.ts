import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'NGO' | 'GOVERNMENT' | 'ADMIN';
  region?: string;
  zone?: string;
  woreda?: string;
  organization?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

// Demo users for static hosting (no backend required)
const DEMO_USERS = [
  {
    id: 1,
    email: 'user@pastureai.et',
    password: 'user12345',
    name: 'Ahmed Ibrahim',
    role: 'USER' as const,
    region: 'Somali Region',
    zone: 'Shabelle',
    woreda: 'Mustahil'
  },
  {
    id: 2,
    email: 'ngo@pastureai.et',
    password: 'ngo12345',
    name: 'Dr. Fatima Hassan',
    role: 'NGO' as const,
    organization: 'FAO Ethiopia',
    region: 'Somali Region',
    zone: 'Jijiga',
    woreda: 'Jijiga'
  },
  {
    id: 3,
    email: 'gov@pastureai.et',
    password: 'gov12345',
    name: 'Kebede Tadesse',
    role: 'GOVERNMENT' as const,
    organization: 'NDRMC',
    region: 'Oromia Region',
    zone: 'Borena',
    woreda: 'Yabelo'
  },
  {
    id: 4,
    email: 'admin@pastureai.et',
    password: 'admin12345',
    name: 'System Administrator',
    role: 'ADMIN' as const,
    organization: 'PastureAI Team'
  }
];

// Safe function to get initial state
function getInitialState() {
  // Default state for SSR
  const defaultState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  };

  // Only access localStorage in browser
  if (typeof window === 'undefined') {
    return defaultState;
  }

  try {
    const stored = localStorage.getItem('pastureai-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user || null,
        token: parsed.token || null,
        isAuthenticated: !!(parsed.user && parsed.token),
        isLoading: false
      };
    }
  } catch (e) {
    // Invalid stored data
  }

  return defaultState;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  ...getInitialState(),

  // Client-side authentication (works on static hosting)
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Find user with matching credentials
      const user = DEMO_USERS.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Create simple token (for demo purposes)
      const token = `demo_token_${user.id}_${Date.now()}`;
      
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
        region: user.region,
        zone: user.zone,
        woreda: user.woreda
      };
      
      const newState = {
        user: userData,
        token: token,
        isAuthenticated: true,
        isLoading: false
      };
      
      set(newState);
      
      // Save to localStorage only in browser
      if (typeof window !== 'undefined') {
        localStorage.setItem('pastureai-auth', JSON.stringify({
          user: userData,
          token: token,
          isAuthenticated: true
        }));
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
    
    // Clear localStorage only in browser
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pastureai-auth');
    }
  },

  setUser: (user: User) => set({ user }),
  setLoading: (loading: boolean) => set({ isLoading: loading })
}));

// Dashboard state
interface DashboardState {
  activeTab: string;
  sidebarOpen: boolean;
  setActiveTab: (tab: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  activeTab: 'overview',
  sidebarOpen: true,
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open })
}));
