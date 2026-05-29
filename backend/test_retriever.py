from rag.retriever import retrieve_chunks

results = retrieve_chunks(
    "What certifications does he have"
)

for i, chunk in enumerate(results):

    print(f"\nRESULT {i+1}")
    print("-" * 50)
    print(chunk)