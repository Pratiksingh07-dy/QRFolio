from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

client = PersistentClient(
    path="vector_db"
)

collection = client.get_collection(
    "resumes"
)


def retrieve_chunks(query, top_k=3):

    query_embedding = model.encode(
        query
    ).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    return results["documents"][0]