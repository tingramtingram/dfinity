export const idlFactory = ({ IDL }) => {
  const UserData = IDL.Record({
    'dateOfBirth' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'profilePhotos' : IDL.Vec(IDL.Opt(IDL.Text)),
  });
  const UserUpdate = IDL.Record({ 'userData' : UserData });
  const ChunkId = IDL.Nat;
  const ChunkData = IDL.Text;
  const videoIds = IDL.Vec(IDL.Nat);
  const User = IDL.Record({ 'id' : IDL.Principal, 'userData' : UserData });
  return IDL.Service({
    'create' : IDL.Func([UserUpdate], [IDL.Text], []),
    'delete' : IDL.Func([], [IDL.Bool], []),
    'getChunk' : IDL.Func([ChunkId], [IDL.Opt(ChunkData)], []),
    'getVideoIds' : IDL.Func([], [IDL.Opt(videoIds)], []),
    'read' : IDL.Func([], [IDL.Opt(User)], []),
    'setChunk' : IDL.Func([ChunkId, ChunkData], [IDL.Text], []),
    'setVideoIds' : IDL.Func([videoIds], [IDL.Text], []),
    'update' : IDL.Func([User], [IDL.Bool], []),
    'whoami' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
