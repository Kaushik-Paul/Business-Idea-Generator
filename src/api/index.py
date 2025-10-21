import os
from dotenv import load_dotenv
from fastapi import FastAPI  # type: ignore
from fastapi.responses import StreamingResponse  # type: ignore
from openai import OpenAI  # type: ignore

load_dotenv()

base_url="https://openrouter.ai/api/v1"
model_name="deepseek/deepseek-chat-v3.1:free"
api_key=os.getenv("OPENROUTER_API_KEY")
app = FastAPI()

@app.get("/api")
def idea():
    client = OpenAI(
        base_url=base_url,
        api_key=api_key
    )
    prompt = [{"role": "user", "content": "Reply with a new business idea for AI Agents, formatted with headings, sub-headings and bullet points"}]
    stream = client.chat.completions.create(model=model_name, messages=prompt, stream=True)

    def event_stream():
        for chunk in stream:
            text = chunk.choices[0].delta.content
            if text:
                lines = text.split("\n")
                for line in lines:
                    yield f"data: {line}\n"
                yield "\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")