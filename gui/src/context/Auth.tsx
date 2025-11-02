import { createContext, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setOrganizations,
  setSelectedOrgId,
} from "../redux/slices/profilesSlice";

// Auth removed - simplified context with defaults
interface AuthContextType {
  profiles: any[];
  selectedProfile: any | null; // Changed to object for compatibility
  session: null;
  logout: () => void;
  login: (_useOnboarding?: boolean) => Promise<boolean>;
  organizations: any[];
  refreshProfiles: (_reason?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const orgs = useAppSelector((store) => store.profiles.organizations);
  const selectedProfile = useAppSelector(
    (store) => store.profiles.selectedProfile,
  );

  const login = async (_useOnboarding: boolean = false) => {
    // Auth removed - always return false
    return false;
  };

  const logout = () => {
    // Auth removed - just clear organizations except personal
    dispatch(setOrganizations(orgs.filter((org) => org.id === "personal")));
    dispatch(setSelectedOrgId("personal"));
  };

  const refreshProfiles = async (_reason?: string) => {
    // Auth removed - no-op
  };

  // Ensure profiles is always an array and filter out undefined/null
  const allProfiles = orgs
    .flatMap((org) => org?.profiles || [])
    .filter((p) => p != null);

  // Ensure selectedProfile is found or default to first profile
  // Return the full profile object for compatibility with components
  const actualSelectedProfile =
    allProfiles.find((p) => p?.id === selectedProfile) ||
    allProfiles[0] ||
    null;

  return (
    <AuthContext.Provider
      value={{
        profiles: allProfiles,
        selectedProfile: actualSelectedProfile, // Return full object, not just ID
        session: null,
        logout,
        login,
        organizations: orgs.filter((org) => org != null),
        refreshProfiles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    // Return defaults if context is missing
    return {
      profiles: [],
      selectedProfile: null, // Can be null or ProfileDescription object
      session: null,
      logout: () => {},
      login: async () => false,
      organizations: [],
      refreshProfiles: async () => {},
    };
  }
  return context;
}
