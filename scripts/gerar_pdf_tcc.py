#!/usr/bin/env python3
"""
Converte especificacao_fai_social_network.md -> PDF com formatação ABNT TCC.
- Renderiza diagramas Mermaid como imagens PNG
- Aplica margens ABNT: esq 3cm, dir 2cm, sup 3cm, inf 2cm
- Fonte Arial 12pt, espaçamento 1.5, parágrafo 1.25cm
"""

import re
import os
import sys
import subprocess
import tempfile
import base64
import shutil
import markdown
from pathlib import Path

MMDC = "node /opt/node22/lib/node_modules/@mermaid-js/mermaid-cli/src/cli.js"
MD_FILE = "/root/.claude/uploads/39d13280-63fa-4b26-bacb-2dfb69ea696a/d7f1be3d-especificacaofaisocialnetwork.md"
OUT_PDF = "/home/user/SAI-TCC-2026/FAI_Social_Network_Especificacao_TCC.pdf"

MERMAID_CFG = """{
  "theme": "default",
  "themeVariables": {
    "fontSize": "14px",
    "fontFamily": "Arial, sans-serif"
  }
}"""

PUPPETEER_CFG = """{
  "args": ["--no-sandbox", "--disable-setuid-sandbox"]
}"""


def render_mermaid(code: str, tmp_dir: str, idx: int) -> str | None:
    """Renderiza bloco mermaid -> PNG, retorna path do PNG ou None."""
    src = os.path.join(tmp_dir, f"diag_{idx}.mmd")
    out = os.path.join(tmp_dir, f"diag_{idx}.png")
    cfg = os.path.join(tmp_dir, "mermaid_config.json")
    pcfg = os.path.join(tmp_dir, "puppeteer_config.json")

    with open(src, "w") as f:
        f.write(code.strip())
    with open(cfg, "w") as f:
        f.write(MERMAID_CFG)
    with open(pcfg, "w") as f:
        f.write(PUPPETEER_CFG)

    cmd = (
        f"{MMDC} -i {src} -o {out} -c {cfg} -p {pcfg} "
        f"-b white --width 1000 --height 700 -q"
    )
    result = subprocess.run(cmd, shell=True, capture_output=True, timeout=90)
    if result.returncode == 0 and os.path.exists(out):
        return out
    return None


def img_to_data_uri(path: str) -> str:
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode()
    return f"data:image/png;base64,{data}"


def process_markdown(md_text: str, tmp_dir: str) -> str:
    """Substitui blocos mermaid por tags <img> com data URI, plantuml por bloco estilizado."""
    mermaid_idx = [0]

    def replace_mermaid(m):
        code = m.group(1)
        idx = mermaid_idx[0]
        mermaid_idx[0] += 1
        png = render_mermaid(code, tmp_dir, idx)
        if png:
            uri = img_to_data_uri(png)
            return f'\n<div class="diagram-wrap"><img src="{uri}" alt="Diagrama {idx+1}" class="diagram"/></div>\n'
        # fallback: bloco de código estilizado
        escaped = code.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        return f'\n<div class="diagram-wrap"><pre class="diagram-code">{escaped}</pre></div>\n'

    def replace_plantuml(m):
        code = m.group(1)
        escaped = code.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        return (
            f'\n<div class="diagram-wrap plantuml-note">'
            f'<p class="diagram-label">Diagrama de Casos de Uso (PlantUML)</p>'
            f'<pre class="diagram-code">{escaped}</pre></div>\n'
        )

    # Substituir blocos mermaid
    md_text = re.sub(
        r"```mermaid\n(.*?)```",
        replace_mermaid,
        md_text,
        flags=re.DOTALL
    )
    # Substituir blocos plantuml
    md_text = re.sub(
        r"```plantuml\n(.*?)```",
        replace_plantuml,
        md_text,
        flags=re.DOTALL
    )
    return md_text


