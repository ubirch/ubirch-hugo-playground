// @ts-ignore
import * as yup from './node_modules/yup';

const schemas = {
  'DATA_SCHEMA_certification-corona-test': yup.object().shape({
    b: yup.string().required(),
    d: yup.string().required(),
    f: yup.string().required(),
    g: yup.string().required(),
    i: yup.string().required(),
    p: yup.string().required(),
    r: yup.string().required(),
    s: yup.string().required(),
  }),
};

const validate = (schemaName: string, json: any) => {
  const schema = schemas[schemaName];
  if (!schema)
    return Promise.reject({
      name: 'ValidationError',
      errors: ['Schema not found'],
    });
  return schemas[schemaName].validate(json);
};

export default validate;
