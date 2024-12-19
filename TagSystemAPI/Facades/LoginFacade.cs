using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TagSystemAPI.Data;
using TagSystemAPI.Models;
using TagSystemAPI.Factories;
using Microsoft.AspNetCore.Mvc;


namespace TagSystemAPI.Facades
{
    public class LoginFacade : ILoginFacade
    {
        private readonly TagSystemContext _context;
        private readonly ILoginFactory _loginFactory;


        public LoginFacade(TagSystemContext context, ILoginFactory loginFactory)
        {
            _context = context;
            _loginFactory = loginFactory;
        }


        // Implementação do método CreateLoginAsync
        public async Task<Login> CreateLoginAsync(LoginDTO loginDTO)
        {
            var login = _loginFactory.CreateLogin(loginDTO.Username, loginDTO.Password);
            
            if (login == null)
            {
                throw new InvalidOperationException("Erro ao criar login.");
            }

            _context.Login.Add(login);
            await _context.SaveChangesAsync();
            return login;
        }


        // Implementação do método AuthenticateAsync
        public async Task<Login> AuthenticateAsync(LoginDTO loginDTO)
        {
            var login = await _context.Login
                .FirstOrDefaultAsync(l => l.Username == loginDTO.Username && l.Password == loginDTO.Password);
            
            if (login == null)
            {
                throw new UnauthorizedAccessException("Usuário ou senha inválidos.");
            }

            return login;
        }



        // Implementação do método GetLoginAsync (sem parâmetros)
        public async Task<List<Login>> GetLoginAsync()
        {
            return await _context.Login.ToListAsync();
        }

        // Implementação do método GetLoginAsync com ID
        public async Task<Login?> GetLoginAsync(int id)
        {
            return await _context.Login.FindAsync(id);
        }

        // Implementação do método UpdateLoginAsync
        public async Task UpdateLoginAsync(int id, LoginDTO loginDTO)
        {
            var existingLogin = await _context.Login.FindAsync(id);
            if (existingLogin != null)
            {
                existingLogin.Username = loginDTO.Username;
                existingLogin.Password = loginDTO.Password;
                _context.Entry(existingLogin).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
        }

        // Implementação do método DeleteLoginAsync
        public async Task DeleteLoginAsync(int id)
        {
            var login = await _context.Login.FindAsync(id);
            if (login != null)
            {
                _context.Login.Remove(login);
                await _context.SaveChangesAsync();
            }
        }

        private static LoginDTO LoginToDTO(Login login) =>
        new LoginDTO{
            Username = login.Username,
            Password = login.Password
        };
    
    }
}