CSS = """
@import url('https://fonts.googleapis.com/css2?family=Arial');

/* ===== ABNT NBR 14724 ===== */
@page {
    size: A4;
    margin-top:    3cm;
    margin-bottom: 2cm;
    margin-left:   3cm;
    margin-right:  2cm;

    @top-right {
        content: counter(page);
        font-family: Arial, sans-serif;
        font-size: 10pt;
        color: #333;
    }
}

@page :first {
    @top-right { content: ""; }
}

* { box-sizing: border-box; }

body {
    font-family: Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #000;
    text-align: justify;
    hyphens: auto;
}

/* ===== CAPAS / CAPA ===== */
.cover-page {
    page-break-after: always;
    text-align: center;
    padding-top: 4cm;
}
.cover-page h1 {
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5cm;
}
.cover-page .subtitle {
    font-size: 12pt;
    margin-bottom: 3cm;
}
.cover-page .authors {
    font-size: 12pt;
    margin-bottom: 0.5cm;
}
.cover-page .institution {
    position: absolute;
    bottom: 3cm;
    left: 0; right: 0;
    text-align: center;
    font-size: 12pt;
}

/* ===== SUMÁRIO ===== */
.toc-section {
    page-break-after: always;
}

/* ===== TÍTULOS ===== */
h1 {
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
    text-align: left;
    margin-top: 2cm;
    margin-bottom: 0.5cm;
    page-break-before: always;
    color: #000;
}

h1:first-of-type {
    page-break-before: avoid;
}

h2 {
    font-size: 12pt;
    font-weight: bold;
    text-align: left;
    margin-top: 1.2cm;
    margin-bottom: 0.4cm;
    color: #000;
}

h3 {
    font-size: 12pt;
    font-weight: bold;
    font-style: italic;
    margin-top: 1cm;
    margin-bottom: 0.3cm;
    color: #000;
}

h4 {
    font-size: 12pt;
    font-weight: bold;
    margin-top: 0.8cm;
    margin-bottom: 0.2cm;
}

/* ===== PARÁGRAFOS ===== */
p {
    margin-top: 0;
    margin-bottom: 0.4cm;
    text-indent: 1.25cm;
}

/* Parágrafos após títulos não recuam */
h1 + p, h2 + p, h3 + p, h4 + p,
h1 + blockquote, h2 + blockquote {
    text-indent: 0;
}

/* ===== BLOCKQUOTE (nota introdutória) ===== */
blockquote {
    margin: 0.5cm 0 0.5cm 4cm;
    font-size: 10pt;
    line-height: 1.3;
    text-indent: 0;
    border-left: none;
    color: #222;
}
blockquote p {
    text-indent: 0;
    margin-bottom: 0.2cm;
}

/* ===== TABELAS ===== */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.6cm 0;
    font-size: 11pt;
    page-break-inside: avoid;
}

table caption {
    font-weight: bold;
    text-align: left;
    margin-bottom: 0.2cm;
    font-size: 11pt;
}

thead tr {
    background-color: #1a1a2e;
    color: #ffffff;
}

thead th {
    padding: 8px 10px;
    text-align: left;
    font-weight: bold;
    border: 1px solid #333;
    font-size: 10.5pt;
}

tbody td {
    padding: 7px 10px;
    border: 1px solid #aaa;
    vertical-align: top;
    line-height: 1.4;
}

tbody tr:nth-child(even) {
    background-color: #f5f5f5;
}

tbody tr:hover {
    background-color: #eaf0fb;
}

/* ===== LISTAS ===== */
ul, ol {
    margin-left: 1.5cm;
    margin-bottom: 0.4cm;
    padding-left: 0.5cm;
}

li {
    margin-bottom: 0.15cm;
    line-height: 1.5;
}

/* ===== CÓDIGO INLINE ===== */
code {
    font-family: "Courier New", monospace;
    font-size: 10.5pt;
    background: #f0f0f0;
    padding: 1px 4px;
    border-radius: 2px;
}

/* ===== BLOCOS DE CÓDIGO ===== */
pre {
    background: #f8f8f8;
    border: 1px solid #ddd;
    border-left: 4px solid #4a90d9;
    padding: 0.4cm;
    font-size: 9pt;
    font-family: "Courier New", monospace;
    overflow-x: auto;
    margin: 0.4cm 0;
    page-break-inside: avoid;
    line-height: 1.4;
}

pre code {
    background: none;
    padding: 0;
    font-size: 9pt;
}

/* ===== DIAGRAMAS ===== */
.diagram-wrap {
    text-align: center;
    margin: 0.8cm 0;
    page-break-inside: avoid;
}

.diagram-wrap img.diagram {
    max-width: 100%;
    height: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.3cm;
    background: #fff;
}

.diagram-code {
    text-align: left;
    border-left: 4px solid #e67e22;
    background: #fef9f0;
    font-size: 8.5pt;
}

.plantuml-note .diagram-label {
    font-style: italic;
    font-weight: bold;
    color: #555;
    margin-bottom: 0.2cm;
    text-indent: 0;
}

/* ===== LINHA HORIZONTAL ===== */
hr {
    border: none;
    border-top: 1px solid #ccc;
    margin: 0.8cm 0;
}

/* ===== NEGRITO / ITÁLICO ===== */
strong { font-weight: bold; }
em { font-style: italic; }

/* ===== HYPERLINKS ===== */
a { color: #000; text-decoration: none; }

/* ===== RODAPÉ DO DOCUMENTO ===== */
.doc-footer {
    margin-top: 2cm;
    font-size: 10pt;
    font-style: italic;
    text-align: center;
    color: #555;
    border-top: 1px solid #ccc;
    padding-top: 0.3cm;
}
"""

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">
<style>
{css}
</style>
</head>
<body>
{body}
</body>
</html>
"""


def md_to_html(md_text: str) -> str:
    extensions = [
        "tables",
        "fenced_code",
        "codehilite",
        "toc",
        "nl2br",
        "sane_lists",
        "attr_list",
    ]
    try:
        html = markdown.markdown(md_text, extensions=extensions)
    except Exception:
        html = markdown.markdown(md_text, extensions=["tables", "fenced_code"])
    return html


def main():
    print("Lendo arquivo Markdown...")
    with open(MD_FILE, "r", encoding="utf-8") as f:
        md_text = f.read()

    tmp_dir = tempfile.mkdtemp(prefix="tcc_mermaid_")
    print(f"Diretório temporário: {tmp_dir}")

    try:
        print("Renderizando diagramas Mermaid...")
        md_processed = process_markdown(md_text, tmp_dir)

        # Contar quantos diagramas foram renderizados
        diagrams_rendered = md_processed.count('<img src="data:image/png')
        diagrams_fallback = md_processed.count('class="diagram-code"')
        print(f"  Diagramas renderizados como imagem: {diagrams_rendered}")
        print(f"  Diagramas em modo código (fallback): {diagrams_fallback}")

        print("Convertendo Markdown -> HTML...")
        body_html = md_to_html(md_processed)

        full_html = HTML_TEMPLATE.format(css=CSS, body=body_html)

        html_path = os.path.join(tmp_dir, "doc.html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(full_html)

        print("Gerando PDF com WeasyPrint...")
        from weasyprint import HTML as WP_HTML, CSS as WP_CSS
        from weasyprint.text.fonts import FontConfiguration

        font_config = FontConfiguration()
        wp = WP_HTML(filename=html_path)
        wp.write_pdf(
            OUT_PDF,
            font_config=font_config,
        )

        size_kb = os.path.getsize(OUT_PDF) / 1024
        print(f"\n✓ PDF gerado com sucesso!")
        print(f"  Arquivo: {OUT_PDF}")
        print(f"  Tamanho: {size_kb:.0f} KB")

    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


if __name__ == "__main__":
    main()
