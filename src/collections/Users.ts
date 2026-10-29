import { APIError, type CollectionConfig } from "payload";

// Only people with an account can open /admin, and only a signed-in user can
// add more accounts. The very first account is the exception: Payload offers it
// to whoever opens /admin first, so that's locked too unless ALLOW_FIRST_ADMIN
// is "true". Set it, create your account, then remove it and redeploy.
export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email" },
  auth: true,
  access: {
    create: ({ req }) => Boolean(req.user),
  },
  hooks: {
    // Runs for every way of creating a user (admin form, REST, GraphQL, local
    // API), including Payload's first-user signup, which skips access rules.
    beforeOperation: [
      ({ operation, req }) => {
        if (
          operation === "create" &&
          !req.user &&
          process.env.ALLOW_FIRST_ADMIN !== "true"
        ) {
          throw new APIError(
            "Creating the first admin account is switched off. Set ALLOW_FIRST_ADMIN=true to allow it.",
            403,
            undefined,
            true,
          );
        }
      },
    ],
  },
  fields: [],
};
