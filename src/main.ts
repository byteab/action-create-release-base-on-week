import * as core from '@actions/core';
import { createBranch } from './create-branch';

async function run() {
  try {
    const isCreated = await createBranch();
    core.setOutput('created', Boolean(isCreated));
  } catch (error: any) {
    core.setFailed(error.message);
  }
}
run();
