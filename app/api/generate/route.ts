import { MastraClient } from "@mastra/client-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    console.log("Body:", body);
    console.log("Messages:", messages);

    console.log("API URL:", process.env.BACKEND_URL || 'http://localhost:4111');
    console.log("AUTH TOKEN:", process.env.AUTH_TOKEN);

    const client = new MastraClient({
      baseUrl: process.env.BACKEND_URL || 'http://localhost:4111',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    });
    
    const agent = client.getAgent("completionAgent");
    const response = await agent.generate({ messages });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
