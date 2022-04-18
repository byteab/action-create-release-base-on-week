import { Context } from '@actions/github/lib/context';
import { getOctokit, context } from '@actions/github';
import dayjs from 'dayjs';

// get current date
// compare it with a specific date
// calcualte the branch version
// check if branch already exists if no create it
export async function createBranch() {
 
  let epochDate = dayjs('2022-04-07').hour(7).minute(30);
  let todayDate = dayjs();

  let hours = todayDate.diff(epochDate, 'hours');
  const days = Math.floor(hours / 24);

  // every two week
  // 17 is the last release number
  let count = Math.floor(days / 14) + 17;

  // create new branch
  if(count) {

    const toolkit = getOctokit(githubToken());
    // Sometimes branch might come in with refs/heads already
    let branch = `branch-${count}`;
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
