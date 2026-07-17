Overview

I will build a paginated client list using Next.js App Router. Coaches will be able to search clients, filter by status, sort the results, move between pages, and clear the current filters.

The URL will be the source of truth for the applied search, status, sort, and page values. This allows the current view to survive a refresh and be shared with another coach.

The feature will be split into:

A Server Component page with a Suspense boundary.
A Client Component that handles URL state and data fetching.
A mock API route containing at least 30 clients.
Reusable filter, list, pagination, loading, empty, and error components.
Tests covering URL updates, debounce behaviour, and clearing filters.
Component structure
app/clients/page.tsx

This will be the main page route.

It will remain a Server Component and will:

Render the page heading.
Render the interactive client list.
Wrap the Client Component in <Suspense>.
Use the loading skeleton as the Suspense fallback.

The Suspense boundary is needed because the Client Component will use useSearchParams.

components/clients/ClientListPage.tsx

This will be the main Client Component.

It will:

Read search, status, sort, and page from the URL.
Store the temporary search text while the debounce is running.
Build the API URL used as the SWR cache key.
Fetch the current list of clients.
Render the filters, list, pagination, loading state, empty state, and error state.
Update the URL when the coach changes a filter or page.
components/clients/ClientFilters.tsx

This component will display:

Search input.
Status dropdown.
Sort dropdown.
Clear filters button.

It will receive its current values and event handlers from the parent component. It will not own the applied filter state because that state comes from the URL.

components/clients/ClientList.tsx

This component will render the clients returned by the API.

Each client row will display:

Name.
Email.
Status badge.
components/clients/ClientStatusBadge.tsx

This component will display a readable badge for:

Active.
Cancelled.
Past Due.
components/clients/Pagination.tsx

This component will display:

Previous button.
Current page information.
Next button.

It will receive the current page, last page, and navigation callbacks.

components/clients/ClientListSkeleton.tsx

This component will display several placeholder client rows while data is loading.

Each row will contain skeleton blocks for the client's name, email, and status. This meets the requirement for a loading skeleton rather than a spinner or plain loading message.

Data model

There is no database for this task. The API route will use an in-memory array of mock clients.

type ClientStatus = "active" | "cancelled" | "past_due";

type Client = {
  id: number;
  name: string;
  email: string;
  status: ClientStatus;
  joinedAt: string;
};
Field	Type	Purpose
id	number	Unique client identifier
name	string	Displayed and included in search
email	string	Displayed and included in search
status	ClientStatus	Used for filtering and the status badge
joinedAt	ISO date string	Used for most-recently-joined sorting

The brief requires sorting by the most recently joined clients, but the example client object does not contain a join date. I will add joinedAt to the internal mock data and use it for sorting.

At least 30 clients will be added with a mixture of all three statuses and different join dates.

API route

The API route will be:

GET /api/clients

The route handler will be created at:

app/api/clients/route.ts

It will support:

search
status
sort
page

Example request:

/api/clients?search=john&status=active&sort=name&page=2

The route handler will:

Read the query parameters.
Normalize and validate them.
Filter clients by search.
Filter clients by status.
Sort the filtered results.
Paginate the sorted results.
Return the client data and pagination metadata.
Search behaviour

Search will:

Be trimmed.
Be case-insensitive.
Match partial names.
Match partial email addresses.

A search for john could match either a client's name or email address.

Status behaviour

Valid status values are:

active
cancelled
past_due

When no status is selected, all clients will be included.

Sort behaviour

Valid sort values are:

name
joined

name will sort clients alphabetically from A to Z.

joined will sort clients from newest to oldest.

If two clients have the same name or join date, id will be used as a secondary sort so the ordering stays stable across pages.

Pagination behaviour

The API will return 10 clients per page.

The response will follow the required shape:

{
  "data": [],
  "meta": {
    "current_page": 1,
    "total": 0,
    "per_page": 10,
    "last_page": 1
  }
}
URL state

The URL will store the applied:

Search value.
Status value.
Sort value.
Page number.

The Client Component will read these values with:

useSearchParams()

It will update the URL with:

useRouter()
usePathname()

The default values will be:

search = ""
status = ""
sort = "name"
page = 1

Default values will be omitted from the URL where possible.

The default page will therefore be:

/clients

rather than:

/clients?search=&status=&sort=name&page=1
Filter changes

Search, status, sort, and Clear filters will use:

router.replace()

Using replace prevents each filter change from adding another browser-history entry. This means pressing Back will not step through every search value or dropdown change.

Pagination

Previous and Next will use:

router.push()

Pagination should create browser-history entries. If the coach moves from page 1 to page 2, pressing Back should return them to page 1.

Resetting the page

Changing search, status, or sort will reset the page to 1.

Because page 1 is the default, the page query parameter will be removed.

Clear filters

Clear filters will:

Reset search.
Reset status.
Reset sort to name.
Reset page to 1.
Cancel any pending search debounce.
Remove all query parameters.
Navigate to /clients.
Search debounce

The search field needs to update immediately while the coach types, but the URL should only update after 300 ms.

A temporary local state value will be used for the text currently displayed in the search input. This does not replace the URL as the source of truth for the applied search.

The flow will be:

Read the current search value from the URL.
Set the search input from that value.
Update the input immediately when the coach types.
Start a 300 ms timer.
Cancel the previous timer when another character is entered.
Update the URL when the final timer finishes.
Reset page to 1.

If the coach types joh and then john within 200 ms, the first timer will be cancelled. Only one URL update will happen:

