'use client'

import AdminSidebar from '@/components/admin-sidebar'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  
  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
  }

  return (
    <div>
      {/* <AdminSidebar onLogout={handleLogout} /> */}
      {children}
    </div>
  )
}

export default Layout
