using Api.Models;

namespace Api.Friendships;

public sealed record SendFriendRequest(string AddresseeId);
public sealed record RespondToFriendRequest(string RequesterId, bool Accept);

public sealed record FriendshipDto(
    string UserId,
    string UserName,
    FriendshipStatus Status
);

public sealed record FriendsDto(
    IEnumerable<AppUser> Friends
);

public sealed record RequestsDto(
    IEnumerable<FriendshipDto> Requests
);

public sealed record SearchUsersDto(
    IEnumerable<AppUser> Users
);