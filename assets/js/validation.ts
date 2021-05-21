// @ts-ignore
import * as yup from './node_modules/yup';

const schemas = {
  'DATA_SCHEMA_certification-corona-test': yup.object().shape({
    b: yup.string().required(),
    d: yup.string().required().matches(/^[0-9]*$/, 'd must be all numbers'),
    f: yup.string().required(),
    g: yup.string().required(),
    i: yup.string().required(),
    p: yup.string().required(),
    r: yup.string().required(),
    s: yup.string().required(),
    t: yup.string().required(),
  }),
  'DATA_SCHEMA_certification-bvdw-certificate': yup.object().shape({
    co: yup.string().required(),
    do: yup.string().required(),
    vf: yup.string().required(),
    vu: yup.string().required(),
  }),
  'DATA_SCHEMA_certification-vaccination': yup.object().shape({}),
  'DATA_SCHEMA_certification-vaccination-v3': yup.object().shape({
    fn: yup.string().required(),
    id: yup.string().required(),
    is: yup.string().required(),
    ve: yup.string().required(),
    vaccination: yup
      .array()
      .length(1)
      .of(
        yup.object().shape({
          da: yup.string().required(),
          vp: yup.string().required(),
          pr: yup.string().required(),
          br: yup.string().required(),
          vs: yup.string().required(),
          bn: yup.string(),
          vd: yup.string(),
          ac: yup.string(),
          di: yup.string(),
          co: yup.string(),
          nx: yup.string(),
        })
      ),
    gn: yup.string(),
    bd: yup.string(),
    pn: yup.string(),
    vf: yup.string(),
    vu: yup.string(),
  }),
};

const validate = (schemaName: string, json: any) => {
  const schema = schemas[schemaName];
  if (!schema)
    return Promise.reject({
      name: 'ValidationError',
      errors: ['Schema not found'],
    });
  return schemas[schemaName].validate(json, { stripUnknown: true });
};

export default validate;
