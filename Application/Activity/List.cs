using MediatR;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Activity
{
    public class List
    {
        // We are using a 3rd party package here called Mediator.    
        // When using a package like this we will often be using the code created 
        // by this author rather than explicitly doing everything ourselves.

        // We add Mediator as a service and tell the Startup class to locate the handlers.  
        // When we send our query, this gets "handled" by Mediator and it will return to us the response.

        // Mediator is able to work out what is the handler from the query due to us specifying 
        // the IRequest type in the type for the IRequestHandler.
        public class Query : IRequest<List<Activities>> { }

        public class Handler : IRequestHandler<Query, List<Activities>>
        {
            private readonly DataContext _context;
            private readonly ILogger _logger;

            public Handler(DataContext context, ILogger<List> logger)
            {
                _logger = logger;
                _context = context;
            }

            public async Task<List<Activities>> Handle(Query request, CancellationToken cancellationToken)
            {

                // using a cancellation token

                // try
                // {
                //     for (var i = 0; i < 10; i++)
                //     {
                //         cancellationToken.ThrowIfCancellationRequested();
                //         await Task.Delay(1000, cancellationToken);
                //         _logger.LogInformation($"Task {i} has completed");
                //     }
                // }
                // catch (Exception ex) when (ex is TaskCanceledException)
                // {
                //     _logger.LogInformation("Task was cancelled");
                // }
                return await _context.Activities.ToListAsync(cancellationToken);
            }
        }
    }
}