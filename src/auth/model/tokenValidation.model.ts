import { TokenPayloadModel } from "./tokenPayload.model";

export interface TokenValidationModel {
    valid: boolean;
    payload?: TokenPayloadModel;
}