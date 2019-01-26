import env from 'env';

const configKeys = [
  'default.key',
  'static.key',
  'dynamic.key',
  'overrideCheck',
];

document.querySelector('#root').innerHTML = `
  <code>
    ${
      configKeys
        .map(key => `${key}: ${env.get(key)}`)
        .join('<br>')
    }
  <code>
`;
