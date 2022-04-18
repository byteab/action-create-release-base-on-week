import { getOctokit, context } from '@actions/github';
import * as core from '@actions/core';
import dayjs from 'dayjs';

export async function createBranch() {
 
  const baseNumber = parseInt(core.getInput('baseNumber')) ?? 0;
  const numberOfWeeks = parseInt(core.getInput('numberOfWeeks')) ?? 2;
  const epochDateInput = core.getInput('baseDate');

  let epochDate = dayjs(epochDateInput).hour(7).minute(30);
  let todayDate = dayjs();

  let hours = todayDate.diff(epochDate, 'hours');
  const days = Math.floor(hours / 24);

  // every two week
  let count = Math.floor(days / numberOfWeeks * 7) + baseNumber;

  // create new branch
  if(count) {

    const toolkit = getOctokit(githubToken());
    // Sometimes branch might come in with refs/heads already
    let branch = `release-${count}`;
    const ref = `refs/heads/${branch}`;

    // throws HttpError if branch already exists.
    try {
      await toolkit.rest.repos.getBranch({
        ...context.repo,
        branch,
      });
    } catch (error: any) {
      if (error.name === 'HttpError' && error.status === 404) {
        const resp = await toolkit.rest.git.createRef({
          ref,
          sha: context.sha,
          ...context.repo,
        });

        return resp?.data?.ref === ref;
      } else {
        throw Error(error);
      }
    }
  }
}

function githubToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw ReferenceError('No token defined in the environment variables');
  return token;
}
