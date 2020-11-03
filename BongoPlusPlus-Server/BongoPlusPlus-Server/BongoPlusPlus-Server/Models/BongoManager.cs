using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace BongoPlusPlus_Server.Models
{
    public class BongoManager
    {
        public List<BongoUser> Users = new List<BongoUser>();
        public List<BongoRoom> Rooms = new List<BongoRoom>();

        public BongoUser createUser(string id)
        {
            var oldUser = Users.FirstOrDefault(_ => _.ID == id);
            if (oldUser != null)
            {
                Users.Remove(oldUser);
            }

            BongoUser bongoUser = new BongoUser() { ID = id };

            Users.Add(bongoUser);

            return bongoUser;
        }

        public BongoRoom joinRoom(string roomID, BongoUser sender)
        {
            if(Rooms.Any(t => t.RoomID == roomID))
            {
                var room = Rooms.FirstOrDefault(_ => _.RoomID == roomID);
                
                // Remove any existing users with the same ID
                if (room.Users.Any(_ => _.ID == sender.ID))
                    room.Users.Remove(room.Users.FirstOrDefault(_ => _.ID == sender.ID));

                room.Users.Add(sender);
                return room;
            }else
            {
                BongoRoom room = new BongoRoom() { RoomID = roomID };
                room.Users.Add(sender);
                Rooms.Add(room);
                return room;
            }
        }
    }
}
