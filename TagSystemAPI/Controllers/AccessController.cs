using System.Linq;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TagSystemAPI.Data;
using TagSystemAPI.Models;
using TagSystemAPI.Builders;

namespace TagSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccessController : ControllerBase
    {
        private readonly TagSystemContext _context;

        public AccessController(TagSystemContext context)
        {
            _context = context;
        }

        // GET: api/Access
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Access>>> GetAccess()
        {
            return await _context.Access.ToListAsync();
        }

        [HttpGet("rejected")]
        public async Task<ActionResult<IEnumerable<Access>>> GetRejectedAccess()
        {
            //consulta para retornar o número de tentativas de acesso à sala
            var RejectAccess = await _context.Access.Where(ra => ra.IsAuthorized == false).CountAsync();
            return Ok(new { RejectAccess });
        }

        [HttpGet("accesshistory")]
        public async Task<ActionResult<IEnumerable<object>>> GetAccessHistory()
        {
            // Consulta para retornar o histórico de acessos
            /*
            schema:
            Nome (Users.Name),
            Cargo (Users.Role),
            Horário de entrada (Access.TimeAccess),
            Tag ativa (Access.IsAuthorized),
            Local (Access.Room)
            */

            var AccessHistory = await _context.Access
                .GroupJoin(
                    _context.Users,
                    access => access.Rfid,      // Chave estrangeira em Access
                    user => user.Rfid,          // Chave primária em Users
                    (access, users) => new { access, user = users.FirstOrDefault() }
                )
                .Select(result => new
                {
                    Nome = result.access.IsAuthorized && result.user != null ? result.user.Name : "Individuo Indigente",
                    Cargo = result.access.IsAuthorized && result.user != null ? result.user.Role : "Curioso",
                    HorarioEntrada = result.access.TimeAccess,
                    TagAtiva = result.access.IsAuthorized,
                    Local = result.access.Room
                })
                .OrderByDescending(ah => ah.HorarioEntrada)
                .ToListAsync();

            return Ok(AccessHistory);

        }

        [HttpGet("total")]
        public async Task<ActionResult<IEnumerable<Access>>> GetTotalAccess()
        {
            //consulta para retornar o número total de linhas da tabela 'Access'
            var TotalAccess = await _context.Access.CountAsync();
            return Ok(new { TotalAccess });
        }

        [HttpGet("latest")]
        public async Task<ActionResult<string>> GetLatestAccess()
        {
            var latestAccess = await _context.Access
                .Where(la => la.IsAuthorized == true) // Filtra apenas os acessos autorizados
                .OrderByDescending(la => la.TimeAccess) // Ordena os acessos pela hora mais recente
                .Select(la => la.TimeAccess) // Seleciona a hora de acesso
                .FirstOrDefaultAsync(); // Retorna o primeiro acesso encontrado

            if (latestAccess == null)
            {
                return NotFound("Nenhum acesso encontrado.");
            }

            // Formata a hora no formato HH:mm
            var momentAccessed = DateTime.Parse(latestAccess);
            var culture = new CultureInfo("pt-BR");
            var formattedAccess = $"{momentAccessed:dd} de {momentAccessed.ToString("MMMM", culture)}, {momentAccessed:HH}:{momentAccessed:mm}:{momentAccessed:ss}";

            return Ok(new { HourAccess = formattedAccess });
        }

        [HttpGet("dailyaccess")]
        public async Task<ActionResult<IEnumerable<Access>>> GetDailyAccess()
        {
            //Consulta para retornar os acessos
            // formato de data armazenado no banco: AAAA-MM-DD HH:MM:SS

            var DailyAccess = await _context.Access.Select(da => da.TimeAccess).ToListAsync(); // -> O(n)?

            // Esta lista armazena apenas os dias e comparada ao dia de hoje podemos retornar quantos acessos foram feitos
            // em função do dia atual:
            // (Observe que estes valores variam de 01 à 31) 2024-12-09 12:00:0

            var DayList = DailyAccess.Select(da => DateTime.Parse(da).ToString("dd")).ToList();// -> O(n)?

            // Finalmente podemos contabilizar o número de acessos dado que este resultado
            // é obtido quando somamos o número de elementos presentes na lista cujo o seu valor    
            // é igual ao dia de hoje.
            var TodayAccess = DayList.Count(da => da == DateTime.Now.ToString("dd")); // --> O(n)?


            return Ok(new { TodayAccess });
        }

        [HttpGet("weeklyaccess")]
        public async Task<ActionResult<IEnumerable<object>>> GetWeeklyAccess()
        {
            var sevenDaysAgo = DateTime.UtcNow.Date.AddDays(-7);

            // Buscar dados do banco
            var accessData = await _context.Access.ToListAsync();

            // Filtrar os dados que ocorreram nos últimos 7 dias com acesso
            var weeklyAccess = accessData
                .Where(a => DateTime.TryParse(a.TimeAccess, out var parsedDate) && parsedDate >= sevenDaysAgo) // Filtra acessos dos últimos 7 dias
                .GroupBy(a => DateTime.Parse(a.TimeAccess).Date) // Agrupar por data
                .Select(g => new
                {
                    Day = g.Key.ToString("yyyy-MM-dd"), // Formatar como "yyyy-MM-dd"
                    Authorized = g.Count(a => a.IsAuthorized), // Contar acessos autorizados
                    Rejected = g.Count(a => !a.IsAuthorized) // Contar acessos rejeitados
                })
                .OrderBy(d => d.Day) // Ordenar por data do mais antigo para o mais recente
                .ToList();

            // Filtra os resultados para incluir apenas os 7 dias mais recentes com acessos
            var lastSevenDays = weeklyAccess
                .TakeLast(7) // Pega os últimos 7 dias com acesso
                .ToList();

            return Ok(lastSevenDays);
        }

        [HttpGet("hourlyaccess")]
        public async Task<ActionResult<IEnumerable<object>>> GetHourlyAccess()
        {
            // Obtemos todos os acessos
            var hourlyAccess = await _context.Access.ToListAsync();

            // Definindo os horários de início e fim para o intervalo de dados
            DateTime startDate = new DateTime(2024, 12, 10, 19, 33, 29);  // Hora de início: 2024-12-10 19:33:29
            DateTime endDate = new DateTime(2024, 12, 11, 16, 2, 32);  // Hora de fim: 2024-12-11 16:02:32

            // Filtra os acessos dentro do intervalo de tempo específico
            var validAccesses = hourlyAccess
                .Where(a => DateTime.TryParse(a.TimeAccess, out DateTime timeAccess) 
                            && timeAccess >= startDate // Acessos a partir do horário de início
                            && timeAccess <= endDate)  // Acessos até o horário de fim
                .ToList();

            // Ordena os acessos pela hora (para manter a ordem correta)
            var orderedAccesses = validAccesses
                .OrderBy(a => DateTime.Parse(a.TimeAccess))  // Ordena por data e hora
                .ToList();

            // Agrupa os acessos por hora
            var hourlyGroupedAccess = orderedAccesses
                .GroupBy(a => DateTime.Parse(a.TimeAccess).Hour)  // Agrupando por hora
                .Select(g => new
                {
                    Hour = g.Key,  // Hora do acesso
                    // Contagem dos acessos autorizados (IsAuthorized == true) e rejeitados (IsAuthorized == false)
                    Authorized = g.Count(a => a.IsAuthorized == true),  
                    Rejected = g.Count(a => a.IsAuthorized == false)
                })
                .ToList();

            // Retorna os dados agrupados por hora
            return Ok(hourlyGroupedAccess); 
        }

        // GET: api/Access/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Access>> GetAccess(int id)
        {
            var access = await _context.Access.FindAsync(id);

            if (access == null)
            {
                return NotFound();
            }

            return access;
        }

        // PUT: api/Access/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccess(int id, Access access)
        {
            if (id != access.Id)
            {
                return BadRequest();
            }

            _context.Entry(access).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccessExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Access
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Access>> PostAccess(AccessDTO accessDTO)
        {
            // Verifica se o RFID existe na tabela User
            var AccessAuthorized = await _context.Users.AnyAsync(u => u.Rfid == accessDTO.Rfid);

            // Usa o Builder para criar o objeto Access
            var access = new AccessBuilder()
                            .SetRfid(accessDTO.Rfid)
                            .SetRoom(accessDTO.Room)
                            .SetTimeAccess(accessDTO.TimeAccess)
                            .SetIsAuthorized(AccessAuthorized)
                            .Build();

            _context.Access.Add(access);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAccess", new { id = access.Id }, access);
        }

        // DELETE: api/Access/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccess(int id)
        {
            var access = await _context.Access.FindAsync(id);
            if (access == null)
            {
                return NotFound();
            }

            _context.Access.Remove(access);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AccessExists(int id)
        {
            return _context.Access.Any(e => e.Id == id);
        }
    }
}
