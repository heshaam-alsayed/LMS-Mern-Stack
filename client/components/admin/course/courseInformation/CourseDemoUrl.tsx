"use client";

import VideoUploader from "../courseContent/VideoUploader";

type Props = {
  value: string;
  onChange: (value: string) => void;
  videoTitle?: string;
};

export default function CourseDemoUrl({ value, onChange, videoTitle }: Props) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Demo Video</label>

      <VideoUploader
        title={videoTitle?.trim() || "Course Demo"}
        videoUrl={value}
        onUploaded={onChange}
      />

      <div className="space-y-2">
        <label
          htmlFor="demoUrl"
          className="text-sm font-medium text-foreground">
          Demo Video ID
        </label>

        <input
          id="demoUrl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="82b2350d035bca04a2806467f53b6b51"
          required
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        />

        <p className="text-xs text-muted-foreground">
          Uploading a video fills this field automatically. You can also paste
          an existing video ID.
        </p>
      </div>
    </div>
  );
}
