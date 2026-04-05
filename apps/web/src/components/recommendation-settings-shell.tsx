import {
  useRecommendationOnboardingActions,
  useRecommendationOnboardingState,
  useRecommendationOnboardingTopics,
} from "../hooks/use-recommendation-onboarding";
import { OnboardingError } from "./onboarding-error";
import { OnboardingLoading } from "./onboarding-loading";
import { OnboardingWorkflow } from "./onboarding-workflow";

type Props = {
  mode?: "onboarding" | "settings";
};

export function RecommendationSettingsShell({ mode = "onboarding" }: Props) {
  const stateQuery = useRecommendationOnboardingState(true);
  const topicsQuery = useRecommendationOnboardingTopics(true);
  const actions = useRecommendationOnboardingActions();

  if (stateQuery.isPending || topicsQuery.isPending) return <OnboardingLoading />;

  if (stateQuery.isError || topicsQuery.isError) {
    return (
      <OnboardingError
        onRetry={() => {
          void stateQuery.refetch();
          void topicsQuery.refetch();
        }}
      />
    );
  }

  return (
    <OnboardingWorkflow
      state={stateQuery.data}
      topics={topicsQuery.data}
      actions={actions}
      mode={mode}
    />
  );
}
