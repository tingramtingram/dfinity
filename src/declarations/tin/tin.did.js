export const idlFactory = ({ IDL }) => {
  const UserData = IDL.Record({
    'dateOfBirth' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'profilePhotos' : IDL.Vec(IDL.Opt(IDL.Text)),
  });
  const UserUpdate = IDL.Record({ 'userData' : UserData });
  const User = IDL.Record({ 'id' : IDL.Principal, 'userData' : UserData });
  return IDL.Service({
    'create' : IDL.Func([UserUpdate], [IDL.Text], []),
    'delete' : IDL.Func([], [IDL.Bool], []),
    'read' : IDL.Func([], [IDL.Opt(User)], []),
    'update' : IDL.Func([User], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
