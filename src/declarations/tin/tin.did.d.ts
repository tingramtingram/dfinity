import type { Principal } from '@dfinity/principal';
export interface User { 'id' : Principal, 'userData' : UserData }
export interface UserData {
  'dateOfBirth' : [] | [string],
  'name' : [] | [string],
  'profilePhotos' : Array<[] | [string]>,
}
export interface UserUpdate { 'userData' : UserData }
export interface _SERVICE {
  'create' : (arg_0: UserUpdate) => Promise<string>,
  'delete' : () => Promise<boolean>,
  'read' : () => Promise<[] | [User]>,
  'update' : (arg_0: User) => Promise<boolean>,
}
