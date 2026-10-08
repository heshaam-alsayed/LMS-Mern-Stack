export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "LMS API",
    version: "1.0.0",
    description: `API documentation for the Learning Management System backend.

**Authentication** is cookie-based. After a successful login the API sets two httpOnly cookies:
- \`access_token\` - short-lived JWT used to authorize requests
- \`refresh_token\` - rotated on every \`POST /auth/refresh-token\`

Swagger UI cannot silently share the app cookies, but for "Try it out" you can paste an
\`access_token\` cookie value under the CookieAuth security scheme (in the cookie field of
your browser devtools) and send the request with credentials, or use the docs in read mode.`,
  },
  servers: [
    {
      url: "https://lms-backend-uig3.onrender.com/api/v1",
      description: "Production (Render)",
    },
    {
      url: "http://localhost:4000/api/v1",
      description: "Local development",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication, account activation and password flows" },
    { name: "Users", description: "Profile, password, avatar and admin user management" },
    { name: "Courses", description: "Course catalog, content, Q&A, reviews and progress" },
    { name: "Orders", description: "Order and revenue analytics (admin)" },
    { name: "Notifications", description: "Admin/instructor notifications" },
    { name: "Layouts", description: "Hero banner, FAQ and category layouts" },
    { name: "Categories", description: "Course categories" },
    { name: "Payments", description: "Stripe publishable key, payment intents and webhooks" },
    { name: "Certificates", description: "Course completion certificates" },
    { name: "Instructor Applications", description: "Apply to become an instructor / manage organization applications" },
    { name: "Organizations", description: "Organization management, analytics and student/course data" },
    { name: "VdoCipher", description: "VdoCipher upload credentials and video status" },
    { name: "Tickets", description: "Support tickets and messages" },
  ],
  paths: {
    // ---------------------------------------------------------------- Auth
    "/auth/registration": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description: "Sends an activation email and returns a verification token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegistrationBody" },
            },
          },
        },
        responses: {
          "201": { description: "Verification email sent" },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/auth/activate-user": {
      post: {
        tags: ["Auth"],
        summary: "Activate a user account",
        description: "Verifies the activation token and code sent by email.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ActivationBody" },
            },
          },
        },
        responses: {
          "201": { description: "Account activated" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/auth/login-user": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        description: "Sets access_token and refresh_token httpOnly cookies.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginBody" },
            },
          },
        },
        responses: {
          "200": {
            description: "Logged in",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/auth/logout-user": {
      post: {
        tags: ["Auth"],
        summary: "Logout",
        description: "Clears the auth cookies and removes the user session from Redis.",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "Logged out" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        description: "Rotates the refresh_token cookie and issues a new access_token.",
        responses: {
          "200": {
            description: "New tokens issued",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    accessToken: { type: "string" },
                    refreshToken: { type: "string" },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/auth/social-auth": {
      post: {
        tags: ["Auth"],
        summary: "Login/register with Google or GitHub",
        description: "Creates the user if needed and returns tokens in the response body.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SocialAuthBody" },
            },
          },
        },
        responses: {
          "200": { description: "Social login successful" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request a password reset email",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ForgotPasswordBody" },
            },
          },
        },
        responses: {
          "200": { description: "Reset link sent (if the email is registered)" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset the password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ResetPasswordBody" },
            },
          },
        },
        responses: {
          "200": { description: "Password reset successfully" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },

    // ---------------------------------------------------------------- Users
    "/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get the current user",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": {
            description: "Current user",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/users/update-me": {
      patch: {
        tags: ["Users"],
        summary: "Update profile info (name, email, phone)",
        security: [{ CookieAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserInfoBody" },
            },
          },
        },
        responses: {
          "200": { description: "Updated user" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/users/update-password": {
      patch: {
        tags: ["Users"],
        summary: "Change the account password",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePasswordBody" },
            },
          },
        },
        responses: {
          "200": { description: "Password updated" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/users/update-avatar": {
      patch: {
        tags: ["Users"],
        summary: "Update the avatar",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateAvatarBody" },
            },
          },
        },
        responses: {
          "200": { description: "Avatar updated" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/users/analytics/statistics": {
      get: {
        tags: ["Users"],
        summary: "User statistics (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/users/monthly-analytics": {
      get: {
        tags: ["Users"],
        summary: "Monthly user growth (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/users/operation-user/{userId}": {
      get: {
        tags: ["Users"],
        summary: "Full user record for admin operations (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UserIdParam" }],
        responses: {
          "200": { description: "User record" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/users/change-role": {
      patch: {
        tags: ["Users"],
        summary: "Change a user's role (admin)",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ChangeRoleBody" },
            },
          },
        },
        responses: {
          "200": { description: "Role updated" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/users/toggle-user-deleted/{id}": {
      patch: {
        tags: ["Users"],
        summary: "Soft delete / restore a user (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": { description: "User toggle updated" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get a public user profile",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": { description: "User profile" },
          "404": { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "List of users" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create a member (admin)",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateMemberBody" },
            },
          },
        },
        responses: {
          "201": { description: "Member created" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },

    // ---------------------------------------------------------------- Courses
    "/courses/public-courses": {
      get: {
        tags: ["Courses"],
        summary: "Get all public courses",
        responses: {
          "200": { description: "List of courses" },
        },
      },
    },
    "/courses/latest-reviews": {
      get: {
        tags: ["Courses"],
        summary: "Get the latest public reviews",
        responses: {
          "200": { description: "Latest reviews" },
        },
      },
    },
    "/courses/public-course/{id}": {
      get: {
        tags: ["Courses"],
        summary: "Get a public course (draft data stripped)",
        parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
        responses: {
          "200": { description: "Public course" },
          "404": { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/courses/content-course/{id}": {
      get: {
        tags: ["Courses"],
        summary: "Get course content (purchased user)",
        description: "Returns the full content for the requesting user's enrolled course.",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
        responses: {
          "200": { description: "Course content" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/courses/courseProgress/my-courses": {
      get: {
        tags: ["Courses"],
        summary: "Get progress for all enrolled courses",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "Course progress list" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/courses/{courseId}/progress": {
      get: {
        tags: ["Courses"],
        summary: "Get progress for one course",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
        responses: {
          "200": { description: "Course progress" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/courses/{courseId}/progress/current-lecture": {
      patch: {
        tags: ["Courses"],
        summary: "Update the current lecture",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["lectureId"],
                properties: { lectureId: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "200": { description: "Current lecture updated" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/courses/{courseId}/progress/complete": {
      patch: {
        tags: ["Courses"],
        summary: "Mark a lecture as completed",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["lectureId"],
                properties: { lectureId: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "200": { description: "Lecture completed" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/courses/add-question": {
      put: {
        tags: ["Courses"],
        summary: "Add a question to a lesson",
        description: "Requires an enrolled user.",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddQuestionBody" },
            },
          },
        },
        responses: {
          "200": { description: "Question added" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/courses/add-answer": {
      put: {
        tags: ["Courses"],
        summary: "Answer a lesson question (admin or instructor)",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddAnswerBody" },
            },
          },
        },
        responses: {
          "200": { description: "Answer added" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/courses/add-review/{id}": {
      put: {
        tags: ["Courses"],
        summary: "Add or update a course review (purchased users)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddReviewBody" },
            },
          },
        },
        responses: {
          "200": { description: "Review added" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/courses/add-reply-review": {
      post: {
        tags: ["Courses"],
        summary: "Reply to a review (admin or instructor)",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddReplyReviewBody" },
            },
          },
        },
        responses: {
          "201": { description: "Reply added" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/courses/getVdoCipherOTP": {
      post: {
        tags: ["Courses"],
        summary: "Generate a VdoCipher OTP for a video",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["videoId"],
                properties: { videoId: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "200": { description: "OTP payload" },
        },
      },
    },
    "/courses": {
      get: {
        tags: ["Courses"],
        summary: "List all courses (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "List of courses" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/courses/create-course": {
      post: {
        tags: ["Courses"],
        summary: "Create a course (admin)",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCourseBody" },
            },
          },
        },
        responses: {
          "201": { description: "Course created" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/courses/monthly-analytics": {
      get: {
        tags: ["Courses"],
        summary: "Monthly courses analytics (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/courses/analytics/statistics": {
      get: {
        tags: ["Courses"],
        summary: "Courses statistics (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/courses/top-selling": {
      get: {
        tags: ["Courses"],
        summary: "Top selling courses (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "Top selling courses" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/courses/purchases": {
      get: {
        tags: ["Courses"],
        summary: "All course purchases (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "Purchases list" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/courses/operation-course/{courseId}": {
      get: {
        tags: ["Courses"],
        summary: "Full course record for admin operations (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CourseIdPathParam" }],
        responses: {
          "200": { description: "Course record" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/courses/{id}/purchases": {
      get: {
        tags: ["Courses"],
        summary: "Purchases for one course (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": { description: "Purchases for the course" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/courses/edit-course/{id}": {
      patch: {
        tags: ["Courses"],
        summary: "Update a course (owner instructor or admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCourseBody" },
            },
          },
        },
        responses: {
          "200": { description: "Course updated" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/courses/{id}": {
      get: {
        tags: ["Courses"],
        summary: "Get a course by ID (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": { description: "Course (admin view)" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },

    // ---------------------------------------------------------------- Orders
    "/orders/monthly-analytics": {
      get: {
        tags: ["Orders"],
        summary: "Monthly orders analytics (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/orders/revenue-analytics": {
      get: {
        tags: ["Orders"],
        summary: "Revenue analytics (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/orders/analytics/statistics": {
      get: {
        tags: ["Orders"],
        summary: "Orders statistics (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/orders/monthly-growth": {
      get: {
        tags: ["Orders"],
        summary: "Monthly growth analytics (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/orders": {
      get: {
        tags: ["Orders"],
        summary: "List all orders (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "List of orders" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },

    // ---------------------------------------------------------------- Notifications
    "/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "Get all notifications (admin or instructor)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "List of notifications" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/notifications/update/{id}": {
      patch: {
        tags: ["Notifications"],
        summary: "Mark a notification as read (admin or instructor)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": { description: "Notification updated" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },

    // ---------------------------------------------------------------- Layouts
    "/layouts": {
      get: {
        tags: ["Layouts"],
        summary: "Get all layouts (public)",
        responses: {
          "200": { description: "Layouts" },
        },
      },
    },
    "/layouts/hero-stats": {
      get: {
        tags: ["Layouts"],
        summary: "Get hero statistics (public)",
        responses: {
          "200": { description: "Hero stats" },
        },
      },
    },
    "/layouts/{type}": {
      get: {
        tags: ["Layouts"],
        summary: "Get a layout by type (public)",
        parameters: [
          {
            name: "type",
            in: "path",
            required: true,
            schema: { type: "string", enum: ["Banner", "FAQ", "Categories"] },
          },
        ],
        responses: {
          "200": { description: "Layout" },
        },
      },
    },
    "/layouts/create-layout": {
      post: {
        tags: ["Layouts"],
        summary: "Create a layout (admin)",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LayoutBody" },
            },
          },
        },
        responses: {
          "201": { description: "Layout created" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/layouts/update-layout": {
      put: {
        tags: ["Layouts"],
        summary: "Update a layout (admin)",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LayoutBody" },
            },
          },
        },
        responses: {
          "200": { description: "Layout updated" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },

    // ---------------------------------------------------------------- Categories
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "Get all categories (public)",
        responses: {
          "200": { description: "List of categories" },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Create a category (admin)",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoryBody" },
            },
          },
        },
        responses: {
          "201": { description: "Category created" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/categories/{categoryId}": {
      get: {
        tags: ["Categories"],
        summary: "Get a category by ID (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CategoryIdParam" }],
        responses: {
          "200": { description: "Category" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
      patch: {
        tags: ["Categories"],
        summary: "Update a category (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CategoryIdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoryBody" },
            },
          },
        },
        responses: {
          "200": { description: "Category updated" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete a category (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CategoryIdParam" }],
        responses: {
          "200": { description: "Category deleted" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },

    // ---------------------------------------------------------------- Payments
    "/payment/stripepublishablekey": {
      get: {
        tags: ["Payments"],
        summary: "Get the Stripe publishable key",
        responses: {
          "200": {
            description: "Publishable key",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    publishableKey: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/payment/create-intent": {
      post: {
        tags: ["Payments"],
        summary: "Create a Stripe PaymentIntent for a course",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PaymentIntentBody" },
            },
          },
        },
        responses: {
          "200": {
            description: "Client secret",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    clientSecret: { type: "string" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/payment/webhook": {
      post: {
        tags: ["Payments"],
        summary: "Stripe webhook",
        description: "Consumes raw JSON. Called by Stripe with a Stripe-Signature header.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string" },
                  data: { type: "object", additionalProperties: true },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Webhook received" },
          "400": { description: "Invalid signature" },
        },
      },
    },

    // ---------------------------------------------------------------- Certificates
    "/certificates/generate/{courseId}": {
      post: {
        tags: ["Certificates"],
        summary: "Generate a completion certificate",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
        responses: {
          "201": { description: "Certificate generated" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/certificates/verify/{courseId}": {
      get: {
        tags: ["Certificates"],
        summary: "Get the certificate for a completed course",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
        responses: {
          "200": { description: "Certificate" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/certificates/all": {
      get: {
        tags: ["Certificates"],
        summary: "Get all certificates (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "List of certificates" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },

    // ---------------------------------------------------------------- Instructor Applications
    "/instructor-applications": {
      post: {
        tags: ["Instructor Applications"],
        summary: "Apply to become an instructor",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/InstructorApplicationBody" },
            },
          },
        },
        responses: {
          "201": { description: "Application submitted" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/instructor-applications/status": {
      get: {
        tags: ["Instructor Applications"],
        summary: "Check the application status by email",
        parameters: [{ $ref: "#/components/parameters/EmailQueryParam" }],
        responses: {
          "200": { description: "Application status" },
          "404": { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/instructor-applications/admin": {
      get: {
        tags: ["Instructor Applications"],
        summary: "List all applications (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "List of applications" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/instructor-applications/admin/{id}": {
      get: {
        tags: ["Instructor Applications"],
        summary: "Get one application (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": { description: "Application" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/instructor-applications/admin/{id}/approve": {
      patch: {
        tags: ["Instructor Applications"],
        summary: "Approve an application (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": { description: "Application approved" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/instructor-applications/admin/{id}/reject": {
      patch: {
        tags: ["Instructor Applications"],
        summary: "Reject an application (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  rejectionReason: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Application rejected" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },

    // ---------------------------------------------------------------- Organizations
    "/organizations": {
      get: {
        tags: ["Organizations"],
        summary: "List all organizations (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "List of organizations" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/my-organization": {
      get: {
        tags: ["Organizations"],
        summary: "Get the instructor's own organization",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "Organization" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/dashboard-statistics": {
      get: {
        tags: ["Organizations"],
        summary: "Organization dashboard statistics (instructor)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/courses-performance": {
      get: {
        tags: ["Organizations"],
        summary: "Courses performance (instructor)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/course-orders-analytics": {
      get: {
        tags: ["Organizations"],
        summary: "Course orders analytics (instructor or admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/recent-enrollments": {
      get: {
        tags: ["Organizations"],
        summary: "Recent enrollments (instructor)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "Recent enrollments" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/recent-reviews": {
      get: {
        tags: ["Organizations"],
        summary: "Recent reviews (instructor)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "Recent reviews" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/course/{courseId}": {
      get: {
        tags: ["Organizations"],
        summary: "Get one of the instructor's courses",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
        responses: {
          "200": { description: "Course" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/orders": {
      get: {
        tags: ["Organizations"],
        summary: "Organization orders (instructor)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "Orders" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/students": {
      get: {
        tags: ["Organizations"],
        summary: "Organization students (instructor)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "Students" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/student-progress/{studentId}": {
      get: {
        tags: ["Organizations"],
        summary: "One student's progress (instructor)",
        security: [{ CookieAuth: [] }],
        parameters: [
          {
            name: "studentId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Student progress" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/course-detail/{courseId}": {
      get: {
        tags: ["Organizations"],
        summary: "Organization course detail (instructor)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/CourseIdParam" }],
        responses: {
          "200": { description: "Course detail" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/certificates": {
      get: {
        tags: ["Organizations"],
        summary: "Organization certificates (instructor)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "Certificates" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/courses-analytics": {
      get: {
        tags: ["Organizations"],
        summary: "Organization courses analytics (instructor)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/orders-analytics": {
      get: {
        tags: ["Organizations"],
        summary: "Organization orders analytics (instructor)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/{id}/courses": {
      get: {
        tags: ["Organizations"],
        summary: "Courses of an organization (instructor for own org)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": { description: "Courses" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/{id}": {
      get: {
        tags: ["Organizations"],
        summary: "Get an organization (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": { description: "Organization" },
          "400": { $ref: "#/components/responses/BadRequest" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/Error" },
        },
      },
      patch: {
        tags: ["Organizations"],
        summary: "Update an organization (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  status: { type: "string", enum: ["active", "suspended"] },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Organization updated" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
      delete: {
        tags: ["Organizations"],
        summary: "Delete an organization (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": { description: "Organization deleted" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/{id}/courses-analytics": {
      get: {
        tags: ["Organizations"],
        summary: "Courses analytics for an organization (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/{id}/orders-analytics": {
      get: {
        tags: ["Organizations"],
        summary: "Orders analytics for an organization (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": { $ref: "#/components/responses/Analytics" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizations/{id}/instructor": {
      get: {
        tags: ["Organizations"],
        summary: "Instructor of an organization (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": { description: "Instructor" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },

    // ---------------------------------------------------------------- VdoCipher
    "/vdocipher/upload/credentials": {
      post: {
        tags: ["VdoCipher"],
        summary: "Get VdoCipher upload credentials (instructor or admin)",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: { title: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "200": { description: "Upload credentials" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/vdocipher/video/status": {
      post: {
        tags: ["VdoCipher"],
        summary: "Get video processing status (instructor or admin)",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["videoId"],
                properties: { videoId: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "200": { description: "Video status" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },

    // ---------------------------------------------------------------- Tickets
    "/tickets": {
      post: {
        tags: ["Tickets"],
        summary: "Create a support ticket",
        description: "Public. Accepts up to 5 attachment files under the `attachments` field.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["email", "subject", "category", "message"],
                properties: {
                  email: { type: "string", format: "email" },
                  subject: { type: "string" },
                  category: { type: "string" },
                  message: { type: "string" },
                  attachments: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Ticket created" },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
      get: {
        tags: ["Tickets"],
        summary: "List all tickets (admin)",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "List of tickets" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/tickets/my": {
      get: {
        tags: ["Tickets"],
        summary: "List the current user's tickets",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "List of tickets" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/tickets/assigned": {
      get: {
        tags: ["Tickets"],
        summary: "List tickets assigned to the admin",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "List of assigned tickets" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/tickets/{ticketId}/accept": {
      patch: {
        tags: ["Tickets"],
        summary: "Accept / assign a ticket to the admin",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/TicketIdParam" }],
        responses: {
          "200": { description: "Ticket assigned" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/tickets/admin/{ticketId}": {
      get: {
        tags: ["Tickets"],
        summary: "Get a ticket (admin view)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/TicketIdParam" }],
        responses: {
          "200": { description: "Ticket" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/tickets/admin/{ticketId}/messages": {
      get: {
        tags: ["Tickets"],
        summary: "Get ticket messages (admin view)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/TicketIdParam" }],
        responses: {
          "200": { description: "Messages" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/tickets/{ticketId}/close": {
      patch: {
        tags: ["Tickets"],
        summary: "Close a ticket (admin)",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/TicketIdParam" }],
        responses: {
          "200": { description: "Ticket closed" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/tickets/{ticketId}": {
      get: {
        tags: ["Tickets"],
        summary: "Get a ticket by ID",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/TicketIdParam" }],
        responses: {
          "200": { description: "Ticket" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/tickets/{ticketId}/messages": {
      get: {
        tags: ["Tickets"],
        summary: "Get ticket messages",
        security: [{ CookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/TicketIdParam" }],
        responses: {
          "200": { description: "Messages" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      CookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "access_token",
        description:
          "httpOnly JWT access token cookie set by POST /auth/login-user (or /auth/social-auth / /auth/refresh-token).",
      },
    },
    parameters: {
      IdParam: {
        name: "id",
        in: "path",
        required: true,
        description: "MongoDB ObjectId",
        schema: { type: "string" },
      },
      UserIdParam: {
        name: "userId",
        in: "path",
        required: true,
        description: "MongoDB ObjectId of the user",
        schema: { type: "string" },
      },
      CourseIdParam: {
        name: "courseId",
        in: "path",
        required: true,
        description: "MongoDB ObjectId of the course",
        schema: { type: "string" },
      },
      CourseIdPathParam: {
        name: "courseId",
        in: "path",
        required: true,
        description: "MongoDB ObjectId of the course",
        schema: { type: "string" },
      },
      CategoryIdParam: {
        name: "categoryId",
        in: "path",
        required: true,
        description: "MongoDB ObjectId of the category",
        schema: { type: "string" },
      },
      TicketIdParam: {
        name: "ticketId",
        in: "path",
        required: true,
        description: "MongoDB ObjectId of the ticket",
        schema: { type: "string" },
      },
      EmailQueryParam: {
        name: "email",
        in: "query",
        required: true,
        schema: { type: "string", format: "email" },
      },
    },
    responses: {
      Unauthorized: {
        description: "Missing, invalid, or expired session",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string" },
              },
            },
          },
        },
      },
      Forbidden: {
        description: "The current role is not allowed to access this resource",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string" },
              },
            },
          },
        },
      },
      BadRequest: {
        description: "Invalid request payload",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string" },
              },
            },
          },
        },
      },
      Error: {
        description: "Error response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string" },
              },
            },
          },
        },
      },
      Analytics: {
        description: "Analytics payload",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                data: {
                  type: "object",
                  additionalProperties: true,
                },
              },
            },
          },
        },
      },
    },
    schemas: {
      Avatar: {
        type: "object",
        properties: {
          public_Id: { type: "string" },
          url: { type: "string" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          provider: { type: "string", enum: ["local", "google", "github"] },
          role: { type: "string", enum: ["user", "instructor", "admin"] },
          status: { type: "string", enum: ["pending", "active", "suspended"] },
          avatar: { $ref: "#/components/schemas/Avatar" },
          isVerified: { type: "boolean" },
          isDeleted: { type: "boolean" },
          courses: {
            type: "array",
            items: { type: "string" },
          },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      RegistrationBody: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password", minLength: 6 },
          avatar: { $ref: "#/components/schemas/Avatar" },
        },
      },
      ActivationBody: {
        type: "object",
        required: ["activation_token", "activation_code"],
        properties: {
          activation_token: { type: "string" },
          activation_code: { type: "string" },
        },
      },
      LoginBody: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      SocialAuthBody: {
        type: "object",
        required: ["email", "name"],
        properties: {
          email: { type: "string", format: "email" },
          name: { type: "string" },
          provider: { type: "string", enum: ["google", "github"] },
          avatar: { $ref: "#/components/schemas/Avatar" },
        },
      },
      ForgotPasswordBody: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
      ResetPasswordBody: {
        type: "object",
        required: ["token", "password"],
        properties: {
          token: { type: "string" },
          password: { type: "string", format: "password", minLength: 6 },
        },
      },
      UpdateUserInfoBody: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
        },
      },
      UpdatePasswordBody: {
        type: "object",
        required: ["oldPassword", "newPassword"],
        properties: {
          oldPassword: { type: "string", format: "password" },
          newPassword: { type: "string", format: "password", minLength: 6 },
        },
      },
      UpdateAvatarBody: {
        type: "object",
        required: ["avatar"],
        properties: {
          avatar: { $ref: "#/components/schemas/Avatar" },
        },
      },
      ChangeRoleBody: {
        type: "object",
        required: ["id", "role"],
        properties: {
          id: { type: "string" },
          role: { type: "string", enum: ["user", "instructor", "admin"] },
        },
      },
      CreateMemberBody: {
        type: "object",
        required: ["name", "email", "password", "role"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password", minLength: 6 },
          role: { type: "string", enum: ["user", "instructor", "admin"] },
          isVerified: { type: "boolean", default: false },
        },
      },
      Link: {
        type: "object",
        properties: {
          title: { type: "string" },
          url: { type: "string" },
        },
      },
      QnAReply: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
          answer: { type: "string" },
        },
      },
      Question: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
          question: { type: "string" },
          questionReplies: {
            type: "array",
            items: { $ref: "#/components/schemas/QnAReply" },
          },
        },
      },
      ReviewReply: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
          comment: { type: "string" },
        },
      },
      Review: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
          rating: { type: "number", minimum: 1, maximum: 5 },
          comment: { type: "string" },
          commentReplies: {
            type: "array",
            items: { $ref: "#/components/schemas/ReviewReply" },
          },
        },
      },
      CourseData: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          videoUrl: { type: "string" },
          videoThumbnail: { type: "object", additionalProperties: true },
          videoSection: { type: "string" },
          videoLength: { type: "number" },
          isFree: { type: "boolean" },
          videoPlayer: { type: "string" },
          suggestion: { type: "string" },
          links: {
            type: "array",
            items: { $ref: "#/components/schemas/Link" },
          },
          questions: {
            type: "array",
            items: { $ref: "#/components/schemas/Question" },
          },
        },
      },
      Course: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          price: { type: "number" },
          estimatePrice: { type: "number" },
          thumbnail: { $ref: "#/components/schemas/Avatar" },
          organization: { type: "string" },
          instructor: { type: "string" },
          createdBy: { type: "string" },
          tags: { type: "string" },
          level: { type: "string" },
          demoUrl: { type: "string" },
          status: { type: "string", enum: ["draft", "published", "archived"] },
          benefits: {
            type: "array",
            items: { type: "object", properties: { title: { type: "string" } } },
          },
          prerequisites: {
            type: "array",
            items: { type: "object", properties: { title: { type: "string" } } },
          },
          reviews: {
            type: "array",
            items: { $ref: "#/components/schemas/Review" },
          },
          courseData: {
            type: "array",
            items: { $ref: "#/components/schemas/CourseData" },
          },
          ratings: { type: "number" },
          purchased: { type: "number" },
          reviewsCount: { type: "number" },
          totalLectures: { type: "number" },
          totalHours: { type: "number" },
        },
      },
      CreateCourseBody: {
        type: "object",
        required: [
          "name",
          "description",
          "category",
          "price",
          "estimatePrice",
          "tags",
          "level",
          "demoUrl",
          "benefits",
          "prerequisites",
          "thumbnail",
          "courseData",
        ],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          price: { type: "number" },
          estimatePrice: { type: "number" },
          tags: { type: "string" },
          level: { type: "string" },
          demoUrl: { type: "string" },
          status: { type: "string", enum: ["draft", "published", "archived"] },
          thumbnail: { $ref: "#/components/schemas/Avatar" },
          benefits: {
            type: "array",
            items: { type: "object", properties: { title: { type: "string" } } },
          },
          prerequisites: {
            type: "array",
            items: { type: "object", properties: { title: { type: "string" } } },
          },
          courseData: {
            type: "array",
            items: { $ref: "#/components/schemas/CourseData" },
          },
        },
      },
      AddQuestionBody: {
        type: "object",
        required: ["question", "courseId", "contentId"],
        properties: {
          question: { type: "string" },
          courseId: { type: "string" },
          contentId: { type: "string" },
        },
      },
      AddAnswerBody: {
        type: "object",
        required: ["answer", "questionId", "contentId", "courseId"],
        properties: {
          answer: { type: "string" },
          questionId: { type: "string" },
          contentId: { type: "string" },
          courseId: { type: "string" },
        },
      },
      AddReviewBody: {
        type: "object",
        required: ["rating", "review"],
        properties: {
          rating: { type: "number", minimum: 1, maximum: 5 },
          review: { type: "string" },
        },
      },
      AddReplyReviewBody: {
        type: "object",
        required: ["comment", "reviewId", "courseId"],
        properties: {
          comment: { type: "string" },
          reviewId: { type: "string" },
          courseId: { type: "string" },
        },
      },
      PaymentIntentBody: {
        type: "object",
        required: ["courseId"],
        properties: {
          courseId: { type: "string" },
        },
      },
      InstructorApplicationBody: {
        type: "object",
        required: [
          "name",
          "email",
          "password",
          "confirmPassword",
          "organizationName",
        ],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password", minLength: 6 },
          confirmPassword: { type: "string", format: "password" },
          organizationName: { type: "string" },
          organizationDescription: { type: "string" },
        },
      },
      LayoutBody: {
        type: "object",
        required: ["type", "data"],
        properties: {
          type: { type: "string" },
          data: { type: "object", additionalProperties: true },
        },
      },
      Category: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CategoryBody: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string" },
        },
      },
      Notification: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          message: { type: "string" },
          status: { type: "string", enum: ["unread", "read"] },
          user: { type: "string" },
          organization: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Certificate: {
        type: "object",
        properties: {
          _id: { type: "string" },
          courseId: { type: "string" },
          userId: { type: "string" },
          certificateUrl: { type: "string" },
          issuedAt: { type: "string", format: "date-time" },
        },
      },
      InstructorApplication: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          organizationName: { type: "string" },
          organizationDescription: { type: "string" },
          status: { type: "string", enum: ["pending", "approved", "rejected"] },
          reviewedBy: { type: "string" },
          reviewedAt: { type: "string", format: "date-time" },
          rejectionReason: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Organization: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          logo: { $ref: "#/components/schemas/Avatar" },
          status: { type: "string", enum: ["active", "suspended"] },
          instructor: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Ticket: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          assignedTo: { type: "string", nullable: true },
          subject: { type: "string" },
          category: { type: "string" },
          message: { type: "string" },
          status: { type: "string", enum: ["open", "in_progress", "closed"] },
          attachments: {
            type: "array",
            items: { type: "string" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Order: {
        type: "object",
        properties: {
          _id: { type: "string" },
          courseId: { type: "string" },
          userId: { type: "string" },
          payment_info: { type: "object", additionalProperties: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};