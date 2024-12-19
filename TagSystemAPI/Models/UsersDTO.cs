using System.Text.Json.Serialization;

namespace TagSystemAPI.Models
{

    public class UsersDTO
    {
        public int Rfid { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public int CreatedBy { get; set; }
    }

}