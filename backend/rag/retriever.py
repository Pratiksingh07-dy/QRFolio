from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer

# lazy loading - don't load at import time
_model = None
_client = None
_collection = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

def get_collection():
    global _client, _collection
    if _collection is None:
        _client = PersistentClient(path="vector_db")
        # use get_or_create so it doesn't crash on fresh server
        _collection = _client.get_or_create_collection("resumes")
    return _collection

def retrieve_chunks(query, username, top_k=3):
    model = get_model()
    collection = get_collection()

    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={"username": username}
    )

    return results["documents"][0]