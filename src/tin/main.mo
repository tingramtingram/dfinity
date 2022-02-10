import Trie "mo:base/Trie";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

actor Tingram {

    type UserData = {
        name : ?Text;
        dateOfBirth : ?Text;
        profilePhotos : [?Text];
        profileVideoIds : [Nat];
        profileId : ?Text;
        gender : ?Text;
        mainThings : [?Text];
        interests : [?Text];
        conversations : [?Text];
        about : ?Text;
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

    type VideoId = Nat;
    type ChunkId = Nat;
    type ChunkData = Text;

    type ConversationId = Text;
    type ConversationObject = [Message];
    type Message = {
        userId : ?Text;
        userPrincipalText : ?Text;
        messageId: ?Text;
        text : ?Text;
    };

    stable var users : Trie.Trie<Principal, User> = Trie.empty();
    stable var chunks : Trie.Trie<VideoId, ChunkData> = Trie.empty();
    stable var messages : Trie.Trie<ConversationId, ConversationObject> = Trie.empty();

    public query(msg) func whoami() : async Principal {
        msg.caller
    };

    public query func allUsers() : async [(Principal, User)] {
        Iter.toArray(Trie.iter(users));
    };

    public query func allConversations() : async [(ConversationId, ConversationObject)] {
        Iter.toArray(Trie.iter(messages));
    };

    public query func chunksSize() : async Nat {
        Trie.size(chunks);
    };

    public func setConversation(ConversationId : ConversationId, data : ConversationObject) : async Text {
        let (newConversation, existing) = Trie.put(messages, keyText(ConversationId), Text.equal, data);
        messages := newConversation;
        let message : Text = "Conversation Created";
        return message;
    };

    public query func getConversation(ConversationId : ConversationId) : async ?ConversationObject {
        let result = Trie.find(messages, keyText(ConversationId), Text.equal);
        return result;
    };



    public shared(msg) func setChunk(chunkNumber : ChunkId, chunkData : ChunkData) : async Text {
        let chunk = chunkNumber;
        let data = chunkData;
        // let asText = debug_show video # debug_show chunk;
        // let asPair = (video, chunk); 

        let (newChunk, existing) = Trie.put(chunks, keyNat(chunk), Nat.equal, data);
        chunks := newChunk;
        let message : Text = "Chunk Created";
        return message;
    };

    public query func getChunk(chunkNumber : ChunkId) : async ?ChunkData {
        let chunk = chunkNumber;
        let result = Trie.find(chunks, keyNat(chunk), Nat.equal);
        return result;
    };

    public shared(msg) func create (user: UserUpdate) : async Text {
        let callerId = msg.caller;

        let userProfile: User = {
            userData = user.userData;
            id = callerId;
        };

        let (newUsers, existing) = Trie.put(users, key(callerId), Principal.equal, userProfile);
        users := newUsers;
        // switch(existing) {
        //     case null {users := newUsers};
        //     case (? v) {return "meaning is"};
        // };

        let message : Text = "User Created";
        return message;
    };

    public func updateUserData(princ : Text, user: UserUpdate) : async Text {
        let pid = Principal.fromText(princ);
        let userProfile: User = {
            userData = user.userData;
            id = pid;
        };
        let (newUsers, existing) = Trie.put(users, key(pid), Principal.equal, userProfile);
        users := newUsers;
        let message : Text = "User Data Update";
        return message;
    };

    public query func getUser(princ : Text) : async ?User {
        let pid = Principal.fromText(princ);
        let result = Trie.find(users, key(pid), Principal.equal);
        return result;
    };

    public query(msg) func read () : async ?User {
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

    public func deleteConversation (ConversationId : ConversationId) : async Bool {

        let result = Trie.find(messages, keyText(ConversationId), Text.equal);

        switch (result) {
            case null {return false};
            case (? v) {messages := Trie.replace(messages, keyText(ConversationId), Text.equal, null).0};
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

    private func keyNat(x : Nat) : Trie.Key<Nat> {
        return {key = x; hash = Hash.hash(x)}
    };

    private func keyText(t: Text) : Trie.Key<Text> {
         { key = t; hash = Text.hash t } 
    };

}