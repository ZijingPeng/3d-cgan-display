import { IModel } from "../dto";

export interface IModelGroup {
  isSuccess: boolean;
  message: string;
  input: string; // the path of input image
  output?: IModel; // output model
  real?: IModel; // real model
}
