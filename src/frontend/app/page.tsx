import Footer from '@/components/shop/Footer/Footer'
import Navbar from '@/components/shop/Navbar/Navbar'
import Topbar from '@/components/shop/Topbar/Topbar'
import SectionHeader from '@/components/shop/SectionHeader/SectionHeader'
import React from 'react'

export default function page() {
  return (
    <div>
      <Navbar/>
      <Topbar/>
          <div>
      <SectionHeader
        title='Shops'
        subtitle="List Of All Shops On This Site"
      />
      {/* اینجا کارت‌های فروشگاه رو قرار بده */}
    </div>
      <Footer/>
      </div>
  )
}
