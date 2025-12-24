import { relations } from 'drizzle-orm';

import user from './user';
import plan from './plan';
import feature from './feature';
import shortUrl from './shortUrl';
import tag from './tag';
import urlProtection from './urlProtection';
import urlTag from './urlTag';

export const planRelations = relations(plan, ({ many }) => ({
    users: many(user),
    features: many(feature),
}))

export const featureRelations = relations(feature, ({one}) => ({
    plan: one(plan, {fields: [feature.planId], references: [plan.id]}),
}))

export const shortUrlRelations = relations(shortUrl, ({ one, many }) => ({
    user: one(user, { fields: [shortUrl.userId], references: [user.id] }),
    protection: one(urlProtection, { fields: [shortUrl.id], references: [urlProtection.urlId] }),
    tags: many(urlTag),
}))

export const tagRelations = relations(tag, ({ one, many }) => ({
    user: one(user, { fields: [tag.userId], references: [user.id] }),
    urlTags: many(urlTag),
}))

export const urlProtectionRelations = relations(urlProtection, ({ one }) => ({
    url: one(shortUrl, { fields: [urlProtection.urlId], references: [shortUrl.id] }),
}))

export const urlTagRelations = relations(urlTag, ({ one }) => ({
    url: one(shortUrl, { fields: [urlTag.urlId], references: [shortUrl.id] }),
    tag: one(tag, { fields: [urlTag.tagId], references: [tag.id] }),
}))

export const userRelations = relations(user, ({ one, many }) => ({
    plan: one(plan, { fields: [user.planId], references: [plan.id] }),
    urls: many(shortUrl),
    tags: many(tag)
}))
