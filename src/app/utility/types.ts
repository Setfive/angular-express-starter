export enum NotifyOnClick {
  never = 'never',
  first = 'first',
  every = 'every',
}

export interface ICampaign {
  name: string;
  isActive: boolean;
  notifyOnClick: NotifyOnClick;
  urlPrefix: string;
  directMailEnabled: boolean;
  user: IUser;
  directMailTemplate: string | null;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: number;
  createAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  uniqueId: string;
  isEmailConfirmed: boolean;
  password: string;
  lastLogin: Date | null;
  loginToken: string | null;
  loginTokenExpires: Date | null;
  isPaid: boolean;
}

export interface ICampaignTarget {
  identifier: string;
  redirectUrl: string;
  attributes: Record<string, string>;
  urlId: string;
  campaign: ICampaign;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type RowError = {
  row: number;
  error: string;
  data: object;
};

export interface ICampaignTargetRequest {
  id: string;
  url: string;
  attributes: Record<string, string>;
}
