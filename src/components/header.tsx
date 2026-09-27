"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./cart";

export type NavCategory = { slug: string; name: string };

export function Header({ categories }: { categories: NavCategory[] }) {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-4 sm:px-6 lg:h-20 lg:px-10">
        <button
          className="-ml-2 p-2 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="block h-[1.5px] w-6 bg-ink" />
          <span className="mt-1.5 block h-[1.5px] w-6 bg-ink" />
          <span className="mt-1.5 block h-[1.5px] w-4 bg-ink" />
        </button>

        <Link href="/" aria-label="Fashion Tailoring Kreation, home" className="shrink-0">
          <Image src="/brand/ftk-black.png" alt="FTK" width={764} height={685} priority className="h-11 w-auto lg:h-14" />
        </Link>

        <nav aria-label="Collections" className="hidden flex-1 items-center gap-6 lg:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className={`condensed text-[1.02rem] font-medium hover:underline underline-offset-8 ${
                pathname === `/collections/${c.slug}` ? "underline" : ""
              }`}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-5 text-sm">
          <Link href="/made-to-measure" className="hidden font-medium hover:underline underline-offset-4 md:inline">
            Made to measure
          </Link>
          <Link href="/track" className="hidden font-medium hover:underline underline-offset-4 md:inline">
            Track order
          </Link>
          <Link href="/bag" className="flex items-center gap-2 font-semibold" aria-label={`Bag, ${count} items`}>
            <BagIcon />
            <span className="tabular-nums">{ready ? count : 0}</span>
          </Link>
        </div>
      </div>

      {open && (
        <nav aria-label="Menu" className="border-t border-line bg-paper px-4 pb-8 pt-4 lg:hidden">
          <ul>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className="display display-sm block py-2">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="seam my-5" />
          <div className="flex flex-col gap-3 text-base font-medium">
            <Link href="/shop">Shop everything</Link>
            <Link href="/made-to-measure">Made to measure</Link>
            <Link href="/track">Track an order</Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
