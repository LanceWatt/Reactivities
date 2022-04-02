using Domain;
using MediatR;
using Persistence;

namespace Application.Activity
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activities Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // EF tracking the fact that adding activities into context in memory
                _context.Activities.Add(request.Activity);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}