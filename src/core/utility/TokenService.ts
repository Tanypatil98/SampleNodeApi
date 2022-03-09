import * as jwt from "jsonwebtoken"; 

export default class TokenService {
    private options: any;
    private privateKey: string;

   constructor(_privateKey: string,_options: object){
      this.options = _options;
      this.privateKey = _privateKey;
    }

    sign(payload: object) {
        return jwt.sign(payload,  this.privateKey, this.options);    
    }
    verify(token: string) {
        return jwt.verify(token, this.privateKey, this.options);            
    }
    decode(token: string) {
        return jwt.decode(token, { complete: true });
    }
}


