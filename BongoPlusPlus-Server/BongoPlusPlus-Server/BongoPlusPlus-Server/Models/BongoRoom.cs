using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BongoPlusPlus_Server.Models
{
    public class BongoRoom
    {
        public string RoomID;
        public List<BongoUser> Users = new List<BongoUser>();
    }
}
