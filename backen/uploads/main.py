from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from sentence_transformers import SentenceTransformer
from fastapi import UploadFile, File
from pypdf import PdfReader
import faiss
import numpy as np
import os
from memory import save_fact, get_memory
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS Middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chunks = []
index = None
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)
# Load .env file
load_dotenv()

# Create Gemini client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# Request model
class ChatRequest(BaseModel):
    question: str
import json

def save_fact(fact):

    with open("memory.json", "r") as f:
        data = json.load(f)

    data["facts"].append(fact)

    with open("memory.json", "w") as f:
        json.dump(data, f, indent=4)



# Home route
@app.get("/")
def home():
    return {
        "message": "AI Learning Companion Backend Running 🚀"
    }

@app.get("/memory")
def get_memory_list():
    import json
    try:
        with open("memory.json", "r") as f:
            data = json.load(f)
        return data
    except Exception as e:
        return {"facts": []}

@app.get("/status")
def get_status():
    global index
    global chunks
    return {
        "pdf_loaded": index is not None,
        "chunks_count": len(chunks) if chunks else 0
    }
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    global chunks
    global index

    pdf = PdfReader(file.file)

    text = ""

    for page in pdf.pages:
        text += page.extract_text()

    chunks = []

    for i in range(0, len(text), 500):
        chunks.append(text[i:i+500])

    embeddings = model.encode(chunks)

    dimension = len(embeddings[0])

    index = faiss.IndexFlatL2(dimension)

    index.add(
        np.array(embeddings).astype("float32")
    )

    return {
        "message": f"PDF loaded with {len(chunks)} chunks"
    }
# Chat route
@app.post("/chat")
def chat(data: ChatRequest):

    if data.question.lower().startswith("remember"):

        fact = data.question.replace("remember", "").strip()

        save_fact(fact)

        return {
            "answer": f"Saved: {fact}"
        }
    if index is None:
        return {
        "answer": "Please upload a PDF first."
    }

    # Retrieve relevant chunks from FAISS
    query_embedding = model.encode([data.question])

    D, I = index.search(
        np.array(query_embedding).astype("float32"),
        k=2
    )

    retrieved_text = ""
    for idx in I[0]:
        # guard against invalid indexes
        if idx < len(chunks):
            retrieved_text += chunks[idx] + "\n"

    memory = get_memory()

    prompt = f"""
Memory:
{memory}

Context:
{retrieved_text}

Question:
{data.question}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {"answer": response.text}