import { useState, useEffect, useCallback } from "react";
import {toast} from "sonner";
import { TemplateFolder } from "../lib/path-to-json";

interface PlaygroundData {
    id:string;
    name?:string;
    [key:string]:any;
}

interface UsePlaygroundReturn{
    playgroundData: PlaygroundData | null;
    templateData: TemplateFolder | null;
    isLoading: boolean;
    error: string | null;
    loadPlayground:()=>Promise<void>;
    saveTemplateData:(data: TemplateFolder)=> Promise<void>
}

export const usePlayground = (id:string):UsePlaygroundReturn=>{
    const [playgroundData, setPlaygroundData] = useState<PlaygroundData | null>();
    const [templateData, setTemplateData] = useState<TemplateFolder | null>();
    const [loading, setIsloading] = useState(true);
    const[error, setError] = useState<string | null>();

    const loadPlayground = useCallback(async()=>{
        if(id) return;
        try {
            setIsloading(true);
            setError(null);
            const data = await getPlaygroundById(id)
        } catch (error) {
            
        }finally{
            
        }
    },[id])
}