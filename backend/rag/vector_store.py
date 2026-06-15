from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
from uuid import uuid4

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
        _collection = _client.get_or_create_collection(name="resumes")
    return _collection

def store_chunks(chunks, username):
    model = get_model()
    collection = get_collection()

    documents, embeddings, ids, metadatas = [], [], [], []

    for chunk in chunks:
        embedding = model.encode(chunk).tolist()
        documents.append(chunk)
        embeddings.append(embedding)
        metadatas.append({"username": username})
        ids.append(f"{username}_{uuid4()}")

    collection.add(
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )

    return len(chunks)