import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Lock,
  CheckCircle2,
  Video,
  FileText,
  File,
  BookOpen,
  Save,
  RotateCcw,
} from "lucide-react";

import API from "../../api/api";

import VideoPlayer from "../../components/VideoPlayer";
import NotesViewer from "../../components/NotesViewer";
import PDFViewer from "../../components/PDFViewer";

/*
====================================================
FINAL CLEAN LMS COURSE PLAYER
====================================================
✔ Main section = Video only
✔ Sidebar = Video / Notes / PDF sections
✔ Notes shown below player when selected
✔ PDF shown below player when selected
✔ Better resolution
✔ Responsive
✔ Premium clean UI
✔ Stable rendering
====================================================
*/

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const saveRef =
    useRef(null);

  const [modules, setModules] =
    useState([]);

  const [
    selectedLesson,
    setSelectedLesson,
  ] = useState(null);

  const [
    progressMap,
    setProgressMap,
  ] = useState({});

  const [loading, setLoading] =
    useState(true);

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(true);

  const [userName, setUserName] =
    useState("Student");

  const [
    watchSeconds,
    setWatchSeconds,
  ] = useState(0);

  const [
    activeTab,
    setActiveTab,
  ] = useState("video"); // video / notes / pdf

  const [saving, setSaving] =
    useState(false);

  // ====================================
  // LOAD
  // ====================================
  useEffect(() => {
    loadAll();
  }, [id]);

  // ====================================
  // AUTOSAVE
  // ====================================
  useEffect(() => {
    if (!selectedLesson)
      return;

    clearInterval(
      saveRef.current
    );

    saveRef.current =
      setInterval(() => {
        setWatchSeconds(
          (prev) =>
            prev + 15
        );

        saveProgress(
          false
        );
      }, 15000);

    return () =>
      clearInterval(
        saveRef.current
      );
  }, [selectedLesson]);

  const loadAll =
    async () => {
      try {
        setLoading(true);

        const [
          contentRes,
          progressRes,
          meRes,
        ] =
          await Promise.all([
            API.get(
              `/courses/content/${id}/`
            ),
            API.get(
              `/courses/progress/${id}/`
            ),
            API.get(
              "/auth/me/"
            ),
          ]);

        const data =
          contentRes.data ||
          [];

        setModules(
          data
        );

        setUserName(
          meRes.data?.name ||
            meRes.data
              ?.username ||
            "Student"
        );

        const raw =
          progressRes.data;

        const arr =
          Array.isArray(
            raw
          )
            ? raw
            : [];

        const map = {};

        arr.forEach(
          (item) => {
            map[
              item.lesson_id
            ] = item;
          }
        );

        setProgressMap(
          map
        );

        const first =
          firstUnlocked(
            data
          );

        setSelectedLesson(
          first
        );

        setWatchSeconds(
          map[first?.id]
            ?.watched_seconds ||
            0
        );
      } catch (err) {
        console.error(
          err
        );
      } finally {
        setLoading(false);
      }
    };

  const firstUnlocked =
    (data) => {
      for (const m of data) {
        for (const l of m.lessons) {
          if (
            !l.is_locked
          )
            return l;
        }
      }
      return null;
    };

  const allLessons =
    useMemo(() => {
      const list =
        [];

      modules.forEach(
        (m) =>
          m.lessons.forEach(
            (l) =>
              list.push(
                l
              )
          )
      );

      return list;
    }, [modules]);

  const currentIndex =
    allLessons.findIndex(
      (x) =>
        x.id ===
        selectedLesson?.id
    );

  const openLesson =
    (
      lesson
    ) => {
      if (
        lesson.is_locked
      ) return;

      setSelectedLesson(
        lesson
      );

      setWatchSeconds(
        progressMap[
          lesson.id
        ]
          ?.watched_seconds ||
          0
      );

      setActiveTab(
        "video"
      );
    };

  const nextLesson =
    () => {
      if (
        currentIndex <
        allLessons.length -
          1
      ) {
        openLesson(
          allLessons[
            currentIndex +
              1
          ]
        );
      }
    };

  const prevLesson =
    () => {
      if (
        currentIndex >
        0
      ) {
        openLesson(
          allLessons[
            currentIndex -
              1
          ]
        );
      }
    };

  const saveProgress =
    async (
      manual = true
    ) => {
      if (
        !selectedLesson
      )
        return;

      try {
        if (
          manual
        )
          setSaving(
            true
          );

        await API.post(
          "/courses/progress/save/",
          {
            lesson_id:
              selectedLesson.id,
            watched_seconds:
              watchSeconds,
          }
        );
      } catch (err) {
        console.error(
          err
        );
      } finally {
        if (
          manual
        )
          setSaving(
            false
          );
      }
    };

  if (loading) {
    return (
      <div className="p-10 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden">

      {/* SIDEBAR */}
      <aside
        className={`bg-white border-r transition-all duration-300 ${
          sidebarOpen
            ? "w-[340px]"
            : "w-0 overflow-hidden"
        }`}
      >
        <div className="p-5 border-b">
          <h2 className="text-2xl font-bold">
            Course Content
          </h2>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-100px)]">

          {modules.map(
            (
              module
            ) => (
              <div
                key={
                  module.module_id
                }
                className="border rounded-2xl overflow-hidden"
              >
                <div className="px-4 py-3 bg-slate-50 font-semibold">
                  {
                    module.module
                  }
                </div>

                {module.lessons.map(
                  (
                    lesson
                  ) => {
                    const active =
                      selectedLesson?.id ===
                      lesson.id;

                    const done =
                      progressMap[
                        lesson.id
                      ]
                        ?.completed;

                    return (
                      <div
                        key={
                          lesson.id
                        }
                        className="border-t"
                      >
                        {/* VIDEO */}
                        <button
                          onClick={() =>
                            openLesson(
                              lesson
                            )
                          }
                          className={`w-full px-4 py-3 flex items-center gap-3 text-left ${
                            active
                              ? "bg-blue-50"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          {lesson.is_locked ? (
                            <Lock
                              size={16}
                              className="text-red-500"
                            />
                          ) : done ? (
                            <CheckCircle2
                              size={16}
                              className="text-green-600"
                            />
                          ) : (
                            <PlayCircle
                              size={16}
                              className="text-blue-600"
                            />
                          )}

                          <span className="font-medium text-sm">
                            {
                              lesson.title
                            }
                          </span>
                        </button>

                        {/* NOTES */}
                        <button
                          onClick={() => {
                            setSelectedLesson(
                              lesson
                            );
                            setActiveTab(
                              "notes"
                            );
                          }}
                          className="w-full px-10 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <FileText size={14} />
                          Notes
                        </button>

                        {/* PDF */}
                        <button
                          onClick={() => {
                            setSelectedLesson(
                              lesson
                            );
                            setActiveTab(
                              "pdf"
                            );
                          }}
                          className="w-full px-10 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <File size={14} />
                          PDF Material
                        </button>

                      </div>
                    );
                  }
                )}
              </div>
            )
          )}

        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">

        {/* TOPBAR */}
        <div className="sticky top-0 bg-white border-b z-20 px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
              className="p-2 rounded-xl bg-slate-100"
            >
              {sidebarOpen ? (
                <ChevronLeft />
              ) : (
                <ChevronRight />
              )}
            </button>

            <div>
              <h2 className="text-xl font-bold">
                {
                  selectedLesson?.title
                }
              </h2>

              <p className="text-sm text-slate-500">
                Learning Mode
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={
                prevLesson
              }
              className="px-4 py-2 rounded-xl bg-slate-100"
            >
              Prev
            </button>

            <button
              onClick={
                nextLesson
              }
              className="px-4 py-2 rounded-xl bg-blue-600 text-white"
            >
              Next
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">

          {/* VIDEO PLAYER ALWAYS TOP */}
          {/* VIDEO PLAYER ALWAYS TOP */}
<section className="bg-white rounded-3xl p-6 shadow-sm">
  <div className="flex items-center gap-3 mb-5">
    <Video
      className="text-blue-600"
      size={18}
    />
    <h3 className="text-xl font-bold">
      Video Lesson
    </h3>
  </div>

  {/* RESPONSIVE PREMIUM LARGE PLAYER */}
  <div className="w-full">
    <div
      className="
      relative
      w-full
      rounded-2xl
      overflow-hidden
      bg-black

      aspect-video

      min-h-[320px]
      sm:min-h-[420px]
      md:min-h-[520px]
      lg:min-h-[620px]
      xl:min-h-[720px]
      2xl:min-h-[820px]
    "
    >
      <VideoPlayer
        lesson={
          selectedLesson
        }
        userName={
          userName
        }
      />
    </div>
  </div>
</section>

          {/* BELOW VIDEO CONTENT */}
          {activeTab ===
            "notes" && (
            <section className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <FileText
                  size={18}
                  className="text-green-600"
                />
                <h3 className="text-xl font-bold">
                  Notes
                </h3>
              </div>

              <NotesViewer
                notesUrl={
                  selectedLesson?.notes_url
                }
              />
            </section>
          )}

          {activeTab ===
            "pdf" && (
            <section className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <File
                  size={18}
                  className="text-red-600"
                />
                <h3 className="text-xl font-bold">
                  PDF Material
                </h3>
              </div>

              <PDFViewer
                pdfUrl={
                  selectedLesson?.pdf_url
                }
              />
            </section>
          )}

          {/* ACTIONS */}
          <div className="grid md:grid-cols-3 gap-4">

            <button
              onClick={() =>
                saveProgress(
                  true
                )
              }
              className="rounded-2xl bg-slate-200 py-3 font-semibold"
            >
              {saving
                ? "Saving..."
                : "Save Progress"}
            </button>

            <button
              onClick={() =>
                setWatchSeconds(
                  0
                )
              }
              className="rounded-2xl bg-yellow-500 text-white py-3 font-semibold flex justify-center items-center gap-2"
            >
              <RotateCcw size={16} />
              Restart
            </button>

            <button
              onClick={() =>
                navigate(
                  "/student/dashboard"
                )
              }
              className="rounded-2xl bg-blue-600 text-white py-3 font-semibold flex justify-center items-center gap-2"
            >
              <BookOpen size={16} />
              Dashboard
            </button>

          </div>

        </div>
      </main>
    </div>
  );
};

export default CoursePlayer;