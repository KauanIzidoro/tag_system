using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TagSystemAPI.Data;
using TagSystemAPI.Factories;
using TagSystemAPI.Facades;
using TagSystemAPI.Models;
using TagSystemAPI.Builders;

var builder = WebApplication.CreateBuilder(args);

// Configuração do DbContext com SQLite
builder.Services.AddDbContext<TagSystemContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("TagSystemContext") 
                      ?? throw new InvalidOperationException("Connection string 'TagSystemContext' not found.")));

// Adicione o serviço de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Adiciona os serviços necessários
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Resolve conflitos de ações com o mesmo método/caminho
    options.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
});

// Adiciona as dependências para Factory e Facade
builder.Services.AddScoped<ILoginFactory, LoginFactory>();
builder.Services.AddScoped<ILoginFacade, LoginFacade>();

var app = builder.Build();

// Habilita o CORS para a política definida
app.UseCors("AllowReactApp");

// Configuração do Swagger apenas para ambiente de desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware de redirecionamento HTTPS
app.UseHttpsRedirection();

// Middleware de autorização
app.UseAuthorization();

// Mapeia os controllers
app.MapControllers();

// Executa a aplicação
app.Run();
