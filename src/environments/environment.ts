// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  clientId: '3800bb56-45cb-4c0a-bd89-7394b0d57720',
  tenantId: '0ae51e19-07c8-4e4b-bb6d-648ee58410f4',
  clientScope:
    'offline_access openid profile api://3800bb56-45cb-4c0a-bd89-7394b0d57720/localAPI',
  tokenTime: 30,
  commonAPI: 'https://enrico-dev-si-webapp-appservice2-01.azurewebsites.net',
  apiConfig: 'https://enrico-dev-si-webapp-appservice3-01.azurewebsites.net',
  vendor_API: 'https://enrico-dev-si-webapp-appservice4-01.azurewebsites.net',
  API_URL: '../assets/data/',
  resource_API_Path:'https://localhost:7181',
  keyCloak: 'https://p3.authz.bosch.com/auth/realms/bgsw-enrico-digital-project',
  localStorageKeyWord:'oidc.user:https://p3.authz.bosch.com/auth/realms/bgsw-enrico-digital-project:enrico-digital-web-local',
  mailDeboardUrl:'https://dev.enrico-digital.bosch.tech',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
