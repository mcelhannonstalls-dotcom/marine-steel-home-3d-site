export function getSiteBasePath(env: NodeJS.ProcessEnv = process.env) {
  if (env.GITHUB_PAGES !== "true") return "";
  const repositoryName = env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
  return repositoryName ? `/${repositoryName}` : "";
}

export function withSiteBasePath(path: string, env: NodeJS.ProcessEnv = process.env) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteBasePath(env)}${normalizedPath}`;
}
