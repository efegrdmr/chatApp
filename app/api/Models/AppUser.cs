using Microsoft.AspNetCore.Identity;

namespace Api.Models;

public sealed class AppUser : IdentityUser
{
    public ICollection<Friendship> SentFriendships { get; } = new List<Friendship>();

    public ICollection<Friendship> ReceivedFriendships { get; } = new List<Friendship>();
}
