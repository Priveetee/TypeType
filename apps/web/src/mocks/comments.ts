import { faker } from "@faker-js/faker";
import type { Comment } from "../types/comment";

function generateComment(depth = 0): Comment {
  const replyCount = depth === 0 ? faker.number.int({ min: 0, max: 5 }) : 0;
  return {
    id: faker.string.uuid(),
    author: faker.internet.username(),
    avatar: `https://picsum.photos/seed/${faker.string.uuid()}/40/40`,
    text: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
    likes: faker.number.int({ min: 0, max: 50_000 }),
    postedAt: faker.date.recent({ days: 365 }),
    replies: Array.from({ length: replyCount }, () => generateComment(1)),
  };
}

export function generateComments(count: number): Comment[] {
  return Array.from({ length: count }, () => generateComment());
}
