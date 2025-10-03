using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using server.Models;

namespace server.Utilities
{
    public class ValidationHelper
    {
        public static IActionResult? ValidateModel(ModelStateDictionary modelState)
        {
            if (modelState.IsValid) return null;

            var errors = modelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            string errorMessage = errors.Count > 0 ? errors[0] : "";

            return new BadRequestObjectResult(new ApiResponse<object>(false, errorMessage, errors));
        }

        public static bool IsValidEmail(string email)
        {
            // Regular expression for validating email
            string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            Regex regex = new(pattern);

            return regex.IsMatch(email);
        }
    }
}