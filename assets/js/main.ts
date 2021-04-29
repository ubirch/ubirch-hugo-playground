import {
  UbirchVerification,
  UbirchFormUtils,
  models,
  messenger$
  // @ts-ignore
} from './node_modules/ubirch-verification-js/src';

const { EHashAlgorithms, EStages } = models;

messenger$.subscribe((q:any) => console.log(q));

const formUtils = new UbirchFormUtils({
  formIds: ['created', 'name', 'workshop'],
});
const params = formUtils.getFormParamsFromUrl(window, ';');
formUtils.setDataIntoForm(params, document);

(document.getElementById(
  'json-input'
) as HTMLInputElement).value = JSON.stringify(params);

let ubirchVerification: UbirchVerification | null = null;

// verify JSON button click listener
document.getElementById('set-token').addEventListener('click', function () {
  const token = (document.getElementById('token-input') as HTMLInputElement)
    .value;
  if (!token) {
    // handle the error yourself and inform user about the missing token
    const msg = 'Token input is empty!\n';
    window.alert(msg);
    return;
  }

  // create UbirchVerification instance
  ubirchVerification = new UbirchVerification({
    algorithm: EHashAlgorithms.SHA256,
    stage: EStages.dev,
    accessToken: token,
  });
});
// verify JSON button click listener
document.getElementById('verify-json').addEventListener('click', function () {
  if (!ubirchVerification) {
    // handle the error yourself and inform user about the missing token
    const msg =
      'Verification Widget not initialized propertly - did you set a token?\n';
    window.alert(msg);
    return;
  }

  const json = (document.getElementById('json-input') as HTMLInputElement)
    .value;

  if (!json) {
    // handle the error yourself and inform user about the missing JSON
    const msg = 'Please add a JSON to be verified\n';
    window.alert(msg);
    return;
  }

  const hash = ubirchVerification.createHash(json);
  ubirchVerification
    .verifyHash(hash)
    .then((response) => {
      const msg =
        'Verification success!!\n\nVerificationResult:\n' +
        JSON.stringify(response.upp) +
        '\n' +
        response.upp.state +
        '\n' +
        response.verificationState;
      (document.getElementById('output') as HTMLInputElement).value = msg;
    })
    .catch((errResponse) => {
      const msg =
        'Verification failed!!\n\nErrorResponse:\n' +
        errResponse.verificationState +
        ', ' +
        errResponse.failReason;
      (document.getElementById('output') as HTMLInputElement).value = msg;
    });
});
