Step 1

    Project set up
                1. Start new Next.js project
                2. connect to Github repo
                                                                                                    10 mins

----------------------------------------------------------------------------------------------------------------

Step 2

    Documentation
                1. Write out the Understand.md
                2. Write out the Time Estimate.md
                3. Add the Ai Time estimate to the Estimate.md
                4. Write out the Aproach.md
                                                                                                        120 mins

----------------------------------------------------------------------------------------------------------------

Step 3

    Finish Project set up
                1. Install testing packages
                                    - vitest
                                    - @vitejs/plugin-react
                                    - @testing-library/react
                                    - @testing-library/user-event
                                    - jsdom
                2. Configure Vitest
                                    - Add vitest.config.ts.
                                    - Set test environment to jsdom.
                                    - Configure React plugin.
                                                                                                        20 mins

----------------------------------------------------------------------------------------------------------------

Step 4

    Test implementation

                1. Search URL test
                                Render the filter controls.
                                Type into the search field.
                                Advance the debounce timer.
                                Confirm router.replace() receives a URL containing the search parameter.
                                15.2 Debounce test
                                Type multiple characters quickly.
                                Confirm no router update occurs immediately.
                                Advance less than 300 ms.
                                Confirm no update.
                                Advance to 300 ms.
                                Confirm only the final search value is written.

                2. Clear filters test
                                Start with search, status, sort, and page parameters.
                                Click Clear filters.
                                Confirm navigation removes all query parameters.
                                Confirm the destination is /clients.
                
                3. Additional useful tests
                                Status changes immediately.
                                Sort changes immediately.
                                Filter changes remove or reset page.
                                Previous is disabled on page 1.
                                Next is disabled on the final page.
                                Pagination uses push().
                                Filters use replace().
                                Search input resynchronizes after URL changes.

                                                                                                        90 mins

----------------------------------------------------------------------------------------------------------------

Step 5

    Mock client data

                1. Define the client shape
                                Add id.
                                Add name.
                                Add email.
                                Add status.
                                Add an internal join-date field.
                
                2. Seed clients
                                Create at least 30 mock clients.
                                Include all three statuses:
                                active
                                cancelled
                                past_due
                                Include varied names and emails.
                                Include varied join dates.
                                Include enough data for multiple pages.

                                                                                                        40 mins

----------------------------------------------------------------------------------------------------------------

Step 6                

    Build the API route

                1. Create the route handler
                                Add app/api/clients/route.ts.
                                Handle GET requests.
                                Read query parameters from the request URL.
                
                2. Normalize API inputs
                                Trim search input.
                                Make search case-insensitive.
                                Validate status.
                                Validate sort.
                                Parse page as a positive integer.
                                Fall back to safe defaults for invalid values.
                
                3. Implement search
                                Match partial names.
                                Match partial email addresses.
                                Combine name and email matching with OR logic.
                
                4. Implement status filtering
                                Return all clients when status is empty.
                                Filter exact status values when provided.
                
                5. Implement sorting
                                Sort names alphabetically for sort=name.
                                Sort newest first for sort=joined.
                                Add a stable secondary sort, such as id.
                
                6. Implement pagination
                                Use 10 clients per page.
                                Calculate total results.
                                Calculate the last page.
                                Select the correct page of data.
                                Return pagination metadata.
                
                7. Return the API response
                                Return data.
                                Return meta.current_page.
                                Return meta.total.
                                Return meta.per_page.
                                Return meta.last_page.
                                                                                                        30 mins

----------------------------------------------------------------------------------------------------------------

Step 7

    Build the page structure

                1. Create the page route
                                Add the /clients page.
                                Keep the page itself as a Server Component where possible.
                                Render the interactive list component.
                
                2. Add Suspense
                                Wrap the Client Component in <Suspense>.
                                Use a loading skeleton as the fallback.
                
                3. Create the Client Component
                                Add "use client".
                                Read URL parameters with useSearchParams.
                                Read the route path if needed.
                                Access navigation through useRouter.
                                                                                                        40 mins

----------------------------------------------------------------------------------------------------------------

Step 8

    Implement URL-derived state

                1. Read current values
                                Read search.
                                Read status.
                                Read sort.
                                Read page.
                                Apply defaults for missing or invalid values.
                
                2. Create a query-update helper
                                Copy the current parameters into URLSearchParams.
                                Add non-default values.
                                Remove default or empty values.
                                Reset page when filters change.
                                Build the final URL safely.
                
                3. Handle browser navigation
                                Ensure Back and Forward update the controls.
                                Synchronize the search input when URL parameters change.
                                Avoid storing the full applied filter state separately in useState.
                                                                                                        30 mins

