"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await fetch('/api/admin/auth');
        const data = await response.json();
        
        if (data.success && data.authenticated) {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication status check failed:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuthStatus();
  }, []);

  const handleLogin = async () => {
    if (!password.trim()) {
      toast.error("Please enter a password");
      return;
    }
    
    setLoggingIn(true);
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'admin', password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setAuthenticated(true);
        toast.success(data.message || "Admin authentication successful");
        setPassword('');
      } else {
        toast.error(data.message || "Authentication failed, please try again");
      }
    } catch (error) {
      console.error('Login request failed:', error);
      toast.error("Server error, please try again later");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setAuthenticated(false);
        toast.info(data.message || "Logged out of admin mode");
        router.push("/");
      } else {
        toast.error(data.message || "Logout failed, please try again");
      }
    } catch (error) {
      console.error('Logout request failed:', error);
      toast.error("Server error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Admin Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Please enter admin password"
                className="w-full"
                onKeyDown={(e) => e.key === "Enter" && !loggingIn && handleLogin()}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleLogin}
              disabled={loggingIn}
            >
              {loggingIn ? "Verifying..." : "Login"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated, show admin interface with logout button
  return (
    <div className="admin-layout min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <Button variant="destructive" onClick={handleLogout} size="sm">
          Exit Admin Mode
        </Button>
      </div>
      {children}
    </div>
  );
} 