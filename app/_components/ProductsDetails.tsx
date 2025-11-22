import React from 'react'
import RecentOrders from './RecentOrders'
import SalesPerformance from './SalesPerformance'
import DashboardNotifications from './DashboardNotifications'

function ProductsDetails() {
  return (
    <div className='w-full  flex flex-col gap-2.5'>
      <RecentOrders />
      <SalesPerformance />
      <DashboardNotifications />
    </div>
  )
}

export default ProductsDetails
