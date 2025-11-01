
using System;
using System.Linq;
using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Api.Friendships;

public interface IFriendshipService
{
    Task SendFriendRequestAsync(string requesterId, string addresseeId);
    Task RespondToFriendRequestAsync(string addresseeId, string requesterId, bool accept);
    Task<FriendsDto> GetFriendsAsync(string userId);
    Task<RequestsDto> GetFriendRequestsAsync(string userId);

    Task<SearchUsersDto> SearchUsersAsync(string query, string userId);
}

public sealed class FriendshipService : IFriendshipService
{
    private readonly AppDbContext _dbContext;
    private readonly UserManager<AppUser> _userManager;

    public FriendshipService(AppDbContext dbContext, UserManager<AppUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    private async Task<AppUser> GetUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found.");
        }
        return user;
    }

    public async Task<RequestsDto> GetFriendRequestsAsync(string userId)
    {
        var user = await GetUserAsync(userId);
        var requests = await _dbContext.Friendships
            .AsNoTracking()
            .Include(friendship => friendship.Requester)
            .Where(friendship =>
                friendship.AddresseeId == user.Id &&
                friendship.Status == FriendshipStatus.Pending)
            .Select(friendship => new FriendshipDto(
                friendship.RequesterId,
                friendship.Requester.UserName ?? string.Empty,
                friendship.Status))
            .ToListAsync();

        return new RequestsDto(requests);
    }

    public async Task<FriendsDto> GetFriendsAsync(string userId)
    {
        var user = await GetUserAsync(userId);
        var friends = await _dbContext.Friendships
          .AsNoTracking()
          .Include(f => f.Requester)
          .Include(f => f.Addressee)
          .Where(f =>
              f.Status == FriendshipStatus.Accepted &&
              (f.RequesterId == user.Id || f.AddresseeId == user.Id))
          .Select(f => f.RequesterId == user.Id ? f.Addressee : f.Requester)
          .ToListAsync();

      return new FriendsDto(friends);
    }

    public async Task RespondToFriendRequestAsync(string addresseeId, string requesterId, bool accept)
    {
        var addressee = await GetUserAsync(addresseeId);
        var requester = await GetUserAsync(requesterId);

        var friendship = await _dbContext.Friendships
            .SingleOrDefaultAsync(friendship =>
                friendship.RequesterId == requester.Id &&
                friendship.AddresseeId == addressee.Id &&
                friendship.Status == FriendshipStatus.Pending);

        if (friendship is null)
        {
            throw new InvalidOperationException("No pending friend request found.");
        }

        if (accept)
        {
            friendship.Status = FriendshipStatus.Accepted;
        }
        else
        {
            _dbContext.Friendships.Remove(friendship);
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task SendFriendRequestAsync(string requesterId, string addresseeId)
    {
        if (requesterId == addresseeId)
        {
            throw new InvalidOperationException("Cannot send a friend request to yourself.");
        }

        var requester = await GetUserAsync(requesterId);
        var addressee = await GetUserAsync(addresseeId);

        var existing = await _dbContext.Friendships
            .SingleOrDefaultAsync(friendship =>
                friendship.RequesterId == requester.Id &&
                friendship.AddresseeId == addressee.Id);

        if (existing is not null)
        {
            if (existing.Status == FriendshipStatus.Pending)
            {
                throw new InvalidOperationException("Friend request already sent.");
            }

            throw new InvalidOperationException("Users are already friends.");
        }

        var opposite = await _dbContext.Friendships
            .SingleOrDefaultAsync(friendship =>
                friendship.RequesterId == addressee.Id &&
                friendship.AddresseeId == requester.Id);

        if (opposite is not null)
        {
            if (opposite.Status == FriendshipStatus.Pending)
            {
                opposite.Status = FriendshipStatus.Accepted;
                await _dbContext.SaveChangesAsync();
                return;
            }

            throw new InvalidOperationException("Users are already friends.");
        }

        var friendship = new Friendship
        {
            RequesterId = requester.Id,
            AddresseeId = addressee.Id,
            Status = FriendshipStatus.Pending
        };

        await _dbContext.Friendships.AddAsync(friendship);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<SearchUsersDto> SearchUsersAsync(string query, string userId)
    {
        var users = await _dbContext.Users
            .AsNoTracking()
            .Where(u => u.UserName!.Contains(query) && u.Id != userId)
            .ToListAsync();

        return new SearchUsersDto(users);
    }
}
