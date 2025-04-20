"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Excuse } from "@/types/excuse";
import { formatDistanceToNow } from "@/lib/utils";
import { ArrowRight, Search } from "lucide-react";

export default function ExcusesListPage() {
  const [excuses, setExcuses] = useState<Excuse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // In a real app, this would be an API call
    const storedExcuses: Excuse[] = JSON.parse(
      localStorage.getItem("excuses") || "[]",
    );
    setExcuses(storedExcuses);
  }, []);

  const filteredExcuses = excuses.filter(
    (excuse) =>
      excuse.situation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      excuse.excuse.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container py-6 md:py-12">
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-3 md:gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Your Excuses</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search excuses..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredExcuses.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-12">
            <p className="text-muted-foreground">No excuses found</p>
            <Button asChild>
              <Link href="/">Generate Your First Excuse</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExcuses.map((excuse) => (
              <Link key={excuse.id} href={`/excuses/${excuse.id}`}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 text-lg">
                      {excuse.situation}
                    </CardTitle>
                    <CardDescription className="flex items-center text-xs">
                      {formatDistanceToNow(excuse.createdAt)} ago
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {excuse.excuse}
                    </p>
                    <div className="mt-4 flex items-center text-xs text-primary">
                      View details <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
