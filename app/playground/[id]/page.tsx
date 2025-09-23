"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TemplateFileTree from "@/features/playground/components/template-file-tree";
import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { TemplateFile, TemplateFolder } from "@/features/playground/types";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Bot, Save, Settings } from "lucide-react";
import { useParams } from "next/navigation";
import { writeFileSync } from "node:fs";
import React, { useCallback } from "react";

const page = () => {
  const { id } = useParams<{ id: string }>();
  const { playgroundData, templateData, isLoading, error, saveTemplateData } =
    usePlayground(id);
  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    editorContent,
    updateFileContent,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
  } = useFileExplorer();

  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);

  //   const wrappedHandleAddFile = useCallback(
  //   (newFile: TemplateFile, parentPath: string) => {
  //     return handleAddFile(
  //       newFile,
  //       parentPath,
  //       writeFileSync!,
  //       instance,
  //       saveTemplateData
  //     );
  //   },
  //   [handleAddFile, writeFileSync, instance, saveTemplateData]
  // );

  // const wrappedHandleAddFolder = useCallback(
  //   (newFolder: TemplateFolder, parentPath: string) => {
  //     return handleAddFolder(newFolder, parentPath, instance, saveTemplateData);
  //   },
  //   [handleAddFolder, instance, saveTemplateData]
  // );

  // const wrappedHandleDeleteFile = useCallback(
  //   (file: TemplateFile, parentPath: string) => {
  //     return handleDeleteFile(file, parentPath, saveTemplateData);
  //   },
  //   [handleDeleteFile, saveTemplateData]
  // );

  // const wrappedHandleDeleteFolder = useCallback(
  //   (folder: TemplateFolder, parentPath: string) => {
  //     return handleDeleteFolder(folder, parentPath, saveTemplateData);
  //   },
  //   [handleDeleteFolder, saveTemplateData]
  // );

  // const wrappedHandleRenameFile = useCallback(
  //   (
  //     file: TemplateFile,
  //     newFilename: string,
  //     newExtension: string,
  //     parentPath: string
  //   ) => {
  //     return handleRenameFile(
  //       file,
  //       newFilename,
  //       newExtension,
  //       parentPath,
  //       saveTemplateData
  //     );
  //   },
  //   [handleRenameFile, saveTemplateData]
  // );

  // const wrappedHandleRenameFolder = useCallback(
  //   (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
  //     return handleRenameFolder(
  //       folder,
  //       newFolderName,
  //       parentPath,
  //       saveTemplateData
  //     );
  //   },
  //   [handleRenameFolder, saveTemplateData]
  // );

  return (
    <TooltipProvider>
      <>
        {/* TODO: TEMPLATES TREE */}
        <TemplateFileTree data={templateData!} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-1 items-center gap-2">
              <div className="flex flex-col flex-1">
                <h1 className="text-sm font-medium">
                  {playgroundData?.title || "Code Playground"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {openFiles.length} File(s) open
                  {hasUnsavedChanges && " . Unsaved changes"}
                </p>
              </div>
              <div className="flex items-center-gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {}}
                      disabled={!activeFile || !activeFile.hasUnsavedChanges}
                    >
                      <Save className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Save (Ctrl + S)
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {}}
                      disabled={!hasUnsavedChanges}
                    >
                      <Save className="h-4 w-4" /> All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Save All (Ctrl + Shift + S)
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {}}
                      disabled={!hasUnsavedChanges}
                    >
                      <Bot className="h-4 w-4" /> ToggleAI
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    ToggleAI
                  </TooltipContent>
                </Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size={"sm"} variant={"outline"}>
                      <Settings className="size-4"/>
                    </Button>

                  </DropdownMenuTrigger>
                </DropdownMenu>
              </div>
            </div>
          </header>
        </SidebarInset>
      </>
    </TooltipProvider>
  );
};

export default page;
