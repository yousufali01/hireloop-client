import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { role } from "better-auth/plugins"

const mongoUri = process.env.BETTER_AUTH_DB_URI
const authSecret = process.env.BETTER_AUTH_SECRET

if (!mongoUri) {
  throw new Error("BETTER_AUTH_DB_URI is missing in .env")
}

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET is missing in .env")
}

const client = new MongoClient(mongoUri)
const db = client.db("hireloop") // Use the database name you want for your app

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  secret: authSecret,

  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: true,
      },
      // Editable profile fields (see update-user endpoint)
      phone: {
        type: "string",
        required: false,
        input: true,
        defaultValue: "",
      },
      address: {
        type: "string",
        required: false,
        input: true,
        defaultValue: "",
      },
    },
  },

  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),
})
