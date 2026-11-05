"""Helpers shared by the database scripts."""
import re
import sys
from pathlib import Path

DB_DIR = Path(__file__).resolve().parent
DOCS_DIR = DB_DIR.parent / "docs"

# Lets the scripts in this folder import backend/db.py.
sys.path.insert(0, str(DB_DIR.parent / "backend"))


def sql_blocks(filename):
    """Splits a .sql file into (title, notes, statement) tuples. A comment like
    '-- 1. Title' names the statement after it; later comments become its notes."""
    blocks, title, notes, lines = [], None, [], []
    for line in (DB_DIR / filename).read_text(encoding="utf-8").splitlines():
        text = line.strip()
        if text.startswith("--"):
            comment = text.lstrip("- ")
            if re.match(r"\d+\.\s", comment):
                title, notes = comment, []
            elif title:
                notes.append(comment)
            continue
        if text:
            lines.append(line)
        if text.endswith(";"):
            blocks.append((title, notes, "\n".join(lines).rstrip(";")))
            title, notes, lines = None, [], []
    return blocks


def md_table(columns, rows):
    """Formats query results as a Markdown table."""
    if not rows:
        return "(no rows)"
    cell = lambda v: "NULL" if v is None else str(v)
    out = ["| " + " | ".join(columns) + " |", "|" + "---|" * len(columns)]
    out += ["| " + " | ".join(cell(v) for v in row) + " |" for row in rows]
    return "\n".join(out)
