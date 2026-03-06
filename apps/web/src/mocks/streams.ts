import { faker } from "@faker-js/faker";
import type { VideoStream } from "../types/stream";

function generateStream(date?: Date): VideoStream {
  const id = faker.string.uuid();
  return {
    id,
    title: faker.lorem.sentence({ min: 4, max: 10 }),
    thumbnail: `https://picsum.photos/seed/${id}/640/360`,
    channelName: faker.internet.username(),
    channelAvatar: `https://picsum.photos/seed/${faker.string.uuid()}/40/40`,
    views: faker.number.int({ min: 1000, max: 50000000 }),
    duration: faker.number.int({ min: 60, max: 7200 }),
    uploadedAt: date ?? faker.date.recent({ days: 365 }),
  };
}

export function generateStreams(count: number): VideoStream[] {
  return Array.from({ length: count }, () => generateStream());
}

export function generateHistoryStreams(count: number): VideoStream[] {
  const now = Date.now();
  const MS = { hour: 3_600_000, day: 86_400_000 };

  return Array.from({ length: count }, (_, i) => {
    let date: Date;
    if (i < 4) {
      date = new Date(now - faker.number.int({ min: 0, max: 20 }) * MS.hour);
    } else if (i < 10) {
      date = new Date(now - faker.number.int({ min: 1, max: 6 }) * MS.day);
    } else if (i < 18) {
      date = new Date(now - faker.number.int({ min: 7, max: 29 }) * MS.day);
    } else {
      date = new Date(now - faker.number.int({ min: 30, max: 365 }) * MS.day);
    }
    return generateStream(date);
  });
}
