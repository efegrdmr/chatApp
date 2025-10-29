using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Landing;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class LandingController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "Welcome to the secured landing page!" });
    }
}
