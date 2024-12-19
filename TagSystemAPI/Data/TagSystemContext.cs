using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TagSystemAPI;

namespace TagSystemAPI.Data
{
    public class TagSystemContext : DbContext
    {
        public TagSystemContext (DbContextOptions<TagSystemContext> options)
            : base(options)
        {
        }

        public DbSet<TagSystemAPI.Login> Login { get; set; } = default!;
        public DbSet<TagSystemAPI.Access> Access { get; set; } = default!;
        public DbSet<TagSystemAPI.Users> Users { get; set; } = default!;
    }
}
