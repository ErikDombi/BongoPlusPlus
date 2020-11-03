using BongoPlusPlus_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BongoPlusPlus_Server.Controllers
{
    public class RoomsController : Controller
    {
        private BongoManager _bongoManager;
        public RoomsController(BongoManager _bm)
        {
            _bongoManager = _bm;
        }

        [Route("/Rooms/{id}")]
        public IActionResult GetRoom(string id)
        {
            var room = _bongoManager.Rooms.FirstOrDefault(_ => _.RoomID == id);
            var json = JsonConvert.SerializeObject(room);
            return Content(json);
        }
    }
}
