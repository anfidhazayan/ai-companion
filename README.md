# AI Learning Companion (MVP) 🧠✨

An intelligent learning assistant that helps users study documents, books, or notes using **Retrieval-Augmented Generation (RAG)** combined with **long-term episodic memory** and a sleek, interactive frontend interface.

![AI Learning Companion Interface](src/assets/Screenshot%202026-06-08%20131729.png)

---

## 🌐 Live Demo

- **Frontend:** [https://ai-companion-ruby-three.vercel.app/](https://ai-companion-ruby-three.vercel.app/)
- **Backend API:** [https://ai-companion-backend.onrender.com/docs](https://ai-companion-backend.onrender.com/docs)

---

## 🚀 Key Features

- **Document RAG (Retrieval-Augmented Generation)**: Upload any PDF document to instantly chunk, embed (using `SentenceTransformers`), and index it into a local `FAISS` vector database.
- **Context-Aware Chatting**: Ask questions about the uploaded PDF. The assistant retrieves matching passages from the vector store to ground its responses.
- **Episodic Long-Term Memory**: Teach the companion facts about you or your goals by typing `remember [your fact]` (e.g., `remember my favorite programming language is python`). These facts are stored persistently in JSON.
- **Interactive UI Dashboard**: Responsive dark-mode dashboard with real-time feedback loaders, dynamic message styling, and sidebar history.
- **FastAPI Backend**: Built on FastAPI, leveraging Google GenAI for generation, SentenceTransformers for fast semantic embedding, and FAISS for sub-millisecond local vector matching.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Styling**: TailwindCSS & Custom Vanilla CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Markdown Rendering**: React Markdown

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **LLM API**: Google Gemini API (`gemini-2.5-flash`) via the `google-genai` SDK
- **Embeddings**: HuggingFace SentenceTransformers (`all-MiniLM-L6-v2`)
- **Vector Database**: FAISS (Facebook AI Similarity Search)
- **PDF Extraction**: PyPDF

---

## ⚙️ Project Setup

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file containing your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Start the FastAPI backend server:
   ```bash
   python -m uvicorn main:app --port 8000
   ```
   *(The backend server will run on `http://localhost:8000`)*

### 2. Frontend Setup

1. Navigate to the project root directory:
   ```bash
   npm install
   ```

2. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *(The web interface will open at `http://localhost:5173`)*

---

## 🔌 API Endpoints

- **`GET /`**: Home status route check.
- **`GET /status`**: Check if a PDF has been loaded into the vector index and retrieve chunk counts.
- **`GET /memory`**: Retrieve all saved facts from persistent memory.
- **`POST /upload`**: Multi-part upload endpoint for processing PDF files.
- **`POST /chat`**: Main communication endpoint. Handled formats:
  - Teach a fact: `remember [fact]`
  - Ask context-grounded question: `[question]`
