import {
  ICampaign,
  ICampaignTarget,
  ICampaignTargetRequest,
  NotifyOnClick,
} from '../utility/types';

// Request Types
export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export type IRegisterResponse = IError<IRegisterRequest> | IRegisterSuccess;

export interface ILoginResponse {
  token: string;
}

export interface IRegisterSuccess {
  token: string;
}

export type ICreateCampaignSuccess = ICampaign;

export interface IError<T> {
  error: boolean;
  errors: ValidationError<T>[];
  msg: string;
}

interface ValidationError<T> {
  target: T;
  property: string;
  value: any;
  constraints?: {
    [type: string]: string;
  };
  children?: ValidationError<T>[];
}
