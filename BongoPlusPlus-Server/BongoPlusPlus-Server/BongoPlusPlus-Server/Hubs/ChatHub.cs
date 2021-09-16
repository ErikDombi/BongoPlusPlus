using BongoPlusPlus_Server.Models;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BongoPlusPlus_Server.Hubs
{
    public class ChatHub : Hub
    {
        private BongoManager _bongoManager;
        public ChatHub(BongoManager bongoManager)
        {
            _bongoManager = bongoManager;
        }

        public async Task JoinRoom(string roomID, string userID, string username)
        {
            var _user = _bongoManager.createUser(userID);
            _user.Client = Clients.Caller;
            _user.Name = username;

            var room = _bongoManager.joinRoom(roomID, _user);
            
            await Clients.All.SendAsync("UserJoined", userID, username);
            await Clients.Caller.SendAsync("OnJoinData");
        }

        public async Task AddReaction(string reaction, string message, string user)
        {
            await Clients.All.SendAsync("AddReaction", reaction, message, user);
        }
    }
}
