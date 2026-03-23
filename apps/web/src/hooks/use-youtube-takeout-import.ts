import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  commitYoutubeTakeoutImport,
  createYoutubeTakeoutImport,
  fetchYoutubeTakeoutImportJob,
  fetchYoutubeTakeoutPreview,
  fetchYoutubeTakeoutReport,
  type YoutubeTakeoutImportJob,
  type YoutubeTakeoutPreview,
  type YoutubeTakeoutReport,
} from "../lib/api-youtube-import";

const INVALIDATE_KEYS = [
  ["subscriptions"],
  ["subscription-feed"],
  ["playlists"],
  ["history"],
  ["history-all"],
] as const;

type FlowState = {
  jobId: string | null;
  preview: YoutubeTakeoutPreview | null;
  report: YoutubeTakeoutReport | null;
};

export function useYoutubeTakeoutImport() {
  const qc = useQueryClient();
  const flow = useQuery({
    queryKey: ["youtube-import-flow"],
    queryFn: async () => ({ jobId: null, preview: null, report: null }) satisfies FlowState,
    staleTime: Infinity,
  });

  function setFlow(patch: Partial<FlowState>) {
    const current = qc.getQueryData<FlowState>(["youtube-import-flow"]) ?? {
      jobId: null,
      preview: null,
      report: null,
    };
    qc.setQueryData(["youtube-import-flow"], { ...current, ...patch });
  }

  const create = useMutation({
    mutationFn: (file: File) => createYoutubeTakeoutImport(file),
    onSuccess: (job) => setFlow({ jobId: job.jobId, preview: null, report: null }),
  });

  const status = useQuery<YoutubeTakeoutImportJob>({
    queryKey: ["youtube-import-status", flow.data?.jobId],
    queryFn: () => {
      const id = flow.data?.jobId;
      if (!id) throw new Error("Missing YouTube import job id");
      return fetchYoutubeTakeoutImportJob(id);
    },
    enabled: Boolean(flow.data?.jobId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 2500;
      return data.status === "pending" || data.status === "running" ? 2500 : false;
    },
  });

  const preview = useMutation({
    mutationFn: (jobId: string) => fetchYoutubeTakeoutPreview(jobId),
    onSuccess: (data) => setFlow({ preview: data }),
  });

  const commit = useMutation({ mutationFn: (jobId: string) => commitYoutubeTakeoutImport(jobId) });

  const report = useMutation({
    mutationFn: (jobId: string) => fetchYoutubeTakeoutReport(jobId),
    onSuccess: async (data) => {
      setFlow({ report: data });
      await Promise.all(
        INVALIDATE_KEYS.map((queryKey) => qc.invalidateQueries({ queryKey: [...queryKey] })),
      );
    },
  });

  return {
    flow: flow.data ?? { jobId: null, preview: null, report: null },
    create,
    status,
    preview,
    commit,
    report,
    clear: () => setFlow({ jobId: null, preview: null, report: null }),
  };
}
