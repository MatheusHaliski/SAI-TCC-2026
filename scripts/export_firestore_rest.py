#!/usr/bin/env python3
"""Export Firestore collections via REST API (no gRPC) to Excel files."""

import json
import os
import time
import requests
import pandas as pd
from google.oauth2 import service_account
from google.auth.transport.requests import Request

PROJECT_ID = "funcionarioslistaapp2025"
DATABASE_ID = "newsaidb"
OUTPUT_DIR = "/home/user/SAI-TCC-2026/exports"

PRIVATE_KEY_RAW = os.environ.get("NEXT_FIREBASE_ADMIN_PRIVATE_KEY", "")
PRIVATE_KEY = PRIVATE_KEY_RAW.replace("\\n", "\n").strip('"').strip("'")
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

BASE_URL = (
    f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}"
    f"/databases/{DATABASE_ID}/documents"
)


def get_token() -> str:
    sa_info = {
        "type": "service_account",
        "project_id": PROJECT_ID,
        "private_key": PRIVATE_KEY,
        "client_email": CLIENT_EMAIL,
        "token_uri": "https://oauth2.googleapis.com/token",
    }
    creds = service_account.Credentials.from_service_account_info(
        sa_info,
        scopes=["https://www.googleapis.com/auth/datastore"],
    )
    creds.refresh(Request())
    return creds.token


def parse_value(v: dict):
    """Convert a Firestore value dict to a Python native value."""
    if "stringValue" in v:
        return v["stringValue"]
    if "integerValue" in v:
        return int(v["integerValue"])
    if "doubleValue" in v:
        return float(v["doubleValue"])
    if "booleanValue" in v:
        return v["booleanValue"]
    if "timestampValue" in v:
        return v["timestampValue"]
    if "nullValue" in v:
        return None
    if "arrayValue" in v:
        items = v["arrayValue"].get("values", [])
        return json.dumps([parse_value(i) for i in items], ensure_ascii=False, default=str)
    if "mapValue" in v:
        fields = v["mapValue"].get("fields", {})
        nested = {k: parse_value(fv) for k, fv in fields.items()}
        return json.dumps(nested, ensure_ascii=False, default=str)
    if "referenceValue" in v:
        return v["referenceValue"]
    if "geoPointValue" in v:
        gp = v["geoPointValue"]
        return f"{gp.get('latitude')},{gp.get('longitude')}"
    if "bytesValue" in v:
        return str(v["bytesValue"])
    return str(v)


def fetch_collection(token: str, collection: str) -> list[dict]:
    """Fetch all documents from a Firestore collection via REST."""
    rows = []
    url = f"{BASE_URL}/{collection}"
    params = {"pageSize": 300}
    headers = {"Authorization": f"Bearer {token}"}

    while True:
        resp = requests.get(url, headers=headers, params=params, timeout=30)
        if resp.status_code == 404:
            print(f"    (coleção não encontrada ou vazia)")
            break
        resp.raise_for_status()
        data = resp.json()

        documents = data.get("documents", [])
        for doc in documents:
            doc_id = doc["name"].split("/")[-1]
            fields = doc.get("fields", {})
            row = {"_doc_id": doc_id}
            for field_name, field_val in fields.items():
                row[field_name] = parse_value(field_val)
            rows.append(row)

        next_page = data.get("nextPageToken")
        if not next_page:
            break
        params["pageToken"] = next_page
        time.sleep(0.1)

    return rows


def main():
    print("Obtendo token de acesso...")
    token = get_token()
    print("Token obtido com sucesso.")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    all_dfs: dict[str, pd.DataFrame] = {}

    for col in COLLECTIONS:
        print(f"  Exportando: {col} ...", end=" ", flush=True)
        try:
            rows = fetch_collection(token, col)
            df = pd.DataFrame(rows) if rows else pd.DataFrame(columns=["_doc_id"])
            all_dfs[col] = df
            print(f"{len(df)} docs")
        except Exception as e:
            print(f"ERRO: {e}")
            all_dfs[col] = pd.DataFrame(columns=["_doc_id", f"erro: {e}"])

    # Individual Excel files
    for col, df in all_dfs.items():
        safe_name = col.replace("/", "_").replace(" ", "_")
        path = os.path.join(OUTPUT_DIR, f"{safe_name}.xlsx")
        with pd.ExcelWriter(path, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name=col[:31])
        print(f"  Salvo: {path}")

    # Combined workbook
    combined_path = os.path.join(OUTPUT_DIR, "newsaidb_completo.xlsx")
    with pd.ExcelWriter(combined_path, engine="openpyxl") as writer:
        for col, df in all_dfs.items():
            df.to_excel(writer, index=False, sheet_name=col[:31])
    print(f"\n  Workbook combinado: {combined_path}")


if __name__ == "__main__":
    print("=== Exportando Firestore newsaidb para Excel (REST API) ===")
    main()
    print("Concluído.")
