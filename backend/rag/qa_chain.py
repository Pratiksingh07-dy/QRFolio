import requests

from rag.retriever import retrieve_chunks


def ask_resume(question):

    chunks = retrieve_chunks(
        question
    )

    context = "\n\n".join(
        chunks
    )

    prompt = f"""
You are an AI Resume Assistant.

Answer ONLY using the context below.

If the answer is not present in the context,
say:

"That information is not available in the resume."

====================

CONTEXT:

{context}

====================

QUESTION:

{question}

====================

ANSWER:
"""

    response = requests.post(

        "http://localhost:11434/api/generate",

        json={
            "model": "llama3.2:latest",
            "prompt": prompt,
            "stream": False
        }

    )

    result = response.json()

    return result.get(
    "response",
    "No response generated"
)