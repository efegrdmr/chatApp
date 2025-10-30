using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Data;

public sealed class AppDbContext : IdentityDbContext<AppUser, IdentityRole, string>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Friendship> Friendships => Set<Friendship>();


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Friendship>(entity =>
        {
            entity.HasKey(f => new { f.RequesterId, f.AddresseeId });
            entity.HasIndex(f => new { f.AddresseeId, f.RequesterId }).IsUnique();

            entity.HasOne(f => f.Requester)
                .WithMany(u => u.SentFriendships)
                .HasForeignKey(f => f.RequesterId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(f => f.Addressee)
                .WithMany(u => u.ReceivedFriendships)
                .HasForeignKey(f => f.AddresseeId)
                .OnDelete(DeleteBehavior.Restrict);

        });
    }
}
