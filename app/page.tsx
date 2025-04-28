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
  const [apiType, setApiType] = useState<'generateExcuse' | 'generateKnlExcuse'>('generateExcuse');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!situation.trim()) return;

    setIsGenerating(true);

    try {
      let excuse;
      if (apiType === 'generateExcuse') {
        excuse = await generateExcuse(situation);
      } else {
        // @ts-ignore
        const { generateKnlExcuse } = await import('@/lib/api');
        excuse = await generateKnlExcuse(situation);
      }
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
              <div>
                <label htmlFor="apiType" className="block mb-1 text-sm font-medium">API 선택</label>
                <select
                  id="apiType"
                  value={apiType}
                  onChange={e => setApiType(e.target.value as 'generateExcuse' | 'generateKnlExcuse')}
                  className="block w-full border border-input rounded-md p-2 text-base bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="generateExcuse">일반용</option>
                  <option value="generateKnlExcuse">관리자용</option>
                </select>
              </div>
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
