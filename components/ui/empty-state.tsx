import Image from 'next/image'
import React from 'react'

interface Props{
    title: string,
    description:string,
    imageSrc: string,
}

const EmptyState = ({title, description, imageSrc}: Props) => {
  return (
    <div className='flex flex-col items-center justify-center py-16'>
        <Image src={imageSrc!} alt={title} className='mb-4' height={400} width={400}  />
        <h2 className='text-xl font-semibold text-gray-500 ml-12'>
            {title}
        </h2>
        <p className='text-gray-400 ml-12'>
            {description}
        </p>

    </div>
  )
}

export default EmptyState