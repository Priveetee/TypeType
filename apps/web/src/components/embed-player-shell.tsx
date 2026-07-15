import { usePlayerError } from "../hooks/use-player-error";
import { useSabrPlaybackConfig } from "../hooks/use-sabr-playback-config";
import { useSettings } from "../hooks/use-settings";
import { useVolumeSync } from "../hooks/use-volume-sync";
import { useWatchSponsorBlock } from "../hooks/use-watch-sponsorblock";
import { useWatchVttAssets } from "../hooks/use-watch-layout-assets";
import { getOriginalAudioLocale } from "../lib/audio-track";
import type { VideoStream } from "../types/stream";
import { toPublicWatchParam } from "../lib/watch-url";
import { EmbedPlayer } from "./embed-player";

type Props = {
  stream: VideoStream;
  sourceUrl: string;
  startTime: number;
  autoplay: boolean;
  isAuthed: boolean;
};

export function EmbedPlayerShell({ stream, sourceUrl, startTime, autoplay, isAuthed }: Props) {
  const { settings, settingsReady, update } = useSettings();
  const isLive = stream.streamType === "live_stream" || stream.streamType === "audio_live_stream";
  const player = usePlayerError(stream, isLive);
  const handleVolumeChange = useVolumeSync(update.mutate);

  const watchUrl = `/watch?v=${encodeURIComponent(toPublicWatchParam(sourceUrl))}`;

  const sponsor = useWatchSponsorBlock(stream, settings);
  const autoSkipSponsorBlock = isAuthed && settings.sponsorBlockMode !== "disabled";

  const { thumbnailVtt, chaptersVtt } = useWatchVttAssets(
    stream,
    sponsor.segments,
    settings.sponsorBlockShowChapters,
  );

  const sabrConfig = useSabrPlaybackConfig(
    stream,
    player.sabrEnabled,
    settings.defaultQuality,
    settings.defaultAudioLanguage,
    false,
  );

  const playerKey = [
    stream.id,
    player.retryKey,
    player.sabrEnabled ? "sabr" : "std",
    thumbnailVtt ? "thumbs" : "no-thumbs",
    chaptersVtt ? "chapters" : "no-chapters",
  ].join(":");

  return (
    <EmbedPlayer
      playerKey={playerKey}
      src={player.manifestSrc}
      sabrConfig={sabrConfig}
      audioOnly={false}
      title={stream.title}
      poster={stream.thumbnail}
      subtitles={stream.subtitles}
      startTime={startTime}
      autoplay={autoplay}
      settingsReady={settingsReady}
      streamType={isLive ? "live" : "on-demand"}
      chaptersVtt={chaptersVtt}
      thumbnailVtt={thumbnailVtt}
      originalAudioLocale={getOriginalAudioLocale(stream)}
      initialVolume={settings.volume}
      initialMuted={settings.muted}
      sponsorBlockSegments={sponsor.segments}
      autoSkipSponsorBlockSegments={isAuthed ? sponsor.autoSkipSegments : []}
      manualSkipSponsorBlockSegments={isAuthed ? sponsor.manualSkipSegments : sponsor.segments}
      autoSkipSponsorBlock={autoSkipSponsorBlock}
      muteSponsorBlockInsteadOfSkip={settings.sponsorBlockMuteInsteadOfSkip}
      showCurrentSponsorBlockSegment={settings.sponsorBlockShowCurrentSegment}
      captionStyles={settings.captionStyles}
      onCaptionStylesChange={(captionStyles) => update.mutate({ captionStyles })}
      onVolumeChange={handleVolumeChange}
      onError={player.handleError}
      watchUrl={watchUrl}
    />
  );
}
