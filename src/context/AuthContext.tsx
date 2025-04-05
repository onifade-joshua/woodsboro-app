import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // Firestore instance

type User = {
  email: string;
  name: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (email: string) => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Firestore logging function
  const logEvent = async (message: string, email?: string) => {
    try {
      await addDoc(collection(db, "user_logs"), {
        message,
        email: email || "Unknown",
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error logging event:", error);
    }
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log(`[User Auto-Logged In]: ${parsedUser.email}`);
      logEvent("[User Auto-Logged In]", parsedUser.email);
    }
    setIsLoading(false);
  }, []);

  // Utility to generate a name from an email
  const generateNameFromEmail = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  // Signup function
  const signup = async (email: string) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const name = generateNameFromEmail(email);

    const newUser = {
      email,
      name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);

    console.log(`[User Signed Up]: ${newUser.email}`);
    await logEvent("[User Signed Up]", newUser.email);
  };

  // Login function
  const login = async (email: string) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const name = generateNameFromEmail(email);

    const newUser = {
      email,
      name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);

    console.log(`[User Signed In]: ${newUser.email}`);
    await logEvent("[User Signed In]", newUser.email);
  };

  // Logout function
  const logout = async () => {
    if (user) {
      console.log(`[User Logged Out]: ${user.email}`);
      await logEvent("[User Logged Out]", user.email);
    }
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
