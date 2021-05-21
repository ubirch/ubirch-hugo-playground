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
let params = {};

let schemaName = '';
let ubirchVerification: UbirchVerification | null = null;
let ubirchVerificationWidget: UbirchVerificationWidget | null = null;
let subscribe = null;

const showInfo = (info: string) => {
  document.getElementById('info-root').innerHTML = info;
};

const clearInfo = () => showInfo('');

const hideWidget = () => {
  document.getElementById('widget-root').style.display = 'none';
};

const showWidget = () => {
  document.getElementById('widget-root').style.display = 'block';
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
    subscribe = ubirchVerification.messenger.subscribe((msg: any) =>
      console.log(msg)
    );
};

document.addEventListener('DOMContentLoaded', () => {
  const radios = document.querySelectorAll('input[name="token"]');
  Array.from(radios).forEach((radio) => {
    radio.addEventListener('change', () => {
      hideWidget();
      clearInfo();
      const value = JSON.parse((radio as HTMLInputElement).value);
      initToken(value.token);
      schemaName = value['data_schema'];

      params = formUtils.getFormParamsFromUrl(window, ';');
      const parsedParams = handleSpecials(params, schemaName);
      const sortedParams = ubirchVerification.formatJSON(
        JSON.stringify(parsedParams)
      );

      (document.getElementById('json-input') as HTMLInputElement).value =
        sortedParams;
    });
  });
});

// verify JSON button click listener
document.getElementById('verify-json').addEventListener('click', function () {
  hideWidget();

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
    .then((validated) => {
      console.log('validated json:', validated);
      showInfo(`Validation OK`);
      showWidget();
      const stringified = JSON.stringify(validated);
      const hash = ubirchVerification.createHash(stringified);
      ubirchVerification.verifyHash(hash);
    })
    .catch((err) => {
      showInfo(`${err.name}:<br/>${err.errors?.join('<br/>')}`);
    });
});

function handleSpecials(json: any, DATA_SCHEMA: string) {
  switch (DATA_SCHEMA) {
    case 'DATA_SCHEMA_certification-vaccination-v3':
      let vacc = {
        da: json.da,
        vp: json.vp,
        pr: json.pr,
        br: json.br,
        vs: json.vs,
      } as any;
      if (json.bn) {
        vacc.bn = json.bn;
      }
      if (json.vd) {
        vacc.vd = json.vd;
      }
      if (json.ac) {
        vacc.ac = json.ac;
      }
      if (json.di) {
        vacc.di = json.di;
      }
      if (json.co) {
        vacc.co = json.co;
      }
      if (json.nx) {
        vacc.nx = json.nx;
      }
      let vaccV3Json = {
        fn: json.fn,
        id: json.id,
        is: json.is,
        ve: json.ve,
        vaccination: [vacc],
      } as any;
      if (json.gn) {
        vaccV3Json.gn = json.gn;
      }
      if (json.bd) {
        vaccV3Json.bd = json.bd;
      }
      if (json.pn) {
        vaccV3Json.pn = json.pn;
      }
      if (json.vf) {
        vaccV3Json.vf = json.vf;
      }
      if (json.vu) {
        vaccV3Json.vu = json.vu;
      }
      return vaccV3Json;
    default:
      return json;
  }
}
