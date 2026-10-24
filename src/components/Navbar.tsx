import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import NavSearch from "./NavSearch";

const Navbar = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "User";
  const searchTarget =
    role === "admin" || role === "teacher"
      ? "/list/students"
      : "/list/announcements";

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <NavSearch target={searchTarget} />
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <Link
          href="/list/announcements"
          aria-label="Announcements"
          className="bg-white rounded-full w-7 h-7 flex items-center justify-center"
        >
          <Image src="/announcement.png" alt="" width={20} height={20} />
        </Link>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{fullName}</span>
          <span className="text-[10px] text-gray-500 text-right capitalize">
            {role}
          </span>
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;