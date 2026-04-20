const SidebarLessons = ({
  content,
  activeLesson,
  onLessonClick,
  lessonProgress,
}) => {
  return (
    <div className="w-72 bg-white border-r overflow-y-auto hidden md:block">
      
      <div className="p-4 font-semibold border-b text-slate-800">
        Course Content
      </div>

      {content.map((module, i) => (
        <div key={i} className="p-3">
          
          <h3 className="text-sm font-semibold text-slate-600 mb-2">
            {module.module}
          </h3>

          {module.lessons.map((lesson) => {
            const progress =
              lessonProgress[lesson.id]?.watched_seconds || 0;

            return (
              <div
                key={lesson.id}
                onClick={() => onLessonClick(lesson)}
                className={`p-2 rounded cursor-pointer ${
                  lesson.locked
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-blue-50"
                } ${
                  activeLesson?.id === lesson.id
                    ? "bg-blue-100 text-blue-700"
                    : ""
                }`}
              >
                <div className="flex justify-between text-sm">
                  <span>{lesson.title}</span>
                  {lesson.locked && <span>🔒</span>}
                </div>

                {/* PROGRESS BAR */}
                <div className="mt-1 h-1 bg-gray-200 rounded">
                  <div
                    className="h-1 bg-blue-600 rounded"
                    style={{
                      width: `${Math.min(progress / 2, 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SidebarLessons;