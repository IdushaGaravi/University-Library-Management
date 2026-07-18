"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateReturnDate } from "@/lib/admin/actions/borrow";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  recordId: string;
  returnDate: string | null;
}

const ReturnDatePicker = ({ recordId, returnDate }: Props) => {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(
    returnDate ? new Date(returnDate) : undefined
  );
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (selected: Date | undefined) => {
    if (!selected) return;

    setOpen(false);

    startTransition(async () => {
      const isoDate = selected.toISOString().split("T")[0];
      const result = await updateReturnDate(recordId, isoDate);

      if (result.success) {
        setDate(selected);
        toast.success("Return date set");
        router.refresh(); // re-fetch the table so the status badge updates too
      } else {
        toast.error("Failed to update return date", {
          description: result.error,
        });
      }
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={isPending}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          {date
            ? date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Set date"}
          <CalendarIcon className="size-3.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 border-2 border-red-200 bg-white sm:max-w-md">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={(d) => d > new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default ReturnDatePicker;
