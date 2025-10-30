using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Friendships;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class FriendshipController : ControllerBase
{
    private readonly IFriendshipService _friendshipService;

    public FriendshipController(IFriendshipService friendshipService)
    {
        _friendshipService = friendshipService;
    }

    [HttpGet("friends")]
    public async Task<ActionResult<FriendsDto>> GetFriendsAsync()
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var friends = await _friendshipService.GetFriendsAsync(userId);
        return Ok(friends);
    }

    [HttpGet("requests")]
    public async Task<ActionResult<RequestsDto>> GetFriendRequestsAsync()
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var requests = await _friendshipService.GetFriendRequestsAsync(userId);
        return Ok(requests);
    }

    [HttpPost("requests")]
    public async Task<IActionResult> SendFriendRequestAsync([FromBody] SendFriendRequest request)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        try
        {
            await _friendshipService.SendFriendRequestAsync(userId, request.AddresseeId);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("requests/respond")]
    public async Task<IActionResult> RespondToFriendRequestAsync([FromBody] RespondToFriendRequest request)
    {
        var userId = GetUseGetUserIdrId();
        if (userId is null)
        {
            return Unauthorized();
        }

        try
        {
            await _friendshipService.RespondToFriendRequestAsync(userId, request.RequesterId, request.Accept);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private string? GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
