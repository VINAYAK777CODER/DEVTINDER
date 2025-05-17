# DevTinder APIs


## auth router
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/changePassword // Forgot password API
## connectionRequestRouter
- POST /request/send/:status/:userId
<!-- - POST /request/send/ignored/:userId -->
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId
## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profiles of other users on platform


Status: ignore, interested, accepeted, rejected

