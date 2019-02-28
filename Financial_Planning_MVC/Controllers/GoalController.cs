using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Financial_Planning_MVC.Models;
using Financial_Planning_MVC.Services;

namespace Financial_Planning_MVC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalController : ControllerBase
    {
        private readonly GoalContext _goalContext;
        private readonly UserManager<IdentityUser> _userManager;

        public GoalController(UserManager<IdentityUser> userManager, GoalContext goalContext)
        {
            _goalContext = goalContext;
            _userManager = userManager;
        }
        // GET: api/Goal
        [HttpGet]
        // We require the user to be authenticated in order to interact with any portion of this API.
        [AuthorizeApiAttribute()]
        // Retrieves all goals for the currently authenticated user.
        public List<Goal> Get()
        {
            string userId = getUserId();

            return getUserGoals(userId);
        }

        // GET: api/Goal/5
        // To-Do: Require Authorization role to be administrative in order to retrieve goals not owned by the currently authenticated user.
        [HttpGet("{id}", Name = "Get")]
        [AuthorizeApiAttribute()]
        // Retrieves a specific goal if it is owned by the currently authenticated user.
        public ActionResult<Goal> Get(int id)
        {
            Goal goal = getGoal(id);

            if (goal == null)
            {
                return NotFound();
            }

            // Make sure the goal belongs to the current user.
            if (goal.UserId != getUserId())
            {
                return Unauthorized();
            }

            return goal;
        }

        // POST: api/Goal/
        [HttpPost]
        [AuthorizeApiAttribute()]
        public ActionResult<Goal> Post([FromBody] JObject goalData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            dynamic data  = goalData;
            string userId = getUserId();

            // Create a new goal with the data sent by the user.
            Goal goal = new Goal()
            {
                // Never allow the user to send their own userID.
                UserId       = userId,
                Name         = data.name,
                Description  = data.description,
                TargetAmount = data.targetAmount,
                AmountSaved  = data.amountSaved,
            };

            _goalContext.Add(goal);
            _goalContext.SaveChanges();

            return goal;
        }

        // PUT: api/Goal/
        [HttpPut("{id?}")]
        [AuthorizeApiAttribute()]
        // Create / update a goal depending on if an ID was sent.
        public ActionResult<Goal> Put(int id, [FromBody] JObject goalData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            Goal goal;
            dynamic data  = goalData;
            string userId = getUserId();

            // If an id was sent, check to see if the goal exists in the database.
            if (id != 0)
            {
                goal = getGoal(id);

                if (goal == null)
                {
                    return NotFound();
                }

                if (goal.UserId != userId)
                {
                    return Unauthorized();
                }

                // Update the existing goal.
                goal.Name         = data.name;
                goal.Description  = data.description;
                goal.TargetAmount = data.TargetAmount;
                goal.AmountSaved  = data.amountSaved;

                _goalContext.Update(goal);
            }
            else
            {
                // A new goal is being created.
                goal = new Goal()
                {
                    // Never allow the user to send their own userID.
                    UserId       = userId,
                    Name         = data.name,
                    Description  = data.description,
                    TargetAmount = data.targetAmount,
                    AmountSaved  = data.amountSaved,
                };

                _goalContext.Add(goal);
            }

            // Save the update / creation request.
            _goalContext.SaveChanges();

            return goal;
        }

        // Patch: api/Goal/5
        [HttpPatch("{id}")]
        [AuthorizeApiAttribute()]
        // Update an existing goal's data.
        public ActionResult<Goal> Patch(int id, [FromBody] JsonPatchDocument<Goal> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            // Retrieve the goal the user is wanting to patch.
            Goal goal = getGoal(id);

            if (goal == null)
            {
                return NotFound();
            }

            // Apply the requested changes to the goal.
            patch.ApplyTo(goal);

            // Do not allow an authenticated user to update the goal belonging to another user.
            // This also prevents the authenticated user from changing the userId of their own goal.
            if (goal.UserId != getUserId())
            {
                return Unauthorized();
            }

            // Update the goal and save changes.
            _goalContext.Update(goal);
            _goalContext.SaveChanges();

            return goal;
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        [AuthorizeApiAttribute()]
        // Delete a goal with a specific ID.
        public StatusCodeResult Delete(int id)
        {
            // Retrieve the goal the user is wanting to delete.
            Goal goal = getGoal(id);

            if (goal == null)
            {
                return NotFound();
            }

            // Do not allow the authenticated user to delete goals belonging to another user.
            if (goal.UserId != getUserId())
            {
                return Unauthorized();
            }

            // Remove the goal and save changes.
            _goalContext.Remove(goal);
            _goalContext.SaveChanges();

            return Ok();
        }

        // Get the ID of the currently authenticated user.
        private string getUserId()
        {
            return _userManager.GetUserId(User);
        }

        // Get a goal with a specific ID.
        private Goal getGoal(int goalId)
        {
            return _goalContext.Goals
                .Where(goal => goal.Id == goalId)
                .FirstOrDefault();
        }

        // Get a list of goals belonging to the user.
        private List<Goal> getUserGoals(string userId)
        {
            return _goalContext.Goals
                .Where(goal => goal.UserId == userId)
                .ToList();
        }
    }
}
