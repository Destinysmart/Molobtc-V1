/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { GitHubRepo, RepoState } from "../types";
import { githubService } from "../services/githubService";

export function useGithubState() {
  const [repoState, setRepoState] = useState<RepoState>({
    repos: [],
    selectedRepo: null,
    repoContent: "",
    isLoadingRepos: false,
    isLoadingContent: false,
    error: null,
  });

  const loadRepositories = useCallback(async () => {
    console.log("[useGithubState] loadRepositories() initiated. Setting isLoadingRepos to true.");
    setRepoState((prev) => ({ ...prev, isLoadingRepos: true, error: null }));
    try {
      const liveRepos = await githubService.getRepositories();
      console.log("[useGithubState] loadRepositories() succeeded with repos list:", liveRepos);
      setRepoState((prev) => ({
        ...prev,
        repos: liveRepos,
        isLoadingRepos: false,
      }));
    } catch (err: any) {
      console.error("[useGithubState] loadRepositories() failed with error:", err);
      setRepoState((prev) => ({
        ...prev,
        isLoadingRepos: false,
        error: err.message || "Failed to retrieve moloBTC repositories from network.",
      }));
    }
  }, []);

  const selectRepository = useCallback(async (repo: GitHubRepo | null) => {
    console.log("[useGithubState] selectRepository() called for repo:", repo);
    if (!repo) {
      setRepoState((prev) => ({
        ...prev,
        selectedRepo: null,
        repoContent: "",
        isLoadingContent: false,
      }));
      return;
    }

    setRepoState((prev) => ({
      ...prev,
      selectedRepo: repo,
      repoContent: "",
      isLoadingContent: true,
      error: null,
    }));

    try {
      const readmeText = await githubService.getRepositoryReadme(repo.name);
      console.log(`[useGithubState] selectRepository() successfully fetched content of length ${readmeText.length} for ${repo.name}`);
      setRepoState((prev) => ({
        ...prev,
        repoContent: readmeText,
        isLoadingContent: false,
      }));
    } catch (err: any) {
      console.error(`[useGithubState] selectRepository() failed for ${repo.name}:`, err);
      setRepoState((prev) => ({
        ...prev,
        isLoadingContent: false,
        error: `Could not retrieve file content stream from ${repo.name}.`,
      }));
    }
  }, []);

  // On mount, pull all MoloBTC repositories dynamically
  useEffect(() => {
    loadRepositories();
  }, [loadRepositories]);

  return {
    repos: repoState.repos,
    selectedRepo: repoState.selectedRepo,
    repoContent: repoState.repoContent,
    isLoadingRepos: repoState.isLoadingRepos,
    isLoadingContent: repoState.isLoadingContent,
    error: repoState.error,
    refreshRepos: loadRepositories,
    selectRepository,
  };
}
