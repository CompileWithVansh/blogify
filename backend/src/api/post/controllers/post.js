'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({
  // Increment view count when a post is fetched by slug
  async findOne(ctx) {
    const { id } = ctx.params;

    // Try to increment views (non-blocking)
    try {
      const entity = await strapi.db.query('api::post.post').findOne({
        where: { slug: id },
      });
      if (entity) {
        await strapi.db.query('api::post.post').update({
          where: { id: entity.id },
          data: { views: (entity.views || 0) + 1 },
        });
      }
    } catch (_) {}

    return super.findOne(ctx);
  },
}));
