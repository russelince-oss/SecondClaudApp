"use client";

import { Loader2, FilePlus, FilePen, FileSearch, Trash2, FolderInput } from "lucide-react";

interface ToolInvocation {
  state: "partial-call" | "call" | "result";
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
}

interface ToolCallBadgeProps {
  tool: ToolInvocation;
}

function basename(path: string): string {
  return path.split("/").pop() ?? path;
}

function getLabel(tool: ToolInvocation): { icon: React.ReactNode; text: string } {
  const args = tool.args;
  const path = typeof args.path === "string" ? args.path : "";
  const file = basename(path);

  if (tool.toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return { icon: <FilePlus className="w-3 h-3" />, text: `Creating ${file}` };
      case "str_replace":
      case "insert":
        return { icon: <FilePen className="w-3 h-3" />, text: `Editing ${file}` };
      case "view":
        return { icon: <FileSearch className="w-3 h-3" />, text: `Reading ${file}` };
      default:
        return { icon: <FilePen className="w-3 h-3" />, text: `Editing ${file}` };
    }
  }

  if (tool.toolName === "file_manager") {
    if (args.command === "delete") {
      return { icon: <Trash2 className="w-3 h-3" />, text: `Deleting ${file}` };
    }
    if (args.command === "rename") {
      const newPath = typeof args.new_path === "string" ? args.new_path : "";
      return { icon: <FolderInput className="w-3 h-3" />, text: `Renaming ${file} → ${basename(newPath)}` };
    }
  }

  return { icon: <FilePen className="w-3 h-3" />, text: tool.toolName };
}

export function ToolCallBadge({ tool }: ToolCallBadgeProps) {
  const done = tool.state === "result" && tool.result != null;
  const { icon, text } = getLabel(tool);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      <span className="text-neutral-600">{icon}</span>
      <span className="text-neutral-700">{text}</span>
    </div>
  );
}
