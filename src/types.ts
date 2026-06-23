/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GitHubRepo {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  updated_at: string;
  language: string;
  has_license_doc?: boolean;
}

export interface RepoContentResponse {
  content: string;
  repo: string;
  retrievedAt: string;
}

export interface RepoState {
  repos: GitHubRepo[];
  selectedRepo: GitHubRepo | null;
  repoContent: string;
  isLoadingRepos: boolean;
  isLoadingContent: boolean;
  error: string | null;
}
