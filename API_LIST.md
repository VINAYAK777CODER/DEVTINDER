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
  <!-- - status -> interested or ignored -->
- POST /request/review/:status/:requestId
  <!-- - status -> accepted or rejected  -->
## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profiles of other users on platform

Status: ignore, interested, accepeted, rejected
