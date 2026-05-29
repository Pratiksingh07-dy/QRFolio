from rag.pdf_loader import load_pdf_text
from rag.chunker import split_text
from rag.vector_store import store_chunks

text = load_pdf_text(
    "uploads/resume.pdf"
)

chunks = split_text(text)

count = store_chunks(
    chunks,
    "pratik"
)

print(
    f"Stored {count} chunks"
)