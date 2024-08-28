# Chat app

## backend :

### phases :
1. home
2. login
3. signup
4. chat
5. profile
6. add friend


### user information :
1. username
2. email
3. password

> implement auth and email verification

### chat page :
1. add friend
2. switch chats
3. chat

### database structure :
1. user database
2. chat database

### chat structure :
{
    chat id : ,
    sender : ,
    roomname : ,
    content : ,
    time : ,

}


# features :
1. auto search
2. message queue


# to fix
1. check if the user is already my friend in bith requestFriend and addFriend


# in socket :
1. friend request accepted
2. created a new group
3. received a message


## sending a message :
sender -> [message] -> (server) -> [structured_data] {updates the database} -> sender -> (io) -> (server io) -> {message to every receiver} ->

> unseen message count needs to be fixed
> css needs to be fixed
> remove friend needs to be designed
> group chat function needs to be designed
> user dasboard needs to be designed

...
