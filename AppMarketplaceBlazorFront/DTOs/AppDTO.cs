﻿namespace AppMarketplaceBlazorFront.DTOs
{
    public class AppDTO : IEquatable<AppDTO>
    {
        public string AppId { get; set; } = null!;

        public string DeveloperId { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string Extension { get; set; } = null!;

        public DateTime UploadDate { get; set; }

        public decimal Price { get; set; }

        public string CategoryName { get; set; } = null!;

        public string? Description { get; set; }

        public string? SpecialDescription { get; set; }

		public bool Equals(AppDTO? other)
		{
            if (other == null)
                return false;

            return AppId == other.AppId;
		}
	}
}
