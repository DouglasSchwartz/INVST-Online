interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
}

export function ProgressBar({ progress, showLabel = false }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-slate-500 mt-2 text-center">
          {progress}% complete
        </p>
      )}
    </div>
  );
}











