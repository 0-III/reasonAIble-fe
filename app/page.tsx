"use client";

import type React from "react";

import { useState } from "react";
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
import { generateExcuse } from "@/lib/api";
import { Sparkles } from "lucide-react";

export default function GenerateExcusePage() {
  const [situation, setSituation] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!situation.trim()) return;

    setIsGenerating(true);

    try {
      // API 호출을 통해 excuse 생성
      const excuse = await generateExcuse(situation);

      // 생성된 excuse의 ID로 상세 페이지로 이동
      router.push(`/excuses/${excuse.id}`);
    } catch (error) {
      console.error("Failed to generate excuse:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container max-w-2xl py-6 md:py-12 px-4 md:px-6">
      <Card className="w-full">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-xl md:text-2xl">
            Generate an Excuse
          </CardTitle>
          <CardDescription>
            Describe your situation and we'll generate a creative excuse for you
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-4 md:p-6">
            <div className="grid gap-4">
              <Textarea
                placeholder="I need an excuse for missing a deadline at work..."
                className="min-h-24 md:min-h-32 resize-none"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between p-4 md:p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSituation("")}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={!situation.trim() || isGenerating}
              className="gap-2 w-full sm:w-auto order-1 sm:order-2"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Excuse"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
