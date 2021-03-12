using KPProject.ViewModels;
using System.Threading.Tasks;

namespace KPProject.Interfaces
{
    public interface ICustomAuthenticationService
    {
        Task<UserViewModel> SignInUserAsync(SignInViewModel signInViewModel);
        Task<UserViewModel> RegisterUserAsync(RegisterViewModel registerViewModel);
    }
}