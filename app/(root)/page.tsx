import { Button } from "@/components/ui/button";
import UserButton from "@/features/auth/components/user-button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-rose-500 text-3xl">Hello</h1>
      <UserButton/>
    </div>
  );
}
