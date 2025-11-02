import { SecondaryButton } from "../..";
import { useCreditStatus } from "../../../hooks/useCredits";
import ContinueLogo from "../../svg/ContinueLogo";
import { useOnboardingCard } from "../hooks/useOnboardingCard";

export function OnboardingCardLanding({
  onSelectConfigure,
  isDialog,
}: {
  onSelectConfigure: () => void;
  isDialog?: boolean;
}) {
  const onboardingCard = useOnboardingCard();

  const { outOfStarterCredits } = useCreditStatus();

  return (
    <div className="xs:px-0 flex w-full max-w-full flex-col items-center justify-center px-4 text-center">
      <div className="xs:flex hidden">
        <ContinueLogo height={75} />
      </div>

      {outOfStarterCredits ? (
        <>
          <p className="xs:w-3/4 w-full text-sm">
            You've used all your starter credits! Configure your API keys to
            continue.
          </p>
          <SecondaryButton
            onClick={onSelectConfigure}
            className="mt-4 grid w-full grid-flow-col items-center gap-2"
          >
            Configure API keys
          </SecondaryButton>
        </>
      ) : (
        <>
          <p className="mb-5 mt-0 w-full text-sm">
            Configure your API keys to get started
          </p>
        </>
      )}

      <SecondaryButton onClick={onSelectConfigure} className="w-full">
        Or, configure your own models
      </SecondaryButton>
    </div>
  );
}
