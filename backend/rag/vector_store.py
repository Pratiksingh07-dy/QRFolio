from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer

# Embedding model
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# ChromaDB storage
client = PersistentClient(
    path="vector_db"
)

collection = client.get_or_create_collection(
    name="resumes"
)


def store_chunks(chunks, username):

    documents = []
    embeddings = []
    ids = []

    for i, chunk in enumerate(chunks):

        embedding = model.encode(
            chunk
        ).tolist()

        documents.append(chunk)

        embeddings.append(
            embedding
        )

        from uuid import uuid4
        ids.append(
          f"{username}_{uuid4()}"
)

    collection.add(
        documents=documents,
        embeddings=embeddings,
        ids=ids
    )

    return len(chunks)