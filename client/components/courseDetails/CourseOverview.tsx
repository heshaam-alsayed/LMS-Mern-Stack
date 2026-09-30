type Props = {
  contentList?: any[];
};

export default function CourseOverview({ contentList = [] }: Props) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Course Overview
      </h2>

      <div className="mt-5">
        {contentList.length > 0 ? (
          <div>
            {/* 
              Course content will be rendered here.

              Example:
              Section
                Lesson
                Lesson
                Lesson
            */}
          </div>
        ) : (
          <div className="py-2">
            <p className="text-sm text-muted-foreground">
              Course content will be available here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
