import { useRef, useState } from "react";
import { importMealsFromPdf } from "../../services/mealService.js";

const MAX_PDF_SIZE = 10 * 1024 * 1024;

const expectedColumns = [
  "Food name",
  "Meal type",
  "Quantity (g)",
  "Calories",
  "Protein",
  "Carbs",
  "Fat",
  "Date (optional)",
];

const BulkImportModal = ({ onClose, onImported, isImporting, setIsImporting }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    setError("");
    setResult(null);

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      setError("PDF must be 10MB or smaller.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError("");
    setResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError("Select a PDF file before importing.");
      return;
    }

    try {
      setIsImporting(true);
      setError("");

      const response = await importMealsFromPdf(selectedFile);
      setResult(response);
      onImported(response);
    } catch (importError) {
      console.log("Bulk import error:", importError);
      setError(importError.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-import-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 sm:p-7"
      >
        <h2 id="bulk-import-title" className="text-lg font-semibold text-white">
          Bulk import from PDF
        </h2>
        <p className="mt-1 text-sm text-muted">
          Upload a tabular food diary PDF to import multiple meals at once.
        </p>

        <section className="mt-6 rounded-xl border border-border bg-card-elevated p-4">
          <p className="text-sm font-medium text-white">Expected columns</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {expectedColumns.map((column) => (
              <li
                key={column}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted"
              >
                {column}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-subtle">
            Supports comma, tab, or pipe-separated tables. Optional micronutrient
            columns: Iron, Calcium, Vitamin C, Vitamin D.
          </p>
          <a
            href="/samples/meals-import-sample.pdf"
            download="meals-import-sample.pdf"
            className="mt-4 inline-flex text-xs font-medium text-white underline-offset-2 hover:underline"
          >
            Download sample PDF (10 rows)
          </a>
        </section>

        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">PDF file</p>
              <p className="mt-0.5 text-xs text-muted">Maximum size 10MB</p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="rounded-full border border-border px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-card disabled:opacity-50"
            >
              Choose PDF
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            disabled={isImporting}
            className="hidden"
          />

          {selectedFile && (
            <div className="rounded-xl border border-border bg-card-elevated px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {selectedFile.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearFile}
                  disabled={isImporting}
                  className="shrink-0 text-xs font-medium text-muted transition-colors hover:text-white disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
            >
              {error}
            </p>
          )}

          {result && (
            <div className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3">
              <p className="text-sm font-medium text-success">
                Imported {result.imported} meal{result.imported === 1 ? "" : "s"}
              </p>
              {result.skipped > 0 && (
                <p className="mt-1 text-xs text-muted">
                  Skipped {result.skipped} row{result.skipped === 1 ? "" : "s"}.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isImporting}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-card-elevated disabled:opacity-50"
          >
            {result ? "Close" : "Cancel"}
          </button>
          {!result && (
            <button
              type="button"
              onClick={handleImport}
              disabled={isImporting || !selectedFile}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isImporting ? "Importing…" : "Import meals"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;
