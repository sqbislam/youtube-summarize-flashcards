/* eslint-disable camelcase */

export type ResponseDataType = "Metadata" | "Summary" | "Flashcards" | "";
export interface IGetMetadataResponse {
    author:string;
    length:number;
    title:string;
    total_size:number;
}

export interface IGetSummaryResponse {
  summary:string
}

export interface IConcept {
  [v: string]: string;
}
export interface IGetVideoFlashcards {
  key_concepts: IConcept[]
}



export interface ITokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface IWebToken {
  claim: string;
}

export interface INewTOTP {
  secret?: string;
  key: string;
  uri: string;
}

export interface IEnableTOTP {
  claim: string;
  uri: string;
  password?: string;
}

export interface ISendEmail {
  email: string;
  subject: string;
  content: string;
}

export interface IMsg {
  msg: string;
}

export interface INotification {
  uid?: string;
  title: string;
  content: string;
  icon?: "success" | "error" | "information";
  showProgress?: boolean;
}

export interface IErrorResponse {
  message: string;
  code: number;
}
