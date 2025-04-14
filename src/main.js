const core = require('@actions/core')
const { run_call_test } = require('./sipfront-api')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const public_key = core.getInput('public_key', { required: true })
    const secret_key = core.getInput('secret_key', { required: true })
    const name = core.getInput('name', { required: true })
    const destination = core.getInput('destination', { required: false })
    const sf_environment = core.getInput('sf_environment', { required: false })

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    let deb_log = `Running test '${name}'`
    if (destination) {
      deb_log += ` to destination '${destination}'`
    }
    if (sf_environment) {
      deb_log += ` in environment '${sf_environment}'`
    }
    core.debug(deb_log)

    const res = await run_call_test(
      public_key,
      secret_key,
      name,
      destination,
      sf_environment
    )

    core.debug(res)

    core.setOutput('id', res.id)
    core.setOutput('agentpool_name', res.agentpool_name)
    core.setOutput('customer_id', res.customer_id)
    core.setOutput('customer_name', res.customer_name)
    core.setOutput('has_passed', res.has_passed)
    core.setOutput('is_failed', res.is_failed)
    core.setOutput('is_finished', res.is_finished)
    core.setOutput('project_id', res.project_id)
    core.setOutput('project_name', res.project_name)
    core.setOutput('result_description', res.result_description)
    core.setOutput('session_id', res.session_id)
    core.setOutput('session_status', res.session_status)
    core.setOutput('started_at', res.started_at)
    core.setOutput('status', res.status)
    core.setOutput('stopped_at', res.stopped_at)
    core.setOutput('tags', res.tags)
    core.setOutput('test_id', res.test_id)
    core.setOutput('test_name', res.test_name)
    core.setOutput('testcase_name', res.testcase_name)

    if (res.session_status === 'failed') {
      throw new Error(res.result_description)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
