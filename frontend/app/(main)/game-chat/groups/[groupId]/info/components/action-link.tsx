"use client";

import Link from "next/link";
import { MouseEventHandler, ReactNode } from "react";

type ActionLinkProps = {
  text: string;
  href: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};
export function ActionLink(props: ActionLinkProps) {
  return (
    <Link
      onClick={props.onClick}
      href={props.href}
      className="flex cursor-pointer flex-col items-center space-y-1"
    >
      <div className="flex aspect-square h-14 items-center justify-center rounded-full border px-0 py-0">
        {props.children}
      </div>
      <span className="text-sm">{props.text}</span>
    </Link>
  );
}
