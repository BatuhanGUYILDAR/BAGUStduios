from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any

try:
    import chromadb
except Exception:  # pragma: no cover
    chromadb = None


class MemoryStore:
    def __init__(self) -> None:
        self.data_dir = Path(__file__).resolve().parents[1] / "data" / "memory"
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.fallback_path = self.data_dir / "memory.jsonl"
        self.collection = None
        if chromadb:
            try:
                client = chromadb.PersistentClient(path=str(self.data_dir / "chroma"))
                self.collection = client.get_or_create_collection("electro_agent_memory")
            except Exception:
                self.collection = None

    def remember(self, text: str, metadata: dict[str, Any] | None = None) -> dict[str, Any]:
        metadata = metadata or {}
        memory_id = f"mem_{datetime.utcnow().timestamp():.6f}"
        record = {
            "id": memory_id,
            "text": text,
            "metadata": metadata,
            "timestamp": datetime.utcnow().isoformat(),
        }
        if self.collection:
            try:
                self.collection.add(ids=[memory_id], documents=[text], metadatas=[metadata])
                mode = "chromadb"
            except Exception:
                mode = "unavailable"
        else:
            try:
                with self.fallback_path.open("a", encoding="utf-8") as handle:
                    handle.write(json.dumps(record, ensure_ascii=True) + "\n")
                mode = "jsonl"
            except OSError:
                mode = "unavailable"
        return {"stored": mode != "unavailable", "id": memory_id, "mode": mode}

    def recall(self, query: str, limit: int = 5) -> list[dict[str, Any]]:
        if self.collection:
            results = self.collection.query(query_texts=[query], n_results=limit)
            documents = results.get("documents", [[]])[0]
            ids = results.get("ids", [[]])[0]
            return [{"id": memory_id, "text": document} for memory_id, document in zip(ids, documents)]

        if not self.fallback_path.exists():
            return []
        rows = []
        try:
            with self.fallback_path.open("r", encoding="utf-8") as handle:
                for line in handle:
                    try:
                        record = json.loads(line)
                    except json.JSONDecodeError:
                        continue
                    if query.lower() in record.get("text", "").lower():
                        rows.append(record)
        except OSError:
            return []
        return rows[-limit:]
