"use client";
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { usePlayground } from '@/features/playground/hooks/usePlayground';
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
    const {id} = useParams<{id:string}>();
    const {playgroundData, templateData, isLoading, error, saveTemplateData} = usePlayground(id)
  return (
    <div>
       <>
       {/* TODO: TEMPLATES TREE */}
       <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
            <SidebarTrigger className='-ml-1'/>
            <Separator orientation='vertical' className='mr-2 h-4'/>
            <div className='flex flex-1 items-center gap-2'>
                <div className='flex flex-col flex-1'>
                  {playgroundData?.name || "Code Playground"}
                    

                </div>

            </div>

        </header>
       </SidebarInset>
       </>
    </div>
    
  )
}

export default page