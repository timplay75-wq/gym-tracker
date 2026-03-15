import { useState, useRef } from 'react';
import { useLanguage } from '@/i18n';
import { useToast } from '@/hooks/useToast';
import { Download, Upload, FileJson, FileSpreadsheet, X, AlertTriangle } from 'lucide-react';
import { exportAllJSON, exportWorkoutsCSV, validateImportFile, importData, type ExportData, type ImportPreview } from '@/services/dataExport';

export function ExportImportSection() {
  const { t } = useLanguage();
  const toast = useToast();
  const [exporting, setExporting] = useState<'json' | 'csv' | null>(null);
  const [importModal, setImportModal] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importFileData, setImportFileData] = useState<ExportData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = async () => {
    setExporting('json');
    try {
      await exportAllJSON();
      toast.success(t.profile.exportSuccess || 'Exported successfully');
    } catch {
      toast.error(t.profile.exportError || 'Export failed');
    } finally {
      setExporting(null);
    }
  };

  const handleExportCSV = async () => {
    setExporting('csv');
    try {
      await exportWorkoutsCSV();
      toast.success(t.profile.exportSuccess || 'Exported successfully');
    } catch {
      toast.error(t.profile.exportError || 'Export failed');
    } finally {
      setExporting(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const result = validateImportFile(content);
      if (result.valid && result.data && result.preview) {
        setImportPreview(result.preview);
        setImportFileData(result.data);
        setImportError(null);
      } else {
        setImportError(result.error || 'Invalid file');
        setImportPreview(null);
        setImportFileData(null);
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be re-selected
    e.target.value = '';
  };

  const handleImport = async () => {
    if (!importFileData) return;
    setImporting(true);
    try {
      const result = await importData(importFileData, 'merge');
      toast.success(
        `${t.profile.importSuccess || 'Imported'}: ${result.workouts} ${t.profile.workouts || 'workouts'}, ${result.programs} ${t.profile.programsLabel || 'programs'}`
      );
      setImportModal(false);
      setImportPreview(null);
      setImportFileData(null);
    } catch {
      toast.error(t.profile.importError || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const closeImportModal = () => {
    setImportModal(false);
    setImportPreview(null);
    setImportFileData(null);
    setImportError(null);
  };

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">
          {t.profile.dataSection}
        </h3>
        <div className="bg-white dark:bg-[#16213e] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            disabled={exporting === 'json'}
            className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-gray-800 disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <FileJson className="w-5 h-5 text-[#9333ea]" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {t.profile.exportJSON || 'Export JSON'}
              </span>
            </div>
            <Download className="w-4 h-4 text-gray-400" />
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            disabled={exporting === 'csv'}
            className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-gray-800 disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-[#22c55e]" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {t.profile.exportCSV || 'Export CSV'}
              </span>
            </div>
            <Download className="w-4 h-4 text-gray-400" />
          </button>

          {/* Import */}
          <button
            onClick={() => setImportModal(true)}
            className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-[#f59e0b]" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {t.profile.importData || 'Import Data'}
              </span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {importModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={closeImportModal}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white dark:bg-[#16213e] rounded-2xl p-6 mx-6 max-w-[380px] w-full shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.profile.importData || 'Import Data'}
              </h3>
              <button onClick={closeImportModal} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* File picker */}
            {!importPreview && !importError && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {t.profile.importDesc || 'Select a JSON backup file exported from Gym Tracker'}
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center gap-2 hover:border-[#9333ea] dark:hover:border-[#9333ea] transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.profile.selectFile || 'Select file'}
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}

            {/* Error */}
            {importError && (
              <div className="mb-4">
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 mb-3">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p className="text-sm">{importError}</p>
                </div>
                <button
                  onClick={() => { setImportError(null); fileInputRef.current?.click(); }}
                  className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm"
                >
                  {t.profile.tryAgain || 'Try again'}
                </button>
              </div>
            )}

            {/* Preview */}
            {importPreview && (
              <div className="mb-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold text-[#9333ea] mb-2">{t.profile.foundData || 'Found data:'}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      💪 {importPreview.workouts} {t.profile.workouts || 'workouts'}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      🏋️ {importPreview.exercises} {t.profile.exercisesLabel || 'exercises'}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      📋 {importPreview.programs} {t.profile.programsLabel || 'programs'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeImportModal}
                    className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm"
                  >
                    {t.common?.cancel || 'Cancel'}
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={importing}
                    className="flex-1 py-2.5 bg-[#9333ea] text-white rounded-xl font-semibold text-sm active:bg-[#7c3aed] disabled:opacity-50"
                  >
                    {importing
                      ? (t.profile.importing || 'Importing...')
                      : (t.profile.importBtn || 'Import')
                    }
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
