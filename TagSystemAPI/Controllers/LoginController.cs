using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TagSystemAPI.Models;
using TagSystemAPI.Facades;

namespace TagSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginFacade _LoginFacade;

        public LoginController(ILoginFacade LoginFacade)
        {
            _LoginFacade = LoginFacade;
        }


        // GET: api/Login
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Login>>> GetLogin()
        {
            var logins = await _LoginFacade.GetLoginAsync();
            return Ok(logins);
        }


        // GET: api/Login/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Login>> GetLogin(int id)
        {
            var login = await _LoginFacade.GetLoginAsync(id);
            if (login == null)
            {
                return NotFound();
            }
            return login;
        }


        // PUT: api/Login/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLogin(int id, LoginDTO loginDTO)
        {
            await _LoginFacade.UpdateLoginAsync(id, loginDTO);
            return NoContent();
        }


        // POST: api/Login/Create
        [HttpPost("Create")]
        public async Task<ActionResult<Login>> CreateLogin(LoginDTO loginDTO)
        {
            var login = await _LoginFacade.CreateLoginAsync(loginDTO);
            return CreatedAtAction(nameof(GetLogin), new { id = login.Id }, login);
        }


        [HttpPost("Authenticate")]
        public async Task<ActionResult<Login>> Authenticate(LoginDTO loginDTO)
        {
            try
            {
                var login = await _LoginFacade.AuthenticateAsync(loginDTO);

                // Se o login for bem-sucedido, retornamos o login com sucesso
                return Ok(login);
            }
            catch (UnauthorizedAccessException ex)
            {
                // Se a exceção for gerada devido a falha na autenticação, retornamos 401 (Unauthorized)
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Caso haja qualquer outra exceção, retornamos 500 (Internal Server Error)
                return StatusCode(500, new { message = "Ocorreu um erro interno.", details = ex.Message });
            }
        }



        // DELETE: api/Login/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLogin(int id)
        {
            await _LoginFacade.DeleteLoginAsync(id);
            return NoContent();
        }
        
    }
}
