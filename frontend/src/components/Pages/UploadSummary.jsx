import { useMemo, useState } from 'react';
import { FileText, FileUp, Sparkles } from 'lucide-react';
import { summaryAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const MAX_CHARS = 12000;
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['txt', 'md', 'rtf'];

const UploadSummary = () => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { addToast } = useToast();

  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return 0;
    }
    return trimmed.split(/\s+/).length;
  }, [text]);

  const resetAll = () => {
    setText('');
    setFileName('');
    setSummary('');
  };

  const enforceLimit = (value) => {
    if (value.length <= MAX_CHARS) {
      return value;
    }
    addToast(`Text limit is ${MAX_CHARS.toLocaleString()} characters`, 'warning');
    return value.slice(0, MAX_CHARS);
  };

  const readFileAsText = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });

  const validateFile = (file) => {
    if (!file) {
      return false;
    }
    if (file.size > MAX_BYTES) {
      addToast('File is too large. Limit is 2 MB.', 'warning');
      return false;
    }
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      addToast('Please upload a .txt, .md, or .rtf file.', 'warning');
      return false;
    }
    return true;
  };

  const handleFile = async (file) => {
    if (!validateFile(file)) {
      return;
    }
    try {
      const content = await readFileAsText(file);
      setText(enforceLimit(content));
      setFileName(file.name);
      setSummary('');
      addToast('Document loaded. You can edit the text before summarizing.', 'success');
    } catch (error) {
      console.error('File read error:', error);
      addToast('Unable to read that file.', 'error');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      addToast('Add some text before generating a summary.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const response = await summaryAPI.generateSummary(null, text.trim());
      const summaryText = response?.data?.summary;
      if (!summaryText) {
        throw new Error('Summary not returned');
      }
      setSummary(summaryText);
      addToast('Summary generated.', 'success');
    } catch (error) {
      console.error('Summary error:', error);
      addToast('Unable to generate summary. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!summary) {
      return;
    }
    try {
      await navigator.clipboard.writeText(summary);
      addToast('Summary copied to clipboard.', 'success');
    } catch (error) {
      console.error('Clipboard error:', error);
      addToast('Unable to copy summary.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-amber-50 py-8 transition-colors duration-200 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-amber-200">
            <Sparkles className="h-4 w-4" />
            Summarize your own sources
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Upload or paste a document</h1>
          <p className="text-lg text-slate-600">Drop a file or paste text to get a clean AI summary you can save or share.</p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="space-y-6">
            <div
              className={`relative bg-white rounded-3xl border-2 border-dashed ${dragActive ? 'border-sky-400 bg-sky-50' : 'border-slate-200'} p-6 shadow-lg transition-all`}
              onDragEnter={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => {
                event.preventDefault();
                setDragActive(false);
              }}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center">
                  <FileUp className="h-7 w-7 text-sky-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">Drop a document here</p>
                  <p className="text-sm text-slate-500">Supported: .txt, .md, .rtf (max 2 MB)</p>
                </div>
                <label className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-slate-800 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".txt,.md,.rtf"
                    className="hidden"
                    onChange={(event) => handleFile(event.target.files?.[0])}
                  />
                  <FileText className="h-4 w-4" />
                  Choose file
                </label>
                {fileName && (
                  <div className="text-sm text-slate-600">Loaded: {fileName}</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-900">Paste or edit text</h2>
                <span className="text-sm text-slate-500">{text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}</span>
              </div>
              <textarea
                value={text}
                onChange={(event) => setText(enforceLimit(event.target.value))}
                placeholder="Paste the article or report text here..."
                rows={10}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-colors"
              />
              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>{wordCount.toLocaleString()} words</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>Auto-summarize in seconds</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={loading || !text.trim()}
                    className="px-6 py-2.5 rounded-xl bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Summarizing...' : 'Generate summary'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Summary preview</h2>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!summary}
                className="text-sm font-medium text-sky-600 hover:text-sky-700 disabled:text-slate-400"
              >
                Copy
              </button>
            </div>
            {summary ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {summary}
                </div>
                <div className="text-sm text-slate-500">
                  Tip: You can edit the text on the left and regenerate if the tone needs adjusting.
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-500">
                Upload a document or paste text to see the summary here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSummary;
