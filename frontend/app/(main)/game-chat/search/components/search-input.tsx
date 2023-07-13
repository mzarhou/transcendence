"use client";

import { Input } from "@/components/ui/input";
import { useAutoFocus } from "@/hooks/use-auto-focus";

export default function SearchInput() {
  const ref = useAutoFocus<HTMLInputElement>();
  return <Input ref={ref} placeholder="Search @username, groups" />;
}
