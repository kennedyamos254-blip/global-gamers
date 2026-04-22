import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExternalBlob } from "@caffeineai/object-storage";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  CloudUpload,
  Film,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { useUploadVideo } from "../hooks/useBackend";

const MAX_FILE_SIZE_MB = 500;
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DropzoneProps {
  file: File | null;
  isDragging: boolean;
  onFileSelect: (f: File) => void;
  onFileRemove: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function UploadDropzone({
  file,
  isDragging,
  onFileSelect,
  onFileRemove,
  onDragOver,
  onDragLeave,
  onDrop,
  inputRef,
}: DropzoneProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) onFileSelect(picked);
    e.target.value = "";
  };

  if (file) {
    return (
      <div
        data-ocid="upload.dropzone"
        className="relative flex items-center gap-4 rounded-xl border border-primary/40 bg-primary/5 p-5"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/15">
          <Film size={22} className="text-primary" />
        </div>
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          <p className="truncate font-display font-semibold text-foreground text-sm">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(file.size)}
          </p>
        </div>
        <Badge className="badge-premium shrink-0">Ready</Badge>
        <button
          type="button"
          aria-label="Remove video file"
          onClick={onFileRemove}
          data-ocid="upload.remove_file_button"
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      data-ocid="upload.dropzone"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      aria-label="Upload video — drag and drop or click to browse"
      className={[
        "w-full flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 text-center transition-smooth select-none",
        isDragging
          ? "border-primary bg-primary/10 scale-[1.01]"
          : "border-border bg-muted/20 hover:border-primary/60 hover:bg-primary/5",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-16 w-16 items-center justify-center rounded-full transition-smooth",
          isDragging ? "bg-primary/25" : "bg-muted/60",
        ].join(" ")}
      >
        <UploadCloud
          size={30}
          className={isDragging ? "text-primary" : "text-muted-foreground"}
        />
      </div>
      <div className="space-y-1">
        <p className="font-display text-base font-semibold text-foreground">
          {isDragging
            ? "Drop it like it's hot 🎮"
            : "Drag & drop your video here"}
        </p>
        <p className="text-sm text-muted-foreground">
          or{" "}
          <span className="text-primary font-semibold underline underline-offset-2">
            browse files
          </span>
        </p>
        <p className="text-xs text-muted-foreground pt-1">
          MP4, WebM, MOV · Max {MAX_FILE_SIZE_MB} MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_VIDEO_TYPES.join(",")}
        className="sr-only"
        onChange={handleInputChange}
        data-ocid="upload.file.input"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      />
    </button>
  );
}

function UploadProgress({ progress }: { progress: number }) {
  return (
    <div
      data-ocid="upload.loading_state"
      className="space-y-3 rounded-xl border border-primary/30 bg-card p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Loader2 size={15} className="animate-spin text-primary" />
          Uploading to the cloud…
        </div>
        <span className="font-display text-primary font-bold text-sm">
          {progress}%
        </span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Please keep this tab open while uploading
      </p>
    </div>
  );
}

