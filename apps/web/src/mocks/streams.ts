import { faker } from "@faker-js/faker";
import type { VideoStream } from "../types/stream";

function generateStream(): VideoStream {
  const id = faker.string.uuid();
  return {
    id,
    title: faker.lorem.sentence({ min: 4, max: 10 }),
    thumbnail: `https://picsum.photos/seed/${id}/640/360`,
    channelName: faker.internet.username(),
    channelAvatar: `https://picsum.photos/seed/${faker.string.uuid()}/40/40`,
    views: faker.number.int({ min: 1000, max: 50000000 }),
    duration: faker.number.int({ min: 60, max: 7200 }),
    uploadedAt: faker.date.recent({ days: 365 }),
  };
}

export function generateStreams(count: number): VideoStream[] {
  return Array.from({ length: count }, generateStream);
}
