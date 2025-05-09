"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Excuse } from "@/types/excuse";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Copy, Edit, Save, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { updateExcuse, deleteExcuse, fetchExcuseById } from "@/lib/api";

export default function ExcuseDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [excuse, setExcuse] = useState<Excuse | null>(null);
  const [modifiedExcuse, setModifiedExcuse] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Access token is missing");
        }

        const data = await fetchExcuseById(id);
        setExcuse(data);
        setModifiedExcuse(data.modifiedExcuse || data.excuse);
      } catch (err: any) {
        console.error("Failed to fetch excuse:", err);
        setError("Failed to load the excuse. Please try again later.");
      }
    };

    fetchData();
  }, [id]);

  const handleSaveModification = async () => {
    try {
      const updatedExcuse = await updateExcuse(id, {
        modifiedExcuse,
      });
      toast({
        title: "Excuse updated",
        description: "Your modified excuse has been saved.",
      });
      setExcuse(updatedExcuse);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update excuse:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExcuse(id);
      router.push("/excuses");

      toast({
        title: "Excuse deleted",
        description: "Your excuse has been removed.",
      });
    } catch (error) {
      console.error("Failed to delete excuse:", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(modifiedExcuse);

    toast({
      title: "Copied to clipboard",
      description: "Your excuse is ready to use.",
    });
  };

  if (error) {
    return (
      <div className="container">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!excuse) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container max-w-3xl py-4 px-4 md:py-12 md:px-6">
      <div className="mb-4 md:mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/excuses")}
          className="px-2 md:px-3"
        >
          <ArrowLeft className="mr-1 md:mr-2 h-4 w-4" />
          <span className="text-sm md:text-base">Back to List</span>
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-0">
            <div>
              <CardTitle className="text-xl md:text-2xl break-words">
                {excuse.situation}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm mt-1">
                Created {formatDate(excuse.createdAt)}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="self-start md:self-auto mt-1 md:mt-0"
            >
              Used {excuse.usageCount || 0}{" "}
              {excuse.usageCount === 1 ? "time" : "times"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
          <div>
            <h3 className="mb-2 text-sm md:text-base font-medium">
              Original Excuse
            </h3>
            <p className="rounded-md bg-muted p-3 md:p-4 text-sm">
              {excuse.excuse}
            </p>
          </div>

          <Separator />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm md:text-base font-medium">
                {isEditing ? "Edit Your Excuse" : "Your Modified Excuse"}
              </h3>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="text-xs md:text-sm">Edit</span>
                </Button>
              )}
            </div>

            {isEditing ? (
              <Textarea
                value={modifiedExcuse}
                onChange={(e) => setModifiedExcuse(e.target.value)}
                className="min-h-24"
              />
            ) : (
              <p className="rounded-md bg-muted p-3 md:p-4 text-sm">
                {modifiedExcuse}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs md:text-sm"
                onClick={() => {
                  setIsEditing(false);
                  setModifiedExcuse(excuse.modifiedExcuse || excuse.excuse);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="text-xs md:text-sm"
                onClick={handleSaveModification}
              >
                <Save className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row gap-2 justify-between p-4 md:p-6">
          <Button
            variant="destructive"
            className="w-full md:w-auto"
            onClick={handleDelete}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button className="w-full md:w-auto" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
