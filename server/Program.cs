using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.Services;

var builder = WebApplication.CreateBuilder(args);

var secretKey = builder.Configuration["JwtSettings:SecretKey"];

if (string.IsNullOrEmpty(secretKey))
{
    throw new InvalidOperationException("JWT Secret Key is not configured in the appsettings.");
}


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

builder.Services.AddAuthorization();

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")  // Allow your Angular app URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add Swagger services (optional)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped(typeof(ITokenService), typeof(TokenService));
builder.Services.AddScoped(typeof(IDataRepository<>), typeof(DataRepository<>));

var app = builder.Build();

// Use CORS
app.UseCors("AllowAngularApp");

// Enable Swagger UI in development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = "swagger"; // Change Swagger route prefix
    });
}

// Serve Angular static files from /wwwroot/
app.UseDefaultFiles();  // Automatically look for index.html
app.UseStaticFiles();  // Serve static files from wwwroot

// Enable routing
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Map API controllers
app.MapControllers();

// Fallback to Angular's index.html for all other routes
app.MapFallbackToFile("index.html"); // Corrected path to index.html within wwwroot

app.Run();