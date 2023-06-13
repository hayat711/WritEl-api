import {AccountStatus} from "../enums/status.enum";
import {SetMetadata} from "@nestjs/common";


export const ACCOUNT_KEY = 'account-status';
export const Verified = (accountStatus: AccountStatus) => SetMetadata(ACCOUNT_KEY, accountStatus)