----------------------------------------------------------------------------------------------------------------

Step 9

    Build the filter controls

                1. Search field
                                Display the current URL search value.
                                Maintain temporary draft text while typing.
                                Debounce changes by 300 ms.
                                Cancel the previous timer when another character is typed.
                                Update the URL with router.replace().
                                Reset page to 1.
                
                2. Status dropdown
                                Add All.
                                Add Active.
                                Add Cancelled.
                                Add Past Due.
                                Update the URL immediately.
                                Use router.replace().
                                Reset page to 1.
                
                3. Sort dropdown
                                Add Name A–Z.
                                Add Most Recently Joined.
                                Update the URL immediately.
                                Use router.replace().
                                Reset page to 1.
                
                4. Clear filters button
                                Clear search.
                                Clear status.
                                Reset sort.
                                Reset page.
                                Remove the entire query string.
                                Navigate with router.replace().
                                                                                                        40 mins

----------------------------------------------------------------------------------------------------------------

Step 10

    Build SWR data fetching

                1. Create the fetcher
                                Fetch the API URL.
                                Parse JSON.
                                Throw an error for unsuccessful responses.
                
                2. Build the dynamic SWR key
                                Include normalized search.
                                Include normalized status.
                                Include normalized sort.
                                Include normalized page.
                
                3. Configure loading behaviour
                                Show a skeleton when no data is available for the current key.
                                Avoid intentionally showing the previous filter combination’s results.
                                Ensure changing any filter produces a different key.
                
                4. Handle errors
                                Show an error message.
                                Optionally provide a retry button using SWR’s mutate.

                                                                                                        35 mins

----------------------------------------------------------------------------------------------------------------

Step 11

    Build the client list UI

                1. Render client rows
                                Show client name.
                                Show client email.
                                Show client status.
                
                2. Build status badges
                                Display Active.
                                Display Cancelled.
                                Display Past Due.
                                Give each status a visually distinct badge.
                
                3. Add empty state
                                Show “No clients found” when the result list is empty.
                                Keep filters visible.
                                                                                                        30 mins

----------------------------------------------------------------------------------------------------------------

Step 12

    Build the loading skeleton

                1. Create skeleton rows
                                Add placeholder blocks for client names.
                                Add placeholder blocks for emails.
                                Add placeholder blocks for status badges.
                                Render several rows.
                
                2. Use the skeleton in both places
                                Use it as the Suspense fallback.
                                Use it while SWR fetches a new uncached filter combination.
                                                                                                        45 mins

----------------------------------------------------------------------------------------------------------------

Step 13

    Build pagination

                1. Previous button
                                Navigate to the previous page.
                                Use router.push().
                                Preserve search, status, and sort.
                                Disable it on page 1.
                
                2. Next button
                                Navigate to the next page.
                                Use router.push().
                                Preserve search, status, and sort.
                                Disable it on the final page.
                
                3. Display pagination information
                                Show the current page.
                                Show the last page.
                                Optionally show the total number of clients.
                                                                                                        30 mins

----------------------------------------------------------------------------------------------------------------

Step 14

    Make Tests Pass

                    Run tests

                    Fix failing tests
                                    Adjust timer calculations.
                                    Fix React state timing issues.
                                    Fix stale closures if encountered.
                                    Confirm fake timers work with Date.now().
                    
                    Check app manually
                                                                                                    40 mins

----------------------------------------------------------------------------------------------------------------

Step 15

    Quality checks
                                                                                                    30 mins

----------------------------------------------------------------------------------------------------------------

Step 16

    BEFORE-AFTER.md
                                                                                                    30 mins

----------------------------------------------------------------------------------------------------------------

                                                                                                    11.5 hrs

---------------------------------------------------------------------------------------------------------------- 

AI Estimate

I estimate that completing MA20 will take approximately 10 hours and 20 minutes.

The project itself is relatively small, but additional time is needed for the URL-based state, debounce behaviour, router mocking, SWR cache keys, and browser-history requirements. These parts are likely to require more testing and debugging than the basic API and client-list UI.

Reconciliation

My manual estimate was 11 hours.

The AI estimate was 10 hours and 20 minutes.

The AI estimate is 40 minutes lower because it expects the mock data, loading skeleton, and documentation evidence to take less time than I originally allowed. However, my manual estimate includes additional room for issues with fake timers, mocked Next.js navigation hooks, stale debounce callbacks, and synchronising the search field with browser navigation.

For that reason, I will use 11 hours as my final estimate. This keeps the estimate realistic without adding an unnecessarily large buffer.