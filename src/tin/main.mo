import Trie "mo:base/Trie";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Principal "mo:base/Principal";

actor Tingram {
    type UserData = {
        name : ?Text;
        dateOfBirth : ?Text;
        profilePhotos : [?Text];
    };

    type User = {
        userData : UserData;
        id : Principal;
    };

    type UserUpdate = {
        userData : UserData;
    };

    type Error = {
        #NotFound;
        #AlreadyExists;
    };

    stable var users : Trie.Trie<Principal, User> = Trie.empty();

    public shared(msg) func create (user: UserUpdate) : async Text {
        let callerId = msg.caller;

        

        let userProfile: User = {
            userData = user.userData;
            id = callerId;
        };

        let (newUsers, existing) = Trie.put(users, key(callerId), Principal.equal, userProfile);

        switch(existing) {
            case null {users := newUsers};
            case (? v) {return "meaning is"};
        };

        let message : Text = "User Created";
        return message;
    };

    public shared(msg) func read () : async ?User {
        let callerId = msg.caller;
        
        let result = Trie.find(users, key(callerId), Principal.equal);
        return result;
    };

    public shared(msg) func update (user : User) : async Bool {
        let callerId = msg.caller;
        if (Principal.toText(callerId) == "2vxsx-fae") { return false};

        let userProfile: User = {
            userData = user.userData;
            id = callerId;
        };

        let result = Trie.find(users, key(callerId), Principal.equal);

        switch (result) {
            case null {return false};
            case (? v) {users := Trie.replace(users, key(callerId), Principal.equal, ?userProfile).0};
        };

        return true;
    };

    public shared(msg) func delete () : async Bool {
        let callerId = msg.caller;
        
        let result = Trie.find(users, key(callerId), Principal.equal);

        switch (result) {
            case null {return false};
            case (? v) {users := Trie.replace(users, key(callerId), Principal.equal, null).0};
        };

        return true;
    };

    private func key(x : Principal) : Trie.Key<Principal> {
        return {key = x; hash = Principal.hash(x)}
    };
}