using AppMarketplaceBlazorFront.DTOs;

namespace AppMarketplaceBlazorFront.Services
{
	public class PersonalData
	{
		public PersonalUserDTO? CurrentUser { get; set; }

		public List<AppDTO>? AcquiredApps { get; set; }
    }
}