?search=john

The local input will also be synchronized when the URL changes through browser Back, browser Forward, Clear filters, or direct navigation.

SWR approach

SWR will be used to fetch the client list.

The fetcher will:

Call fetch.
Check whether the response was successful.
Parse the JSON response.
Throw an error if the request fails.

The SWR key will contain every applied filter and pagination value.

Example:

/api/clients?search=alice&status=active&sort=name&page=1

Changing any of the following will create a different cache key:

Search.
Status.
Sort.
Page.

For example:

/api/clients?search=alice&status=&sort=name&page=1
/api/clients?search=alice&status=cancelled&sort=name&page=1

These will be treated as different SWR requests and cache entries.

I will not intentionally keep the previous filter combination's results visible while a new request is loading. When no data exists for the current key, the loading skeleton will be displayed.

Libraries and packages
Next.js App Router

Used for:

Page routing.
API route handlers.
Server and Client Components.
Reading query parameters.
Updating browser navigation.
React

Used for:

Temporary search-input state.
Effects.
Event handlers.
Debounce cleanup.
SWR

Used for:

API fetching.
Dynamic cache keys.
Caching.
Loading and error handling.
Revalidation.
Tailwind CSS

Used for:

Page layout.
Inputs and dropdowns.
Client rows.
Status badges.
Pagination.
Loading skeletons.
Responsive styling.
Vitest

Used as the test runner.

React Testing Library

Used to test user-visible behaviour.

@testing-library/user-event

Used to simulate typing, dropdown changes, and button clicks.

jsdom

Used to provide a browser-like environment for tests.

@vitejs/plugin-react

Used to support React components in Vitest.

Testing approach

The required tests will be written before the implementation.

Search URL test

The test will:

Render the filter controls.
Type into the search input.
Advance the fake timer by 300 ms.
Confirm router.replace() receives a URL containing the final search parameter.
Debounce test

The test will:

Enable fake timers.
Type several characters quickly.
Confirm the URL is not updated immediately.
Advance less than 300 ms.
Confirm there is still no update.
Advance the timer to 300 ms.
Confirm only the final search value is written.
Clear filters test

The test will:

Start with search, status, sort, and page query parameters.
Click Clear filters.
Confirm navigation goes to /clients.
Confirm no query parameters remain.
Additional tests

I will also test:

Status changes update immediately.
Sort changes update immediately.
Filter changes reset the page.
Filter changes use router.replace().
Pagination uses router.push().
Previous is disabled on page 1.
Next is disabled on the final page.
Browser URL changes update the search input.
The SWR key includes all current values.
Edge cases
Empty search

An empty search will return all clients that match the selected status. The empty search parameter will be removed from the URL.

Search containing spaces

The API will trim the search value. A search containing only spaces will be treated as empty.

Search casing

Search will be case-insensitive, so JOHN, John, and john will return the same matches.

Invalid status

An unsupported status will be treated as All rather than causing the page to crash.

Invalid sort

An unsupported sort value will fall back to name.

Invalid page

Values such as 0, negative numbers, text, or decimals will fall back to page 1.

Page beyond the final page

A requested page beyond the final page will be clamped to the last valid page.

When no clients match, the API will return page 1 and a last page of 1.

No matching clients

The page will show a simple empty state and disable pagination.

One page of results

Previous and Next will both be disabled when the results only have one page.

Filter change while a search debounce is pending

Status and sort changes will update immediately. The pending search update will still happen after 300 ms and must preserve the latest dropdown values.

The query-update helper will build changes from the latest URL parameters so one update does not remove another.

Clear filters while a debounce is pending

The pending timer will be cancelled. This prevents the old search value from being written back into the URL after Clear filters has been clicked.

Component unmounting

The debounce timer will be cleared when the component unmounts.

Browser Back and Forward

All controls must reflect changes made through browser navigation. The search input will be synchronized with the URL whenever the URL search value changes.

API failure

The page will keep the current filters visible and show an error message. A failed request will not clear or change the URL state.

Stale data

Each filter combination will use a different SWR key. Results from one combination will not be treated as results for another combination.

Duplicate names or join dates

The API will use the client ID as a secondary sort so the order remains stable across pages.

Decisions made for unclear requirements
Default sort

The brief does not explicitly state the default sort.

I will use:

name

This is the first option listed and provides a predictable default order.

Client page route

The API route is provided, but the page route is not.

I will use:

/clients
Join date field

The sample client response does not include a join date, but sorting by most recently joined requires one.

I will include joinedAt in the internal mock data. It will be used for sorting but does not need to be displayed.

Default parameters

Default values will be omitted from the URL. /clients will represent empty search, all statuses, name sorting, and page 1.

Router methods

I will use:

router.replace() for filter changes.
router.push() for pagination.
Temporary local state

Local state will only hold the search text while the debounce is pending. The URL will remain the source of truth for the applied filters and SWR key.

Suspense

The Client Component using useSearchParams will be wrapped in <Suspense> by the Server Component page.

Implementation order
Create the project and install the required packages.
Configure Vitest and React Testing Library.
Add shared client and API response types.
Write the required failing tests.
Add the mock client data.
Build the /api/clients route.
Build the page and Suspense boundary.
Build the filters and URL update helper.
Add the 300 ms search debounce.
Add the SWR key and data fetching.
Build the client list and status badges.
Add loading, empty, and error states.
Add pagination.
Make the tests pass.
Run tests, linting, type checks, and the production build.
Add failing and passing terminal output to BEFORE-AFTER.md.