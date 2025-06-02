"use client"

import type React from "react"

import { useState } from "react"
// Update the import paths below if your files are located elsewhere
import { useAuth } from "../../context/AuthContext"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Home, Dumbbell, Apple, User, LogOut, Menu, TrendingUp, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: "Inicio", href: "/dashboard", icon: Home },
    { name: "Ejercicios", href: "/exercises", icon: Dumbbell },
    { name: "Nutrición", href: "/nutrition", icon: Apple },
    { name: "Progreso", href: "/progress", icon: TrendingUp },
    { name: "Perfil", href: "/profile", icon: User },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Dialog open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-64 p-0 h-full max-w-none">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6">
              <h2 className="text-2xl font-bold text-primary">MyFit Journey</h2>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-gray-600 hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary">MyFit Journey</h2>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-gray-600 hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="p-6 pt-16 md:pt-6">{children}</main>
      </div>
    </div>
  )
}
