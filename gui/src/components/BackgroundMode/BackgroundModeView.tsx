import { RocketLaunchIcon } from "@heroicons/react/24/outline";

interface BackgroundModeViewProps {
  isCreatingAgent?: boolean;
}

export function BackgroundModeView({
  isCreatingAgent = false,
}: BackgroundModeViewProps) {
  // Auth removed - Background agents require authentication, so hide this feature
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-8">
      <RocketLaunchIcon className="text-description-muted h-16 w-16" />
      <div className="max-w-md text-center">
        <h3 className="mb-2 text-lg font-semibold">Background Agents</h3>
        <p className="text-description mb-4 text-sm">
          Background agents are not available. Authentication has been disabled.
        </p>
      </div>
    </div>
  );
}
