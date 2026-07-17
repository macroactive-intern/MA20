What is the task asking me to build?

Build a Next.js App Router page that displays a paginated list of clients loaded from a mock API.

A coach must be able to:

- Search clients by name or email.
- Filter clients by status.
- Sort clients alphabetically or by most recent join date.
- Move between result pages.
- Clear all filters.
- Share or refresh the current URL without losing the selected filters or page.

The URL is the source of truth for the applied search, status, sort, and page values. The page must read its initial state from the URL and update the URL when the coach changes the controls.

The project must also include a mock API route, at least 30 seeded clients, SWR data fetching, a loading skeleton, and tests for URL updates, debouncing, and clearing filters.

----------------------------------------------------------------------------------------------------------------------------------

Evaluation of the previous developer's note

The previous developer's `useState` approach does **not** satisfy the acceptance criteria.

Using only component state would make the controls easier to prototype, but the selected values would disappear on refresh and would not be included in a copied URL. A colleague opening the shared link would therefore see the default list instead of the sender's filtered list.

the brief, explicitly says the page **must be shareable**.

The applied filter state must therefore come from URL query parameters. A small amount of temporary local state may still be needed to display search text immediately while the 300 ms debounce is running, but that local value must not become the canonical applied filter state. After the debounce, the URL becomes the source of truth for the search used by SWR.

----------------------------------------------------------------------------------------------------------------------------------

## Inputs

### URL query parameters

| Parameter | Expected values | Default |
|---|---|---|
| `search` | Any search string | Empty search |
| `status` | `active`, `cancelled`, or `past_due` | All statuses |
| `sort` | `name` or `joined` | Assumed to be `name` |
| `page` | Positive integer | `1` |


### User interactions

- A search text field.
- A status dropdown.
- A sort dropdown.
- Previous and Next buttons.
- A Clear filters button.
- Browser Back and Forward navigation.

### API request

The client sends the current URL-derived values to:

```text
GET /api/clients?search=john&status=active&sort=name&page=1
```

The API filters, sorts, and paginates the seeded client records.

-----------------------------------------------------------

The page displays:

- The current search value.
- The currently selected status.
- The currently selected sort option.
- A paginated list of clients.
- Each client's name, email address, and status badge.
- Previous and Next pagination buttons.
- A Clear filters button.
- A loading skeleton while the current SWR request is unresolved.

The API returns:

```json
{
  "data": [
    {
      "id": 1,
      "name": "John Smith",
      "email": "john@example.com",
      "status": "active"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 1,
    "per_page": 10,
    "last_page": 1
  }
}
```

The API needs an internal join-date value for every seeded client so that `sort=joined` can mean “most recently joined,”

----------------------------------------------------------------------------------------------------------------------------------

## URL state and router behaviour

### Reading query parameters

Because App Router pages are Server Components by default, the component calling `useSearchParams` must be a Client Component.

For a statically rendered App Router route, a component using `useSearchParams` should be placed below a `<Suspense>` boundary. The page can remain a Server Component that renders the interactive Client Component inside `<Suspense>`. The fallback can use the same loading-skeleton presentation required by the brief.

-----------------------------------------------------------

### Writing query parameters

Filter changes should use `router.replace()`:

- Debounced search updates use `replace`.
- Status changes use `replace`.
- Sort changes use `replace`.
- Clear filters uses `replace`.

`replace` updates the current browser-history entry rather than adding a new entry for every filter edit. This prevents the browser Back button from stepping through old search strings and dropdown changes.

Pagination should use `router.push()` because page navigation should create history entries. If a coach moves from page 1 to page 2, pressing the browser Back button should return to page 1.

All filter changes reset `page` to 1. Since page 1 is the default, its query parameter may be omitted from the canonical URL.

-----------------------------------------------------------

## Debounce interpretation

The search field waits 300 ms after the most recent keystroke before updating the URL.

For example, if the user types `joh` and then `john` within 200 ms:

- The first pending update is cancelled.
- Only one URL update occurs.
- The final update writes `search=john`.

Status and sort changes are not debounced and update the URL immediately.

