from rag.pdf_loader import load_pdf_text
from rag.chunker import split_text

text = load_pdf_text(
    "uploads/resume.pdf"
)

chunks = split_text(text)

print("Chunks:", len(chunks))

print("\nFirst Chunk:\n")

print(chunks[0])