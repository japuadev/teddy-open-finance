import { IResponse } from './interfaces/response.interface';

export class SuccessResponse implements IResponse {
  message?: string;
  statusCode?: number;

  constructor(message: string) {
    this.statusCode = 200;
    this.message = message;
  }
}
export class NotFoundResponse implements IResponse {
  message?: string;
  statusCode?: number;

  constructor(message: string) {
    this.statusCode = 400;
    this.message = message;
  }
}
export class CreatedResponse implements IResponse {
  message?: string;
  statusCode?: number;

  constructor(message: string) {
    this.statusCode = 201;
    this.message = message;
  }
}
export class UpdatedResponse implements IResponse {
  message?: string;
  statusCode?: number;

  constructor(message: string) {
    this.statusCode = 200;
    this.message = message;
  }
}

export class DeletedResponse implements IResponse {
  message?: string;
  statusCode?: number;

  constructor(message: string) {
    this.statusCode = 204;
    this.message = message;
  }
}
