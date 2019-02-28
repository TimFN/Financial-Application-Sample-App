using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Financial_Planning_MVC.Models;
using Financial_Planning_MVC.Views.Home;
using Financial_Planning_MVC.Areas.Identity.Pages.Account;


namespace Financial_Planning_MVC.Controllers
{
    public class HomeController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ILogger<LoginModel> _logger;

        public HomeController(SignInManager<IdentityUser> signInManager, ILogger<LoginModel> logger)
        {
            _signInManager = signInManager;
            _logger        = logger;
        }

        public IActionResult Index()
        {
            if (User.Identity.IsAuthenticated == true)
            {
                return View("Index", new IndexModel());
            }
            else
            {
                return View("Login", new LoginModel(_signInManager, _logger));
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
