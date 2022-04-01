using System.Diagnostics;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {

        public DataContext(DbContextOptions options) : base(options) // options passed to base - to the DBContext class
        {

        }

        public DbSet<Activities> Activities { get; set; }
    }
}