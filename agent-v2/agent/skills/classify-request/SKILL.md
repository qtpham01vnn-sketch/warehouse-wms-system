# classify-request

Goal:
Classify the user's request.

Output:
- app
- landing
- prompt
- full_package

Rules:
- If user asks for system → app
- If user asks for page → landing
- If user asks for prompt → prompt
- If multiple outputs → full_package