import { createContext, use, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../../component/loader/Loader";

interface User{
    id: string;
    email: string;
    username: string;
    role: string;
}

interface SignupData {
    username: string;
    email: string;
    password: string;
    name: string;
    surname: string;
}

interface AuthenticationContextType{
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => void;
}

const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export function useAuthentication(){
    return useContext(AuthenticationContext);
}

export function AuthenticationContextProvider(){
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    const isOnAuthPage =
        location.pathname === "/login" ||
        location.pathname === "/signup";

    const isPublicPage = 
        isOnAuthPage ||
        location.pathname.startsWith("/profile/");

    const login = async (username: string, password: string) => {
        const response = await fetch(import.meta.env.VITE_API_URL+"/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        if (response.ok){
            const {token} = await response.json();
            localStorage.setItem("token", token);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to login");
        }
    }

    const signup = async (data: SignupData) => {
        const response = await fetch(import.meta.env.VITE_API_URL+"/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            const text = await response.text();
            try {
                const json = JSON.parse(text);
                throw new Error(json.message);
            } catch {
                throw new Error(text);
            }
        }
        
        // If we get here, the signup was successful
        // No need to parse response or store token since we're redirecting to login
    }

    const logout = async() => {
        localStorage.removeItem("token");
        setUser(null);
    }

    const fetchUser = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL+"/auth/test", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                throw new Error("Authentication failed");
            }
                const user = await response.json();
                setUser(user);
        } catch(e){
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(()=>{
        if (user){
            return;
        }
        fetchUser();
    }, [user, location]);
    
    if(isLoading){
        return <Loader/>;
    }
    if (!user && !isOnAuthPage && !isLoading){ 
        return <Navigate to="/login"/>;
    }
    if (user && isOnAuthPage && !isLoading){
        return <Navigate to="/"/>;
    }

    return (
        <AuthenticationContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            signup,
            logout
        }}>
            <Outlet />
        </AuthenticationContext.Provider>
    );
}
