import { useEffect, useRef, useState } from "react";
import type {
  RecommendationOnboardingStateResponse,
  RecommendationOnboardingTopicsResponse,
} from "../types/api";

type Params = {
  state: RecommendationOnboardingStateResponse | undefined;
  topics: RecommendationOnboardingTopicsResponse | undefined;
};

export function useOnboardingWorkflowState({ state, topics }: Params) {
  const [step, setStep] = useState(0);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [channelQuery, setChannelQuery] = useState("");
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!topics?.groups[0] || activeGroupId) return;
    setActiveGroupId(topics.groups[0].id);
  }, [topics, activeGroupId]);

  useEffect(() => {
    if (!state || hydratedRef.current) return;
    hydratedRef.current = true;
    setSelectedTopics(state.selectedTopics);
    setSelectedChannels(state.selectedChannels);
  }, [state]);

  function toggleTopic(topic: string) {
    const key = topic.toLowerCase();
    setSelectedTopics((current) => {
      if (current.some((entry) => entry.toLowerCase() === key)) {
        return current.filter((entry) => entry.toLowerCase() !== key);
      }
      return [...current, topic];
    });
  }

  function addChannelUrl(channelUrl: string) {
    setSelectedChannels((current) => {
      const key = channelUrl.toLowerCase();
      if (current.some((channel) => channel.toLowerCase() === key)) return current;
      return [...current, channelUrl];
    });
  }

  function toggleSuggestedChannel(channelUrl: string) {
    setSelectedChannels((current) => {
      const key = channelUrl.toLowerCase();
      if (!current.some((channel) => channel.toLowerCase() === key)) {
        return [...current, channelUrl];
      }
      return current.filter((channel) => channel.toLowerCase() !== key);
    });
  }

  function removeChannel(channel: string) {
    setSelectedChannels((current) => current.filter((item) => item !== channel));
  }

  return {
    step,
    selectedTopics,
    selectedChannels,
    channelQuery,
    activeGroupId,
    error,
    toast,
    setStep,
    setActiveGroupId,
    setChannelQuery,
    setError,
    setToast,
    toggleTopic,
    addChannelUrl,
    toggleSuggestedChannel,
    removeChannel,
  };
}
