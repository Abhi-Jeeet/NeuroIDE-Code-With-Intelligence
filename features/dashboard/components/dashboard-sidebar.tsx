import { usePathname } from 'next/navigation';
import React, { useState } from 'react'

interface PlaygroundDataProps{
    id: string;
    name: string;
    icon: string;
    starred: boolean;
}

const DashboardSidebar = ({initialPlaygroundData}: {initialPlaygroundData:PlaygroundDataProps[]}) => {
    const pathname = usePathname();
    const [starredPlaygrounds, setStarredPlayground] = useState(initialPlaygroundData.filter((p)=>p.starred))
  return (
    <div>DashboardSidebar</div>
  )
}

export default DashboardSidebar