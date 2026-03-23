import { PageSpinner } from "./page-spinner";

type Props = {
  sectionClass: string;
};

export function ShortsShellLoader({ sectionClass }: Props) {
  return (
    <section className={sectionClass}>
      <div className="relative flex h-full items-center justify-center">
        <div className="shorts-shell relative mx-auto aspect-[9/16] h-full max-h-[calc(100svh-5.5rem)] w-auto max-w-full overflow-hidden rounded-xl bg-black sm:rounded-2xl md:h-[calc(100svh-6rem)] md:max-h-none">
          <PageSpinner fullScreen={false} />
        </div>
      </div>
    </section>
  );
}
