using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Financial_Planning_MVC.Models
{
    public class GoalContext : DbContext
    {
        public GoalContext(DbContextOptions<GoalContext> options)
            : base(options)
        { }

        public DbSet<Goal> Goals { get; set; }
    }

    public class Goal
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal TargetAmount { get; set; }
        public decimal AmountSaved { get; set; }
    }
}