using TagSystemAPI;
using TagSystemAPI.Data; 

namespace TagSystemAPI.Factories;


// Factory com a criação de login
public class LoginFactory : ILoginFactory
{
    public Login CreateLogin(string username, string password)
    {
        return new Login
        {
            Username = username,
            Password = password
        };
    }
}
