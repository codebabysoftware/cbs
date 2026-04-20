const PDFViewer = ({ lesson }) => {
  if (!lesson?.pdf_url) {
    return (
      <div className="text-center text-gray-500">
        No PDF available
      </div>
    );
  }

  const previewUrl = lesson.pdf_url.replace("view", "preview");

  return (
    <iframe
      src={previewUrl}
      className="w-full h-full border-none"
      title="PDF Viewer"
    />
  );
};

export default PDFViewer;