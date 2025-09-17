"use client";
import * as React from 'react';
import { ChevronRight, File, Plus, FilePlus, FolderPlus, MoreHorizontal, Trash2, Edit3 } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarRail  } from '@/components/ui/sidebar';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface TemplateFile{
    filename:string
    fileExtension: string
    content: string
}

interface TemplateFolder{
    foldername:string
    items:(TemplateFile | TemplateFolder)[]
}

type TemplateItem = TemplateFile | TemplateFolder

interface TemplateFileTreeProps{
    data: TemplateItem
    onFileSelect?: (file: TemplateFile)=> void
    selectedFile?: TemplateFile
    title?:string
    onAddFile?:(file:TemplateFile, parentPath: string)=>void
    onAddFolder?:(folder:TemplateFolder, parentPath: string)=>void
    onDeleteFile?:(file:TemplateFile, parentPath: string)=>void
    onDeleteFolder?:(folder:TemplateFolder, parentPath: string)=>void
    onRenameFile?:(file:TemplateFile, newFilename: string, newExtension: string, parentPath:string)=>void
    onRenameFolder?:(file:TemplateFolder, newFolderName: string, parentPath:string)=>void
}

const TemplateFileTree = ({data, onFileSelect, selectedFile, title="Files Explorer",
    onAddFile,
    onAddFolder,
    onDeleteFile,
    onDeleteFolder,
    onRenameFile,
    onRenameFolder
}:TemplateFileTreeProps ) => {
    const isRootFolder = data && typeof data=== "object" && "folderName" in data;
  return (
    <Sidebar>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel></SidebarGroupLabel>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
    
  )
}

export default TemplateFileTree