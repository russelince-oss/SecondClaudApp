import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// str_replace_editor tests

test("shows 'Creating' label for str_replace_editor create command", () => {
  render(
    <ToolCallBadge
      tool={{ state: "result", toolName: "str_replace_editor", args: { command: "create", path: "src/App.jsx" }, result: "ok" }}
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace_editor str_replace command", () => {
  render(
    <ToolCallBadge
      tool={{ state: "result", toolName: "str_replace_editor", args: { command: "str_replace", path: "src/components/Card.tsx" }, result: "ok" }}
    />
  );
  expect(screen.getByText("Editing Card.tsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace_editor insert command", () => {
  render(
    <ToolCallBadge
      tool={{ state: "call", toolName: "str_replace_editor", args: { command: "insert", path: "src/index.ts" }, result: undefined }}
    />
  );
  expect(screen.getByText("Editing index.ts")).toBeDefined();
});

test("shows 'Reading' label for str_replace_editor view command", () => {
  render(
    <ToolCallBadge
      tool={{ state: "result", toolName: "str_replace_editor", args: { command: "view", path: "src/lib/utils.ts" }, result: "ok" }}
    />
  );
  expect(screen.getByText("Reading utils.ts")).toBeDefined();
});

// file_manager tests

test("shows 'Deleting' label for file_manager delete command", () => {
  render(
    <ToolCallBadge
      tool={{ state: "result", toolName: "file_manager", args: { command: "delete", path: "src/old/Legacy.tsx" }, result: { success: true } }}
    />
  );
  expect(screen.getByText("Deleting Legacy.tsx")).toBeDefined();
});

test("shows 'Renaming' label for file_manager rename command", () => {
  render(
    <ToolCallBadge
      tool={{ state: "result", toolName: "file_manager", args: { command: "rename", path: "src/Foo.tsx", new_path: "src/Bar.tsx" }, result: { success: true } }}
    />
  );
  expect(screen.getByText("Renaming Foo.tsx → Bar.tsx")).toBeDefined();
});

// Loading state tests

test("shows spinner when tool is still in-progress", () => {
  const { container } = render(
    <ToolCallBadge
      tool={{ state: "call", toolName: "str_replace_editor", args: { command: "create", path: "src/App.jsx" }, result: undefined }}
    />
  );
  // Spinner has animate-spin class
  expect(container.querySelector(".animate-spin")).not.toBeNull();
});

test("shows green dot when tool is complete", () => {
  const { container } = render(
    <ToolCallBadge
      tool={{ state: "result", toolName: "str_replace_editor", args: { command: "create", path: "src/App.jsx" }, result: "ok" }}
    />
  );
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

// Fallback test

test("falls back to tool name for unknown tools", () => {
  render(
    <ToolCallBadge
      tool={{ state: "result", toolName: "unknown_tool", args: {}, result: "ok" }}
    />
  );
  expect(screen.getByText("unknown_tool")).toBeDefined();
});