export function UploadPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync: uploadVideo } = useUploadVideo();

  // All state hooks must come before any conditional returns
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    description?: string;
    file?: string;
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handling ────────────────────────────────────────────────────────────
  const handleFileSelect = (file: File) => {
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      setFieldErrors((e) => ({
        ...e,
        file: "File type not supported. Use MP4, WebM, or MOV.",
      }));
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFieldErrors((e) => ({
        ...e,
        file: `File too large. Max size is ${MAX_FILE_SIZE_MB} MB.`,
      }));
      return;
    }
    setVideoFile(file);
    setFieldErrors((e) => ({ ...e, file: undefined }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!title.trim()) errors.title = "Title is required";
    if (!description.trim()) errors.description = "Description is required";
    if (!videoFile) errors.file = "Please select a video file";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !videoFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const bytes = new Uint8Array(await videoFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });

      await uploadVideo({
        title: title.trim(),
        description: description.trim(),
        blob,
      });

      toast.success("Video uploaded! 🎮", {
        description: "Your video is now live on the feed.",
        duration: 5000,
      });

      navigate({ to: "/feed" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error("Upload failed", { description: message });
    } finally {
      setIsUploading(false);
    }
  };

  const canSubmit =
    !isUploading &&
    !!videoFile &&
    title.trim().length > 0 &&
    description.trim().length > 0;

  // ── Auth guard (after all hooks) ─────────────────────────────────────────────
  if (isInitializing) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        data-ocid="upload.auth_required"
        className="flex flex-1 items-center justify-center min-h-[60vh] px-4"
      >
        <div className="text-center space-y-4 max-w-sm animate-fade-up">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-primary/10">
            <CloudUpload size={28} className="text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Sign in to upload
          </h2>
          <p className="text-sm text-muted-foreground">
            You need a Global Gamers account to share your bus simulator videos
            with the community.
          </p>
          <Button
            data-ocid="upload.login_button"
            className="w-full"
            onClick={() => navigate({ to: "/" })}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <section
      className="flex-1 bg-background py-10 px-4"
      data-ocid="upload.page"
    >
      <div className="mx-auto max-w-2xl w-full space-y-8">
        {/* Page header */}
        <div className="space-y-1 animate-fade-up">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
              <Film size={18} className="text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Upload Video
            </h1>
          </div>
          <p className="text-sm text-muted-foreground pl-11">
            Share your best bus simulator moments with the community
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6 animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          {/* Video file drop zone */}
          <div className="space-y-2">
            <Label className="font-display text-sm font-semibold">
              Video File <span className="text-destructive">*</span>
            </Label>
            <UploadDropzone
              file={videoFile}
              isDragging={isDragging}
              onFileSelect={handleFileSelect}
              onFileRemove={() => {
                setVideoFile(null);
                setUploadProgress(0);
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              inputRef={fileInputRef}
            />
            {fieldErrors.file && (
              <p
                className="text-xs text-destructive"
                data-ocid="upload.file.field_error"
              >
                {fieldErrors.file}
              </p>
            )}
          </div>

          {/* Upload progress */}
          {isUploading && <UploadProgress progress={uploadProgress} />}

          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="upload-title"
              className="font-display text-sm font-semibold"
            >
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="upload-title"
              data-ocid="upload.title.input"
              placeholder="e.g. London Route 73 — Night Run in the Rain"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) {
                  setFieldErrors((err) => ({ ...err, title: undefined }));
                }
              }}
              onBlur={() => {
                if (!title.trim())
                  setFieldErrors((e) => ({ ...e, title: "Title is required" }));
              }}
              disabled={isUploading}
              maxLength={120}
              aria-describedby={
                fieldErrors.title ? "upload-title-error" : undefined
              }
              className="bg-card border-input"
            />
            {fieldErrors.title && (
              <p
                id="upload-title-error"
                className="text-xs text-destructive"
                data-ocid="upload.title.field_error"
              >
                {fieldErrors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="upload-description"
              className="font-display text-sm font-semibold"
            >
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="upload-description"
              data-ocid="upload.description.textarea"
              placeholder="Describe your video — route, vehicle, game version, tips…"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (e.target.value.trim()) {
                  setFieldErrors((err) => ({ ...err, description: undefined }));
                }
              }}
              onBlur={() => {
                if (!description.trim())
                  setFieldErrors((e) => ({
                    ...e,
                    description: "Description is required",
                  }));
              }}
              disabled={isUploading}
              rows={4}
              maxLength={2000}
              aria-describedby={
                fieldErrors.description ? "upload-desc-error" : undefined
              }
              className="bg-card border-input resize-none"
            />
            <div className="flex items-start justify-between gap-2">
              {fieldErrors.description ? (
                <p
                  id="upload-desc-error"
                  className="text-xs text-destructive"
                  data-ocid="upload.description.field_error"
                >
                  {fieldErrors.description}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-muted-foreground ml-auto tabular-nums shrink-0">
                {description.length}/2000
              </span>
            </div>
          </div>

          {/* Submit row */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="upload.cancel_button"
              disabled={isUploading}
              onClick={() => navigate({ to: "/feed" })}
              className="flex-1 sm:flex-none sm:w-28"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="upload.submit_button"
              disabled={!canSubmit}
              className="flex-1 gap-2 font-display font-semibold glow-primary"
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading… {uploadProgress}%
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Publish Video
                </>
              )}
            </Button>
          </div>

          {/* Disabled hint */}
          {!canSubmit && !isUploading && (
            <p className="text-xs text-muted-foreground text-center">
              {!videoFile
                ? "Select a video file to continue"
                : !title.trim()
                  ? "Add a title to continue"
                  : "Add a description to continue"}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
