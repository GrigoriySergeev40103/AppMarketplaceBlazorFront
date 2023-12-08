namespace AppMarketplaceBlazorFront.DTOs
{
    public interface IBalanceState
    {
        event Action Notify;
        decimal Balance { get; set; }
    }

    public class PersonalUserDTO : IBalanceState
	{
		public string Id { get; set; } = default!;

		public string? UserName { get; set; }

        protected decimal _balance;
		public decimal Balance
        {
            get => _balance;
            set
            {
                if (_balance == value)
                    return;

                _balance = value;
                Notify?.Invoke();
            }
        }

        public event Action Notify;
    }
}
