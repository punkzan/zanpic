/**
 * English programmatic SEO data: Social media image size specifications.
 * The source data in social-media-sizes.ts is already maintained in English,
 * so this file re-exports it for the /en/ route consistency.
 */

export {
  SOCIAL_MEDIA_SIZES as EN_SOCIAL_MEDIA_SIZES,
  type SocialMediaSize,
  getSocialMediaSize as getEnSocialMediaSize,
  getSocialMediaSlugs as getEnSocialMediaSlugs,
} from './social-media-sizes'
