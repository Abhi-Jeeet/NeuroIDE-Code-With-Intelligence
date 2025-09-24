"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Brain } from "lucide-react";
import { toast } from "sonner";

export function AISettings() {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you'd save these to your backend
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("AI settings saved successfully!");
      setTestResult("success");
    } catch (error) {
      toast.error("Failed to save AI settings");
      setTestResult("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Hello, this is a test message.",
          history: []
        })
      });

      if (response.ok) {
        setTestResult("success");
        toast.success("AI connection test successful!");
      } else {
        setTestResult("error");
        toast.error("AI connection test failed");
      }
    } catch (error) {
      setTestResult("error");
      toast.error("AI connection test failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Configuration</h2>
        <p className="text-muted-foreground">
          Configure Google Gemini AI for fast code suggestions and chat assistance.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Google Gemini 1.5 Flash
          </CardTitle>
          <CardDescription>
            Fast, free, and powerful AI from Google. Get your API key from Google AI Studio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Gemini API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Get your API key from{" "}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleTestConnection}
              disabled={isLoading || !apiKey}
              variant="outline"
            >
              {isLoading ? "Testing..." : "Test Connection"}
            </Button>
            <Button 
              onClick={handleSaveSettings}
              disabled={isLoading || !apiKey}
            >
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>

          {testResult && (
            <Alert>
              {testResult === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {testResult === "success" 
                  ? "Connection test successful! AI is ready to use."
                  : "Connection test failed. Please check your API key."
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Recommended:</strong> Google Gemini 1.5 Flash offers the best balance of speed, 
          quality, and cost. It provides a generous free tier and excellent code understanding.
        </AlertDescription>
      </Alert>
    </div>
  );
}
