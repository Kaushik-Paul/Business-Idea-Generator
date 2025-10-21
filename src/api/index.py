import os
from dotenv import load_dotenv
from fastapi import FastAPI  # type: ignore
from fastapi.responses import PlainTextResponse  # type: ignore
from openai import OpenAI  # type: ignore

load_dotenv()

base_url="https://openrouter.ai/api/v1"
model_name="deepseek/deepseek-chat-v3.1:free"
api_key=os.getenv("OPENROUTER_API_KEY")
app = FastAPI()

@app.get("/api", response_class=PlainTextResponse)
def idea():
    client = OpenAI(
        base_url=base_url,
        api_key=api_key
    )
    prompt = [{"role": "user", "content": "Come up with a new business idea for AI Agents"}]
    response = client.chat.completions.create(model=model_name, messages=prompt)
    return response.choices[0].message.content