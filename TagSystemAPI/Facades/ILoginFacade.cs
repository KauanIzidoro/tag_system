using Microsoft.EntityFrameworkCore;
using TagSystemAPI.Data;
using TagSystemAPI.Models;


namespace TagSystemAPI.Facades
{
    public interface ILoginFacade
    {
        Task<Login> CreateLoginAsync(LoginDTO loginDTO);
        Task<Login> AuthenticateAsync(LoginDTO loginDTO);
        Task<List<Login>> GetLoginAsync();
        Task<Login> GetLoginAsync(int id);
        Task UpdateLoginAsync(int id, LoginDTO loginDTO);
        Task DeleteLoginAsync(int id);
    }
}
