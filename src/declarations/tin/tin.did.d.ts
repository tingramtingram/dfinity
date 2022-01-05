import type { Principal } from '@dfinity/principal';
export type ChunkData = string;
export type ChunkId = bigint;
export interface User { 'id' : Principal, 'userData' : UserData }
export interface UserData {
  'profileVideoIds' : Array<bigint>,
  'dateOfBirth' : [] | [string],
  'name' : [] | [string],
  'profilePhotos' : Array<[] | [string]>,
}
export interface UserUpdate { 'userData' : UserData }
export interface _SERVICE {
  'create' : (arg_0: UserUpdate) => Promise<string>,
  'delete' : () => Promise<boolean>,
  'getChunk' : (arg_0: ChunkId) => Promise<[] | [ChunkData]>,
  'read' : () => Promise<[] | [User]>,
  'setChunk' : (arg_0: ChunkId, arg_1: ChunkData) => Promise<string>,
  'update' : (arg_0: User) => Promise<boolean>,
  'whoami' : () => Promise<Principal>,
}
