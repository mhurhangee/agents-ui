"use client";

import { useState } from "react";
import { MastraClient } from "@mastra/client-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function CompletionGeneratePage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const client = new MastraClient({
        baseUrl: process.env.BACKEND_URL || 'http://localhost:4111', // Provide a default value
        headers: {
          Authorization: `Bearer ${process.env.AUTH_TOKEN}`, // Include if auth is required
        },
      });

      const agent = client.getAgent("your-agent-id"); // Replace with your actual agent ID
      const res = await agent.generate({
        messages: [{ role: "user", content: input }],
      });

      setResponse(res.text || "No response received"); // Access the content safely
    } catch (error) {
      setResponse("Error fetching response");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Completion Generate</CardTitle>
          <CardDescription>Simple implementation of Mastra.ai agent: generate response based on a prompt.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={handleSendMessage} disabled={loading} className="mt-4 w-full">
            {loading ? "Generating..." : "Send"}
          </Button>
          {response && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-100">
              <strong>Response:</strong>
              <p>{response}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
