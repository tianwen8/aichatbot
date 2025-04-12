"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!password.trim()) {
      toast.error("请输入密码");
      return;
    }
    
    setLoggingIn(true);
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success("管理员验证成功");
        router.push('/admin');
      } else {
        toast.error(data.message || "验证失败，请重试");
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      toast.error("服务器错误，请稍后重试");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">管理员登录</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              管理员密码
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入管理员密码"
              className="w-full"
              onKeyDown={(e) => e.key === "Enter" && !loggingIn && handleLogin()}
            />
          </div>
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loggingIn}
          >
            {loggingIn ? "验证中..." : "登录"}
          </Button>
        </div>
      </div>
    </div>
  );
} 