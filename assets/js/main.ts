import {
  UbirchVerification,
  UbirchVerificationWidget,
  UbirchFormUtils,
  models,
  // @ts-ignore
} from './node_modules/@ubirch/ubirch-verification-js/dist';
import validate from './validation';

const { EHashAlgorithms, EStages } = models;

const formUtils = new UbirchFormUtils();

const params = formUtils.getFormParamsFromUrl(window, ';');
formUtils.setDataIntoForm(params, document);

(document.getElementById('json-input') as HTMLInputElement).value =
  JSON.stringify(params);

  let schemaName = '';
let ubirchVerification: UbirchVerification | null = null;
let ubirchVerificationWidget: UbirchVerificationWidget | null = null;
let subscribe = null;

const showInfo = (info: string) => {
  document.getElementById('info-root').innerHTML = info;
};

const clearInfo = () => showInfo('');

const clearWidget = () => {
  document.getElementById('widget-root').innerHTML = '';
};

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
      clearWidget();
      clearInfo();
      const value = JSON.parse((radio as HTMLInputElement).value);
      initToken(value.token);
      schemaName = value['data_schema'];
    });
  });
});

// verify JSON button click listener
document.getElementById('verify-json').addEventListener('click', function () {
  if (!ubirchVerification) {
    // handle the error yourself and inform user about the missing token
    const msg =
      'Verification Widget not initialized propertly - did you set a token?\n';
    showInfo(msg);
    return;
  }

  const json = (document.getElementById('json-input') as HTMLInputElement)
    .value;

  if (!json) {
    // handle the error yourself and inform user about the missing JSON
    const msg = 'Please add a JSON to be verified\n';
    showInfo(msg);
    return;
  }

  validate(schemaName, json)
    .then(() => {
      const hash = ubirchVerification.createHash(json);
      ubirchVerification.verifyHash(hash);
    })
    .catch((err) => {
      showInfo(`${err.name}: ${err.errors?.join(', ')}`);
    });
});
