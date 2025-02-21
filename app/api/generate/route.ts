import { MastraClient } from "@mastra/client-js";
import { NextResponse } from "next/server";

interface ErrorWithResponse extends Error {
  response?: {
    data?: unknown;
    status?: number;
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    console.log("Body:", body);
    console.log("Messages:", messages);
    console.log("API URL:", process.env.BACKEND_URL || 'http://localhost:4111');
    
    console.log("AUTH TOKEN (first 10 chars):", process.env.AUTH_TOKEN?.substring(0, 10));

    const client = new MastraClient({
      baseUrl: process.env.BACKEND_URL || 'http://localhost:4111',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    });

    const agents = await client.getAgents();
    console.log("Agents:", agents);
    
    console.log("Attempting to get agent: completionAgent");
    const agent = client.getAgent("completionAgent");
    
    console.log("Calling generate with messages:", messages);
    const response = await agent.generate({ messages });
    
    console.log("Response:", response);
    return NextResponse.json(response);
  } catch (error) {
    const err = error as ErrorWithResponse;
    console.error('Detailed Error:', {
      message: err.message,
      stack: err.stack,
      response: err.response?.data,
      status: err.response?.status,
    });
    
    return NextResponse.json(
      { error: 'Failed to generate response', details: err.message },
      { status: err.response?.status || 500 }
    );
  }
}
