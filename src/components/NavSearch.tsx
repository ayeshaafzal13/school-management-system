"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const NavSearch = ({ target }: { target: string }) => {
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("q") as HTMLInputElement;
    const value = input.value.trim();
    router.push(value ? `${target}?search=${encodeURIComponent(value)}` : target);
  };

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
    >
      <button type="submit" aria-label="Search" className="shrink-0">
        <Image src="/search.png" alt="" width={14} height={14} />
      </button>
      <input
        type="text"
        name="q"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </form>
  );
};

export default NavSearch;