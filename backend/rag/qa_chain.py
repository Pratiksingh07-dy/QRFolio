from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

from rag.retriever import retrieve_chunks

load_dotenv()

_llm = None

def get_llm():
    global _llm
    if _llm is None:
        _llm = ChatGroq(
            model="llama-3.1-8b-instant",
            api_key=os.getenv("GROQ_API_KEY")
        )
    return _llm


def ask_resume(question, username):

    llm = get_llm()

    chunks = retrieve_chunks(
        question,
        username
    )

    context = "\n\n".join(chunks)

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

    response = llm.invoke(prompt)

    return response.content