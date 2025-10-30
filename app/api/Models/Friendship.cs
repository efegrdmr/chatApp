namespace Api.Models;

public enum FriendshipStatus
{
    Pending,
    Accepted
}

public sealed class Friendship
{
      public string RequesterId { get; set; } = default!;
      public AppUser Requester { get; set; } = default!;
      public string AddresseeId { get; set; } = default!;
      public AppUser Addressee { get; set; } = default!;
      public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;
}