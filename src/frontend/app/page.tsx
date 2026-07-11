import Footer from '@/components/shop/Footer/Footer'
import Navbar from '@/components/shop/Navbar/Navbar'
import Topbar from '@/components/shop/Topbar/Topbar'
import SectionHeader from '@/components/shop/SectionHeader/SectionHeader'
import React from 'react'
import ShopList from '@/components/shop/ShopList/ShopList'

export default function page() {
  return (
    <div>
      <Navbar/>
      <Topbar/>
          <div>
      <SectionHeader
        title='Shops'
        description="List Of All Shops On This Site"
      />
      <ShopList/>
      
    </div>
      <Footer/>
      </div>
  )
}
