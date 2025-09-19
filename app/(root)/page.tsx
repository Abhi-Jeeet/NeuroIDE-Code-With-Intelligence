import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="z-20 flex-col items-center justify-center min-h-screen py-2 mt-10">
      <div className="flex flex-col justify-center items-center my-5">
        <Image src={"/homelogo.svg"} alt="homelogo" height={500} width={500}/> 
        <h1 className="z-20 text-6xl mt-5 font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#33aee3] via-[#22e8dd] to-[#0dead8] dark:from-[#0dead8] dark:via-[#22e8dd] dark:to-[#c5ccd7] tracking-tight leading-[1.3]">
  NeuroIDE - Code With Intelligence
</h1>
 <p className="mt-2 text-lg text-center text-gray-600 dar:text-gray-400 px-5 py-10 max-w-2xl">
NeuroIDE is  a powerful and intelligent code editor that enhances your coding experience with advanced features and seamless integration. It is designed to help you write, debug, and optimize your code efficiently.

 </p>
 <Link href={"/dashboard"}>
 <Button variant={"default"} className="mb-4" size={"lg"}>Get Started
  <ArrowUpRight className="w-3.5 h-3.5"/>
 </Button>

 </Link>

      </div>
      
    </div>
  );
}
