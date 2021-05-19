import {
  UbirchVerification,
  UbirchVerificationWidget,
  UbirchFormUtils,
  models,
  // @ts-ignore
} from './node_modules/@ubirch/ubirch-verification-js/dist';

const { EHashAlgorithms, EStages } = models;

const formUtils = new UbirchFormUtils();

const params = formUtils.getFormParamsFromUrl(window, ';');
formUtils.setDataIntoForm(params, document);

(document.getElementById('json-input') as HTMLInputElement).value =
  JSON.stringify(params);

let ubirchVerification: UbirchVerification | null = null;
let ubirchVerificationWidget: UbirchVerificationWidget | null = null;
let subscribe = null;

const initToken = (accessToken: string) => {
  // create UbirchVerification instance
  ubirchVerification = new UbirchVerification({
    algorithm: EHashAlgorithms.SHA256,
    stage: EStages.dev,
    accessToken,
  });

  ubirchVerificationWidget = new UbirchVerificationWidget({
    hostSelector: '#widget-root',
    messenger: ubirchVerification.messenger,
  });

  if (!subscribe)
    subscribe = ubirchVerification.messenger.subscribe((q: any) =>
      console.log(q)
    );
};

document.addEventListener('DOMContentLoaded', () => {
  const radios = document.querySelectorAll('input[name="token"]');
  Array.from(radios).forEach((radio) => {
    radio.addEventListener('change', () => {
      console.log((radio as HTMLInputElement).value);
      initToken((radio as HTMLInputElement).value);
    });
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
  ubirchVerification.verifyHash(hash);
});
