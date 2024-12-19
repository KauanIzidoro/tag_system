using Microsoft.EntityFrameworkCore;
using TagSystemAPI.Data;
using TagSystemAPI;

namespace TagSystemAPI.Factories;

// Interface de criação de login
public interface ILoginFactory
{
    Login CreateLogin(string username, string password);
}
