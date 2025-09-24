"use server";

import { currentUser } from "@/features/auth/actions";
import { db } from "@/lib/db";
import { Templates } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { removeAllListeners } from "process";

type PlaygroundWithRelations = {
    id: string;
    title: string;
    description: string | null;
    template: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    };
    Starmark: Array<{
        id: string;
        userId: string;
        playgroundId: string;
        isMarked: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
};

export const createPlayground = async(data:{
    title:string;
    template: Templates;
    description?:string;
})=>{
    const {template, title, description} = data;

    const user = await currentUser();

    try {
        const playground = await db.playground.create({
            data:{
                title,
                description,
                template,
                userId:user?.id!
            }
        });
        return playground;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getAllPlaygroundsForUser = async(): Promise<PlaygroundWithRelations[] | null>=>{
    const user = await currentUser();

    try {
        const playground = await db.playground.findMany({
            where:{
                userId:user?.id
            },
            include:{
                user:true,
                Starmark:{
                    where:{
                        userId:user?.id
                    }
                }
            }
        })
        return playground
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const deleteProjectById = async(id:string)=>{
    try {
        await db.playground.delete({
            where:{id}
        })
        revalidatePath("/dashboard");
    } catch (error) {
        console.log(error);
        throw new Error("Failed to delete project");
    }
}

export const editProjectById = async(id:string, data:{title:string, description:string})=>{
    try {
        await db.playground.update({
            where:{id},
            data:data
        })
        revalidatePath("/dashboard");
    } catch (error) {
        console.log(error);
        throw new Error("Failed to update project");
    }
}

export const duplicateProjectById = async(id:string)=>{
    try {
        const originalPlayground = await db.playground.findUnique({
            where:{id},
        })
        if(!originalPlayground){
            throw new Error ("Playground not found");
        }
        const duplicatePlayground = await db.playground.create({
            data:{
                title:`${originalPlayground.title} (Copy)`,
                description:originalPlayground.description,
                template:originalPlayground.template,
                userId:originalPlayground.userId
            }
        })
        revalidatePath("/dashboard")
        return duplicatePlayground
    } catch (error) {
        console.log(error);
        throw new Error("Failed to duplicate project");
    }
}

