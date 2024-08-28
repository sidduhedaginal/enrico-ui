import { userProfileDetails } from '../user-profile/user-profile';


export class StorageQuery {
    constructor() { }
  
    private static userProfileKey: string = `user_profile_details`;
    private static userDefaultEmail: string = `user_default_email`;
    private static variantSessionStorage: string = `variant_session_storage`;
    private static newVariantIndex: string = `new_variant_index`;
    private static reportCode: string = `report_code`;
    private static pageIndex: string = `page_index`;
    private static currentDomainId: string = 'currentDomainId'; 
  
    public static getUserProfile(): userProfileDetails | string {
  
      const userDetails = sessionStorage.getItem(this.userProfileKey);
      if(userDetails === null || userDetails === undefined) return '';
      return JSON.parse(userDetails);
    }
  
    public static setUserProfile(userDetails : string){
        if (typeof(Storage) !== "undefined") {
            sessionStorage.setItem(this.userProfileKey, userDetails);
          }
    }
  
    public static setAccessToken(token: string) {
      localStorage.setItem(`${this.userProfileKey}`, JSON.stringify(token));
    }
  
    public static deleteToken() {
      localStorage.removeItem(`${this.userProfileKey}`);
    }
  
    public static getLoginDefaultEmail(): string {
      const storageEmail = localStorage.getItem(`${this.userDefaultEmail}`);
      if (storageEmail === null || storageEmail === undefined) return '';
      return storageEmail;
    }
  
    public static setLoginDefaultEmail(emailString: string) {
      localStorage.setItem(`${this.userDefaultEmail}`, emailString);
    }
  
    public static setCurrentDomainId(currentDomainId: string){
      sessionStorage.setItem(`${this.currentDomainId}`, currentDomainId);
    }
  
    public static getCurrentDomainId(){
      let currentDomainId = sessionStorage.getItem(`ClientRoot}.${this.currentDomainId}`);
      if (currentDomainId === null || currentDomainId === undefined)
        return '';
      else{
        return currentDomainId;
      }
  
    }
  }
  
  