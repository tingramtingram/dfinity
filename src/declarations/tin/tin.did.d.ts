import type { Principal } from '@dfinity/principal';
export type ChunkData = string;
export type ChunkId = bigint;
export type ConversationId = string;
export type ConversationObject = Array<Message>;
export interface Message {
  'messageId' : [] | [string],
  'userId' : [] | [string],
  'text' : [] | [string],
  'userPrincipalText' : [] | [string],
}
export interface User { 'id' : Principal, 'userData' : UserData }
export interface UserData {
  'about' : [] | [string],
  'profileVideoIds' : Array<bigint>,
  'interests' : Array<[] | [string]>,
  'dateOfBirth' : [] | [string],
  'name' : [] | [string],
  'profileId' : [] | [string],
  'profilePhotos' : Array<[] | [string]>,
  'gender' : [] | [string],
  'conversations' : Array<[] | [string]>,
  'mainThings' : Array<[] | [string]>,
}
export interface UserUpdate { 'userData' : UserData }
export interface _SERVICE {
  'allConversations' : () => Promise<
      Array<[ConversationId, ConversationObject]>
    >,
  'allUsers' : () => Promise<Array<[Principal, User]>>,
  'chunksSize' : () => Promise<bigint>,
  'create' : (arg_0: UserUpdate) => Promise<string>,
  'delete' : () => Promise<boolean>,
  'deleteConversation' : (arg_0: ConversationId) => Promise<boolean>,
  'getChunk' : (arg_0: ChunkId) => Promise<[] | [ChunkData]>,
  'getConversation' : (arg_0: ConversationId) => Promise<
      [] | [ConversationObject]
    >,
  'getUser' : (arg_0: string) => Promise<[] | [User]>,
  'read' : () => Promise<[] | [User]>,
  'setChunk' : (arg_0: ChunkId, arg_1: ChunkData) => Promise<string>,
  'setConversation' : (
      arg_0: ConversationId,
      arg_1: ConversationObject,
    ) => Promise<string>,
  'update' : (arg_0: User) => Promise<boolean>,
  'updateUserData' : (arg_0: string, arg_1: UserUpdate) => Promise<string>,
  'whoami' : () => Promise<Principal>,
}
