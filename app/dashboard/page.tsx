import EmptyState from '@/components/ui/empty-state';
import { getAllPlaygroundsForUser } from '@/features/dashboard/actions';

import AddNewButton from '@/features/dashboard/components/add-new-button'
import AddRepoButton from '@/features/dashboard/components/add-repo-button'
import ProjectTable from '@/features/dashboard/components/project-table';
import React from 'react'

const page = async() => {
  const playgrounds = await getAllPlaygroundsForUser();
  return (
    <div className='flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
        <AddNewButton/>
        <AddRepoButton/>

      </div>
      <div className='mt-10 flex flex-col justify-center items-center w-full'>
        {
          playgrounds && playgrounds.length ===0 ? (<EmptyState title='No Projcts Found' description='Create a new Project to get Started' imageSrc='/emptyState.svg'/>):(
            <ProjectTable 
              projects = {playgrounds || []}
            />
          )
        }

      </div>

    </div>
  )
}

export default page