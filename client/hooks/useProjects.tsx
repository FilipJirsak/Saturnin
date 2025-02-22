import {useMatches} from "@remix-run/react";
import {LoaderData} from "~/types";

export function useProjects() {
  const matches = useMatches();
  const rootRoute = matches.find((match) => match.id === "root");
  const data = rootRoute?.data as LoaderData | undefined;
  return data?.projects || [];
}
