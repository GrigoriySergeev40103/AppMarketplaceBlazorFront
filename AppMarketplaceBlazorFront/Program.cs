using AppMarketplaceBlazorFront;
using AppMarketplaceBlazorFront.Services;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using TusBlazorClient;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddSingleton<PersonalData>();
builder.Services.AddScoped(sp => new HttpClient(new CookieHandler()) { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddTusBlazorClient();

await builder.Build().RunAsync();