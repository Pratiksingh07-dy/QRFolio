from chromadb import PersistentClient

client = PersistentClient(
    path="vector_db"
)

collection = client.get_collection(
    "resumes"
)

print(
    collection.count()
)