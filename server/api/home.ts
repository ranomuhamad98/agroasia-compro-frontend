import { useApi } from "~/composables/useApi";

export default defineEventHandler(async (event) => {
  const { fetch } = useApi();

  const response = await fetch("/api/home");

  return response;
});
