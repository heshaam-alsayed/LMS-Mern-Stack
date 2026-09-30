"use client";

import { ExternalLink, Link2, FileText } from "lucide-react";

type Resource = {
  title: string;
  url: string;
};

type Props = {
  links: Resource[];
};

export default function ResourcesTab({ links }: Props) {
  if (!links || links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Link2 className="size-5 text-muted-foreground" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-foreground">
          No resources available
        </h3>

        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          There are no additional resources available for this lesson.
        </p>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Lesson Resources
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Additional materials and useful links for this lesson.
        </p>
      </div>

      {/* Resources */}
      <div className="space-y-3">
        {links.map((resource, index) => (
          <a
            key={`${resource.url}-${index}`}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50">
            {/* Icon */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
              <FileText className="size-5 text-primary" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {resource.title}
              </h3>

              <p className="mt-1 truncate text-xs text-muted-foreground">
                {resource.url}
              </p>
            </div>

            {/* Action */}
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-muted group-hover:text-foreground">
              <ExternalLink className="size-4" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}