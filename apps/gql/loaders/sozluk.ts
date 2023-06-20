import DataLoader from "dataloader";

import { allTerms } from "@kampus/sozluk-content";

import { type Clients } from "~/clients/types";
import { type SozlukTerm } from "~/schema/types.generated";
import { LoaderKey } from "./utils/loader-key";

export const createSozlukLoaders = (clients: Clients) => {
  return {
    terms: createTermsLoader(clients),
  };
};

export type SozlukTermsLoader = DataLoader<SozlukTermLoaderKey, SozlukTerm>;
export class SozlukTermLoaderKey extends LoaderKey<"id", string> {}

function createTermsLoader(_: Clients) {
  // eslint-disable-next-line @typescript-eslint/require-await
  return new DataLoader<SozlukTermLoaderKey, SozlukTerm>(async (keys) => {
    console.log({ keys });

    return keys
      .map((key) => {
        const term = allTerms.find((term) => term.id === key.value);
        if (!term) {
          return null;
        }

        return {
          id: term.id,
          title: term.title,
          tags: term.tags,
          body: {
            raw: term.body.raw,
            code: term.body.code,
            html: term.mdxHtml,
          },
        };
      })
      .filter(Boolean) as SozlukTerm[];
  });
}