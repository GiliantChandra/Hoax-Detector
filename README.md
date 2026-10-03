# Smart News & Information Verifier (Hoax-Detector)

Proyek mata kuliah *Computational Intelligence*: sistem web **decision-support** yang memberi **Trust Score** beserta bukti dan alasan — bukan vonis kebenaran.

**Pipeline inti:** NLP preprocessing → ekstraksi klaim → TF-IDF + SVM (risiko gaya bahasa) → real-time evidence retrieval → embedding similarity → NLI (stance) → source reliability → **fuzzy hierarkis** → Trust Score → penjelasan.

LLM bersifat *opsional/auxiliary* (claim extraction & penjelasan ter-grounded), tidak pernah menentukan skor. Lihat [docs/decisions.md](docs/decisions.md).

## Status
| Fase | Status |
|---|---|
| 0. Fondasi (repo, ADR, dataset audit) | **sedang berjalan** |
| 1. ML baseline | belum |
| 2. Evidence engine | belum |
| 3. Fuzzy engine | belum |
| 4. Backend + Frontend + Docker Compose | belum |
| 5. Evaluasi & fitur tambahan | belum |

## Struktur
```
docs/        ADR, rencana & hasil dataset audit
ml/audit/    skrip audit dataset
data/        raw / processed / curated_test (tidak di-commit)
reports/     keluaran audit
models/      artifact model (tidak di-commit)
```
Desain lengkap: *System Design Proposal v1* (disetujui).

## Menjalankan dataset audit
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r ml/requirements-audit.txt
python ml/audit/audit_dataset.py --hf nlp-brin-id/fakenews-mafindo --name mafindo `
  --label-col Label --text-col Content --title-col Title --fact-col Fact --ref-col References
```
Nama kolom diverifikasi dari dataset card/`df.columns`; sesuaikan jika berbeda.

> **Dataset BRIN (`nlp-brin-id/*`) bersifat *gated* di Hugging Face.** Sebelum audit: (1) login di huggingface.co, (2) buka halaman dataset dan setujui syarat akses, (3) buat token *read* lalu jalankan `.\.venv\Scripts\hf auth login` (atau set `HF_TOKEN`). Token jangan pernah di-commit.

> Docker belum terpasang di mesin dev saat ini (primary deploy = Docker Compose). Pasang Docker Desktop sebelum Fase 4.
