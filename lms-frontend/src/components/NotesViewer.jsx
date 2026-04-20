import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";

/*
==================================================
STUDENT NOTES VIEWER
==================================================

Use for Google Drive / PDF / Docs notes

Props:
notesUrl

<NotesViewer notesUrl={selectedLesson?.notes_url} />
==================================================
*/

const NotesViewer = ({ notesUrl }) => {
  const [loading, setLoading] = useState(true);
  const [safeUrl, setSafeUrl] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // CONVERT GOOGLE DRIVE URL TO EMBED
  // ==========================================
  useEffect(() => {
    if (!notesUrl) {
      setSafeUrl("");
      setLoading(false);
      return;
    }

    try {
      const embed = convertToEmbed(notesUrl);
      setSafeUrl(embed);
      setLoading(true);
      setError("");
    } catch (err) {
      setError("Invalid notes link");
      setLoading(false);
    }
  }, [notesUrl]);

  // ==========================================
  // HELPERS
  // ==========================================
  const convertToEmbed = (url) => {
    if (!url) return "";

    // Google Drive file
    if (url.includes("drive.google.com")) {
      const match =
        url.match(/\/d\/(.*?)\//) ||
        url.match(/id=(.*?)(?:&|$)/);

      const fileId = match?.[1];

      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    // Google Docs
    if (url.includes("docs.google.com")) {
      return url.replace("/edit", "/preview");
    }

    // PDF direct
    return url;
  };

  // ==========================================
  // EMPTY STATE
  // ==========================================
  if (!notesUrl) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <FileText className="mx-auto text-slate-300 mb-3" size={42} />
        <h3 className="font-semibold text-slate-700">
          No Notes Available
        </h3>
        <p className="text-sm text-slate-500 mt-2">
          Notes will appear here when uploaded by admin.
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <AlertCircle
          className="mx-auto text-red-500 mb-3"
          size={42}
        />
        <h3 className="font-semibold text-slate-700">
          Failed to Load Notes
        </h3>
        <p className="text-sm text-slate-500 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">

      {/* HEADER */}
      <div className="border-b px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <FileText size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              Lesson Notes
            </h2>
            <p className="text-sm text-slate-500">
              View study notes, docs or PDFs
            </p>
          </div>
        </div>

        <div className="flex gap-2">

          <a
            href={notesUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            <ExternalLink size={16} />
            Open
          </a>

          <a
            href={notesUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download size={16} />
            Download
          </a>

        </div>
      </div>

      {/* VIEWER */}
      <div className="relative">

        {loading && (
          <div className="absolute inset-0 z-10 bg-white/80 flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="animate-spin" size={20} />
              Loading notes...
            </div>
          </div>
        )}

        <iframe
          title="notes-viewer"
          src={safeUrl}
          className="w-full h-[75vh]"
          onLoad={() => setLoading(false)}
        />

      </div>

      {/* FOOTER */}
      <div className="border-t px-5 py-3 bg-slate-50 flex items-center gap-2 text-sm text-slate-500">
        <Shield size={16} className="text-blue-600" />
        Notes are for enrolled students only.
      </div>
    </div>
  );
};

export default NotesViewer;