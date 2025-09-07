import React from 'react'
import Image from 'next/image'
import SignInFormClient from '@/features/auth/components/signin-form-client'

const SignInPage = () => {
  return (
    <>
    <Image src={"/NeuroIDE.png"} alt="Login-Image" height={300} 
        width={300}
        className="m-6"
        />
    
    <SignInFormClient/>

    
    </>
  )
}

export default SignInPage