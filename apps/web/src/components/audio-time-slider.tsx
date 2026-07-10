import { TimeSlider } from "../lib/vidstack";

export function AudioTimeSlider() {
  return (
    <TimeSlider.Root className="vds-time-slider vds-slider" aria-label="Seek">
      <TimeSlider.Track className="vds-slider-track" />
      <TimeSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
      <TimeSlider.Progress className="vds-slider-progress vds-slider-track" />
      <TimeSlider.Thumb className="vds-slider-thumb" />
      <TimeSlider.Preview className="vds-slider-preview">
        <TimeSlider.Value className="vds-slider-value" />
      </TimeSlider.Preview>
    </TimeSlider.Root>
  );
}
