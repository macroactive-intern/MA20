# Before / After

## BEFORE — failing tests (component not yet implemented)

```
> filtered-client-list@0.1.0 test
> vitest run

 RUN  v4.1.10 C:/Users/mccor/Desktop/Projects/MacroActive/MA20/filtered-client-list

 ❯ tests/client-list-page.test.tsx (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/client-list-page.test.tsx [ tests/client-list-page.test.tsx ]
Error: Failed to resolve import "@/components/clients/ClientListPage" from "tests/client-list-page.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/mccor/Desktop/Projects/MacroActive/MA20/filtered-client-list/tests/client-list-page.test.tsx:6:0

 Test Files  1 failed (1)
      Tests  no tests
   Start at  10:11:00
   Duration  1.60s (transform 0ms, setup 0ms, import 0ms, tests 0ms, environment 1.34s)
```

---

## AFTER (Step 9) — 10/15 passing, 5 expected failures

_5 remaining failures are intentional: pagination buttons (Step 13) and SWR integration (Step 10) not yet built._

```
 RUN  v4.1.10 C:/Users/mccor/Desktop/Projects/MacroActive/MA20/filtered-client-list

 ❯ tests/client-list-page.test.tsx (15 tests | 5 failed) 649ms
     × uses router.push when clicking Next
     × uses router.push when clicking Previous
     × disables the Previous button on page 1
     × disables the Next button on the last page
     × includes all active filter and page values

 FAIL  tests/client-list-page.test.tsx > pagination > uses router.push when clicking Next
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name `/next/i`
 → Pagination component not yet implemented (Step 13)

 FAIL  tests/client-list-page.test.tsx > pagination > uses router.push when clicking Previous
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name `/previous/i`
 → Pagination component not yet implemented (Step 13)

 FAIL  tests/client-list-page.test.tsx > pagination > disables the Previous button on page 1
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name `/previous/i`
 → Pagination component not yet implemented (Step 13)

 FAIL  tests/client-list-page.test.tsx > pagination > disables the Next button on the last page
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name `/next/i`
 → Pagination component not yet implemented (Step 13)

 FAIL  tests/client-list-page.test.tsx > SWR cache key > includes all active filter and page values
TypeError: Cannot read properties of undefined (reading '0')
 → useSWR not yet called in ClientListPage (Step 10)

 Test Files  1 failed (1)
      Tests  5 failed | 10 passed (15)
   Start at  10:49:26
   Duration  2.11s (transform 75ms, setup 0ms, import 298ms, tests 649ms, environment 989ms)
```

---

## AFTER (Step 14) — all 15 tests passing

```
 RUN  v4.1.10 C:/Users/mccor/Desktop/Projects/MacroActive/MA20/filtered-client-list

 ✓ tests/client-list-page.test.tsx > search debounce > updates the URL with the typed value after 300 ms 108ms
 ✓ tests/client-list-page.test.tsx > search debounce > does not update the URL before 300 ms have elapsed 16ms
 ✓ tests/client-list-page.test.tsx > search debounce > fires only once after rapid keystrokes 11ms
 ✓ tests/client-list-page.test.tsx > Clear filters > navigates to /clients with no query string 58ms
 ✓ tests/client-list-page.test.tsx > status filter > updates the URL immediately on change 63ms
 ✓ tests/client-list-page.test.tsx > status filter > uses router.replace, not router.push 62ms
 ✓ tests/client-list-page.test.tsx > status filter > resets the page to 1 (removes page param) on change 51ms
 ✓ tests/client-list-page.test.tsx > sort filter > updates the URL immediately on change 63ms
 ✓ tests/client-list-page.test.tsx > sort filter > resets the page to 1 (removes page param) on change 59ms
 ✓ tests/client-list-page.test.tsx > pagination > uses router.push when clicking Next 62ms
 ✓ tests/client-list-page.test.tsx > pagination > uses router.push when clicking Previous 63ms
 ✓ tests/client-list-page.test.tsx > pagination > disables the Previous button on page 1 8ms
 ✓ tests/client-list-page.test.tsx > pagination > disables the Next button on the last page 7ms
 ✓ tests/client-list-page.test.tsx > URL → input sync > populates the search input from the URL on render 7ms
 ✓ tests/client-list-page.test.tsx > SWR cache key > includes all active filter and page values 3ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  11:02:27
   Duration  1.91s (transform 94ms, setup 0ms, import 287ms, tests 644ms, environment 812ms)
```
