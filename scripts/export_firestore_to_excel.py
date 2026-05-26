#!/usr/bin/env python3
"""Export all Firestore collections from newsaidb to individual Excel files."""

import os
import json
import pandas as pd
from datetime import datetime
from google.cloud.firestore_v1 import DocumentSnapshot
import firebase_admin
from firebase_admin import credentials, firestore

PRIVATE_KEY = os.environ.get("NEXT_FIREBASE_ADMIN_PRIVATE_KEY", "").replace("\\n", "\n")
PROJECT_ID = os.environ.get("NEXT_FIREBASE_ADMIN_PROJECT_ID", "funcionarioslistaapp2025")
CLIENT_EMAIL = os.environ.get(
    "NEXT_FIREBASE_ADMIN_CLIENT_EMAIL",
    "firebase-app-hosting-compute@funcionarioslistaapp2025.iam.gserviceaccount.com",
)

COLLECTIONS = [
    "users",
    "saiBrands",
    "sai-brandLogoCatalog",
    "saiMarkets",
    "saiPieceItems",
    "saiWardrobeItems",
    "saiUserSavedSchemes",
    "saiSchemeItems",
    "saiOutfitPreferences",
    "saiDailyLooks",
    "saiPipelineJobs",
    "fai-artworkAssets",
    "saiWeekPlans",
    "mannequin_2d",
    "wardrobe_piece_2d",
    "outfitSelections",
]

OUTPUT_DIR = "/home/user/SAI-TCC-2026/exports"


def flatten_doc(doc_id: str, data: dict, prefix: str = "") -> dict:
    """Flatten a nested Firestore document into a flat dict."""
    flat = {"_doc_id": doc_id} if not prefix else {}
    for key, value in data.items():
        full_key = f"{prefix}.{key}" if prefix else key
        if hasattr(value, "timestamp"):  # Firestore Timestamp
            flat[full_key] = value.strftime("%Y-%m-%d %H:%M:%S") if hasattr(value, "strftime") else str(value)
        elif hasattr(value, "_seconds"):  # DatetimeWithNanoseconds
            try:
                flat[full_key] = value.isoformat()
            except Exception:
                flat[full_key] = str(value)
        elif isinstance(value, dict):
            nested = flatten_doc("", value, full_key)
            flat.update(nested)
        elif isinstance(value, list):
            flat[full_key] = json.dumps(value, ensure_ascii=False, default=str)
        else:
            flat[full_key] = value
    return flat


def export_collection(db, collection_name: str) -> pd.DataFrame:
    """Fetch all docs from a collection and return as DataFrame."""
    docs = db.collection(collection_name).stream()
    rows = []
    for doc in docs:
        data = doc.to_dict() or {}
        flat = flatten_doc(doc.id, data)
        rows.append(flat)
    if not rows:
        return pd.DataFrame(columns=["_doc_id", "(empty collection)"])
    return pd.DataFrame(rows)


def main():
    # Init Firebase Admin
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": PROJECT_ID,
        "private_key": PRIVATE_KEY,
        "client_email": CLIENT_EMAIL,
        "token_uri": "https://oauth2.googleapis.com/token",
    })

    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

    db = firestore.client(database_id="newsaidb")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    results = {}
    for col in COLLECTIONS:
        print(f"  Exportando: {col} ...", end=" ", flush=True)
        try:
            df = export_collection(db, col)
            results[col] = df
            print(f"{len(df)} docs")
        except Exception as e:
            print(f"ERRO: {e}")
            results[col] = pd.DataFrame(columns=["_doc_id", f"erro: {e}"])

    # Write one Excel per collection
    exported_files = []
    for col, df in results.items():
        safe_name = col.replace("/", "_").replace(" ", "_")
        path = os.path.join(OUTPUT_DIR, f"{safe_name}.xlsx")
        with pd.ExcelWriter(path, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name=col[:31])
        exported_files.append(path)
        print(f"  Salvo: {path}")

    # Also write a single workbook with all collections as sheets
    combined_path = os.path.join(OUTPUT_DIR, "newsaidb_completo.xlsx")
    with pd.ExcelWriter(combined_path, engine="openpyxl") as writer:
        for col, df in results.items():
            sheet = col[:31]
            df.to_excel(writer, index=False, sheet_name=sheet)
    print(f"\n  Workbook combinado: {combined_path}")
    exported_files.append(combined_path)

    return exported_files


if __name__ == "__main__":
    print("=== Exportando Firestore newsaidb para Excel ===")
    files = main()
    print(f"\nConcluído. {len(files)} arquivo(s) gerado(s).")
