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

                1. Set up test utilities
                                Configure Testing Library
                                Add jsdom setup if needed
                                Mock fetch where required
                                Clear localStorage between tests

                2. Write failing tests first
                                Test Next does not advance if required fields are empty
                                Test Back preserves Step 2 data
                                Test wizard state saves to localStorage on step change

                3. Run tests and capture failing output
                                Add failing output to BEFORE-AFTER.md

                4. Implement/fix code until tests pass
                5. Commit tests and implementation
                                First failing test commit if required by workflow
                                Then passing implementation commit

                                                                                                        90 mins

----------------------------------------------------------------------------------------------------------------

Step 5

    API route implementation

                1. Create route handler
                                File: app/api/onboarding/route.ts
                
                2. Implement POST handler
                                Parse JSON request body
                                Validate required fields
                                Store submitted data in module-level variable
                                Return success JSON on valid request
                                Return error JSON on invalid request
                
                3. helper
                                Add GET route for debugging stored submission, only if useful
                
                4. Test API manually
                                Submit valid payload
                                Submit invalid payload
                                Confirm response shape matches brief

                                                                                                        40 mins

----------------------------------------------------------------------------------------------------------------

Step 6                

    Wizard implementation

                1. Create type definitions
                                Define OnboardingFormData
                                Define step field groups
                                Define allowed values for goal and macro split
                
                2. Build parent wizard
                                Add use client
                                Add default empty form data
                                Add currentStep
                                Add errors
                                Add isSubmitting
                                Add submitError
                                Add successMessage
                
                3. Build progress indicator
                                Display Step X of 3
                
                4. Build Step 1 form
                                First name input
                                Last name input
                                Date of birth input
                                Timezone input/select
                                Display field errors
                
                5. Build Step 2 form
                                Goal select
                                Activity level select/input
                                Current weight input
                                Height input
                                Display field errors
                
                6. Build Step 3 form
                                Macro split select
                                Dietary restrictions textarea
                                Display field errors
                
                7. Build navigation
                                Hide/disable Back on Step 1
                                Show Next on Step 1 and Step 2
                                Show Finish on Step 3
                                Back decreases step
                                Next validates current step before advancing
                                Finish validates Step 3 and submits all data
                
                8. Preserve data between steps
                                Ensure Step 2 values stay populated after Back to Step 1 and forward again
                
                9. Add draft save
                                Save wizard state to localStorage when form data or step changes
                                Restore wizard state on first client load
                                Clear draft after successful submission
                
                10. Add submission behavior
                                Send one fetch('/api/onboarding') call
                                Use method POST
                                Send complete profile JSON
                                Show API error on failure
                                Do not reset data on failure
                                Clear draft on success
                                                                                                        90 mins

----------------------------------------------------------------------------------------------------------------

Step 7

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

Step 8

    Quality checks
                                                                                                    30 mins

----------------------------------------------------------------------------------------------------------------

Step 9

    BEFORE-AFTER.md
                                                                                                    30 mins

----------------------------------------------------------------------------------------------------------------

                                                                                                    7.8 hrs

---------------------------------------------------------------------------------------------------------------- 

Step	Task	Estimate
1	Create Next.js project and connect GitHub	10 min
2	Complete UNDERSTANDING.md, manual estimate, AI estimate, reconciliation, and APPROACH.md	120 min
3	Install SWR/testing packages and configure Vitest	20 min
4	Write failing URL-state, debounce, and Clear filters tests	75 min
5	Build mock /api/clients route with filtering, sorting, pagination, and 30+ clients	60 min
6	Build filter controls, URL state, debounce, SWR fetching, list, skeleton, and pagination	120 min
7	Make tests pass and manually test browser history/shareable URLs	60 min
8	Run lint, TypeScript, tests, and production build	30 min
9	Complete BEFORE-AFTER.md and final acceptance-criteria review	30 min
	Total	525 min
Estimated total

8 hours 45 minutes

I would quote it as approximately 9 hours to allow a small buffer for mocking Next.js navigation hooks, fake-timer issues, and Suspense-related test setup.

Reconciliation

My manual estimate came to 7 hours 50 minutes, while the AI estimate came to 8 hours 45 minutes.

The AI estimate is a little higher because it gives more room for the parts of the task that could take longer than expected, mainly the URL state, debounce testing, SWR cache keys, and mocking the Next.js router in tests.

I think my manual estimate is still realistic if everything goes smoothly, but it may be a bit tight if I run into issues with fake timers, browser history behaviour, or keeping the search input in sync with the URL.

After comparing both estimates, I think a fair final estimate is:

8 hours 30 minutes

I would round this up to around 9 hours to give myself a small buffer for debugging and final checks.