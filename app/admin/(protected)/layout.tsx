'use client'
import AdminSidebar from '@/components/admin-sidebar'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {

  
  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar onLogout={handleLogout} />  
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

export default Layout