The search input may use temporary local text state so the field responds immediately while typing. This is not the same as storing the page's applied filter state in `useState`; the applied search used for fetching remains URL-derived.

-----------------------------------------------------------

## SWR cache-key behaviour

SWR must receive a key containing the complete normalized filter combination.

Example keys:

```text
/api/clients?search=alice&status=&sort=name&page=1
/api/clients?search=alice&status=cancelled&sort=name&page=1
```

These are different cache keys, so changing status cannot incorrectly reuse the response from the previous filter combination.

Changing any of these values must change the key:

- Search
- Status
- Sort
- Page

----------------------------------------------------------------------------------------------------------------------

Questions and ambiguities

What is the default sort?

`name` is the default because it is the first listed sort option and gives a predictable initial list

-----------------------------------------------------------

Should default values appear in the URL?

Empty and default values are omitted. `/clients` represents empty search, all statuses, name sorting, and page 1. Non-default applied state is written explicitly.

-----------------------------------------------------------

What page route should contain the list?

Use `/clients`, as that is the clearest route for the feature. The root route could redirect to it or remain unused.

-----------------------------------------------------------

What field represents the join date?

Seed an internal `joinedAt` value for each mock client and sort it descending for `sort=joined`. It does not need to be displayed unless later requested.

-----------------------------------------------------------

How should equal sort values be ordered?

Use `id` as a deterministic secondary sort so pagination remains stable.

-----------------------------------------------------------

Is search case-sensitive?

Search is case-insensitive, trims surrounding whitespace, and checks both name and email.

-----------------------------------------------------------

How should invalid query values be handled?

Treat unsupported status as All, unsupported sort as `name`, and invalid or non-positive page values as page 1. The URL may be normalized during interaction, but the page must not crash when opened with malformed values.

-----------------------------------------------------------

What happens when the requested page is greater than `last_page`?

The API should return a safe response rather than erroring. Whether it clamps to the final page or returns an empty page is not specified. Clamping is more user-friendly, but this should be confirmed before implementation.

-----------------------------------------------------------

What should happen when there are no matching clients?

Show a simple “No clients found” message and keep the filter controls available.

-----------------------------------------------------------

What should happen if the API request fails?

Show a small error state with a retry action or allow SWR retry behaviour. The exact design is not part of the acceptance criteria.

-----------------------------------------------------------

Can transient search text use `useState`?

Temporary input state is allowed only for the text currently being typed. The URL remains the canonical applied filter state and drives the SWR key. The local value must also resynchronise when browser Back, Forward, or Clear filters changes the URL.

-----------------------------------------------------------

What happens if a dropdown changes while a search debounce is pending?

Status updates immediately, and the pending search update applies when its debounce completes. Both updates must preserve the other current parameters and reset page to 1.

-----------------------------------------------------------

Should unrelated query parameters be preserved?

Filter updates preserve recognized filter parameters. Clear filters removes the full query string as explicitly required.

-----------------------------------------------------------

Is a separate API test required?

Component tests are mandatory. API filtering and pagination tests would improve confidence but are not explicitly required.

-----------------------------------------------------------

What exact loading skeleton is expected?

Render several client-row placeholders with blocks representing name, email, and status.

----------------------------------------------------------------------------------------------------------------------

## Behavioural assumptions

The implementation will proceed with these defaults unless clarified:

- Initial route: `/clients`
- Empty search: no `search` parameter
- All statuses: no `status` parameter
- Default sort: `name`, with no `sort` parameter
- First page: page 1, with no `page` parameter
- Page size: 10
- Name sort: ascending
- Joined sort: newest first
- Search: trimmed, case-insensitive partial match against name and email
- Filter updates: `router.replace()`
- Pagination updates: `router.push()`
- Every filter change: reset to page 1
- SWR key: complete normalized API URL
- Previous data from a different key: not intentionally retained
- Search debounce: one update 300 ms after the final keystroke
- Clear filters: navigate to `/clients` with no query string
- `useSearchParams` component: Client Component wrapped by a Server Component `<Suspense>` boundary
- Invalid URL values: safely fall back to defaults
