/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user: (import('better-auth').User & {
          planId?: string | null
          isActive?: boolean | null
        }) | null
    session: import('better-auth').Session | null
  }
}

