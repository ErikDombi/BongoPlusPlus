using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace BongoPlusPlus_Server.Models
{
    public class BongoUser
    {
        public string ID;
        public string Name;

        [JsonIgnore]
        public IClientProxy Client;
    }
}
