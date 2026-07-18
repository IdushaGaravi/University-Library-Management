import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const Header = async () => {
  const session = await auth();

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-4">
        <li>
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
          >
            <Button type="submit">Logout</Button>
          </form>
        </li>

        {session?.user?.name && (
          <li>
            <Link href="/my-profile">
              <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-800">
                {getInitials(session.user.name)}
              </div>
            </Link>
          </li>
        )}
      </ul>
    </header>
  );
};

export default Header;
