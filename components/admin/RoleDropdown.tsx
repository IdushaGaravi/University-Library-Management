"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUserRole } from "@/lib/admin/actions/user";
import { Check } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type Role = "USER" | "ADMIN";

interface Props {
  userId: string;
  role: Role;
}

const roleStyles: Record<Role, string> = {
  USER: "bg-pink-100 text-pink-700",
  ADMIN: "bg-green-100 text-green-700",
};

const RoleDropdown = ({ userId, role }: Props) => {
  const [currentRole, setCurrentRole] = useState<Role>(role);
  const [isPending, startTransition] = useTransition();

  const handleChange = (newRole: Role) => {
    if (newRole === currentRole) return;

    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);

      if (result.success) {
        setCurrentRole(newRole);
        toast.success("Role updated");
      } else {
        toast.error("Failed to update role", {
          description: result.error,
        });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={isPending}
          className={`rounded-full px-3 py-1 text-xs font-medium ${roleStyles[currentRole]}`}
        >
          {currentRole === "ADMIN" ? "Admin" : "User"}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => handleChange("USER")}
          className="flex items-center justify-between"
        >
          User
          {currentRole === "USER" && <Check className="size-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleChange("ADMIN")}
          className="flex items-center justify-between"
        >
          Admin
          {currentRole === "ADMIN" && <Check className="size-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleDropdown;
