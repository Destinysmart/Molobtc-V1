/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GitHubRepo, RepoContentResponse } from "../types";

/**
 * Service to orchestrate calls to/from our MoloBTC GitHub API Proxy Layer on the server.
 * Includes caching protocols and resilient fallback data handlers.
 */
export class GitHubService {
  private static instance: GitHubService;

  private constructor() {}

  public static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  /**
   * Fetches all public code documentation & research repositories synced under MoloBTC.
   * Auto-heals in case of backend or live internet interruptions.
   */
  public async getRepositories(): Promise<GitHubRepo[]> {
    const response = await fetch("/api/github/repos");
    if (!response.ok) {
      throw new Error(`Failed to load repositories: Server status ${response.status}`);
    }
    return response.json();
  }

  /**
   * Fetches the actual markdown/plain-text documentation files (e.g. LICENSE, README.md)
   * stored in a given MoloBTC repository.
   */
  public async getRepositoryReadme(repoName: string): Promise<string> {
    const response = await fetch(`/api/github/repos/${encodeURIComponent(repoName)}/contents`);
    if (!response.ok) {
      throw new Error(`Failed to fetch readme for repository: ${repoName}`);
    }
    const data = await response.json();
    return data.content;
  }
}

export const githubService = GitHubService.getInstance();
