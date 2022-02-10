export const idlFactory = ({ IDL }) => {
  const ConversationId = IDL.Text;
  const Message = IDL.Record({
    'messageId' : IDL.Opt(IDL.Text),
    'userId' : IDL.Opt(IDL.Text),
    'text' : IDL.Opt(IDL.Text),
    'userPrincipalText' : IDL.Opt(IDL.Text),
  });
  const ConversationObject = IDL.Vec(Message);
  const UserData = IDL.Record({
    'about' : IDL.Opt(IDL.Text),
    'profileVideoIds' : IDL.Vec(IDL.Nat),
    'interests' : IDL.Vec(IDL.Opt(IDL.Text)),
    'dateOfBirth' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'profileId' : IDL.Opt(IDL.Text),
    'profilePhotos' : IDL.Vec(IDL.Opt(IDL.Text)),
    'gender' : IDL.Opt(IDL.Text),
    'conversations' : IDL.Vec(IDL.Opt(IDL.Text)),
    'mainThings' : IDL.Vec(IDL.Opt(IDL.Text)),
  });
  const User = IDL.Record({ 'id' : IDL.Principal, 'userData' : UserData });
  const UserUpdate = IDL.Record({ 'userData' : UserData });
  const ChunkId = IDL.Nat;
  const ChunkData = IDL.Text;
  return IDL.Service({
    'allConversations' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(ConversationId, ConversationObject))],
        ['query'],
      ),
    'allUsers' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, User))],
        ['query'],
      ),
    'chunksSize' : IDL.Func([], [IDL.Nat], ['query']),
    'create' : IDL.Func([UserUpdate], [IDL.Text], []),
    'delete' : IDL.Func([], [IDL.Bool], []),
    'deleteConversation' : IDL.Func([ConversationId], [IDL.Bool], []),
    'getChunk' : IDL.Func([ChunkId], [IDL.Opt(ChunkData)], ['query']),
    'getConversation' : IDL.Func(
        [ConversationId],
        [IDL.Opt(ConversationObject)],
        ['query'],
      ),
    'getUser' : IDL.Func([IDL.Text], [IDL.Opt(User)], ['query']),
    'read' : IDL.Func([], [IDL.Opt(User)], ['query']),
    'setChunk' : IDL.Func([ChunkId, ChunkData], [IDL.Text], []),
    'setConversation' : IDL.Func(
        [ConversationId, ConversationObject],
        [IDL.Text],
        [],
      ),
    'update' : IDL.Func([User], [IDL.Bool], []),
    'updateUserData' : IDL.Func([IDL.Text, UserUpdate], [IDL.Text], []),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
